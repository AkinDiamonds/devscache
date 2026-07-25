import jwt from "jsonwebtoken";
import { env } from "#config/env.js";
import { CONSTANTS } from "#config/constants/index.js";
import { hashPassword, comparePassword } from "#shared/utils/hash.js";
import { ConflictError, UnauthorizedError } from "#shared/utils/errors.js";
import * as usersRepo from "#features/users/users.repository.js";
import { toUserPublic } from "#features/users/users.types.js";
import type { RegisterInput, LoginInput } from "./auth.schemas.js";


interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResult {
    user: ReturnType<typeof toUserPublic>;
    tokens: TokenPair;
}

function generateTokenPair(payload: { id: string; email: string }): TokenPair {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] & (string | number),
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] & (string | number),
    });
    return { accessToken, refreshToken };
}

function refreshExpiry(): Date {
    const date = new Date();
    date.setDate(date.getDate() + CONSTANTS.REFRESH_TOKEN_EXPIRY_DAYS)
    
    return date;
}

export async function register(data: RegisterInput): Promise<AuthResult> {
    const [existingEmail, existingUsername] = await Promise.all([
        usersRepo.findUserByEmail(data.email),
        usersRepo.findUserByUsername(data.username)
    ])

    if (existingEmail) throw new ConflictError("Email is already registered");
    if (existingUsername) throw new ConflictError("Username is already taken");

    const passwordHash = await hashPassword(data.password);
    const user = await usersRepo.create({
        email: data.email,
        username: data.username,
        passwordHash
    });

    const tokens = generateTokenPair({ id: user.id, email: user.email});
    await usersRepo.createRefreshToken({
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: refreshExpiry(),
    });

    return { user: toUserPublic(user), tokens }
}

export async function login(data: LoginInput): Promise<AuthResult> {
    const user = await usersRepo.findUserByEmail(data.email); // this means users have to login with email and not username, or it won't find it.... bug loading niyen
    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isValid = comparePassword(data.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError("Invalid email or password");

    const tokens = generateTokenPair({ id: user.id, email: user.email });
    await usersRepo.createRefreshToken({
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: refreshExpiry(),
    });

    return { user: toUserPublic(user), tokens };
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { id: string; email: string };
    try { 
        payload = jwt.verify(refreshToken, env.JWT_SECRET) as typeof payload;
    } catch {
        throw new UnauthorizedError("Invalid or expired refresh token")
    }

    const storedToken = await usersRepo.findRefreshToken(refreshToken);
    if (!storedToken) throw new UnauthorizedError("Refresh Token has been revoked");
    if (storedToken.expiresAt < new Date()) {
        await usersRepo.deleteRefreshToken(refreshToken);
        throw new UnauthorizedError("Refresh token has expired");
    }

    // Rotate:  delete old, issue new, incase token is stolen
    await usersRepo.deleteRefreshToken(refreshToken);
    const newTokens = generateTokenPair({ id: payload.id, email: payload.email });
    await usersRepo.createRefreshToken({
        userId: payload.id,
        token: newTokens.refreshToken,
        expiresAt: refreshExpiry(),
    });

    return newTokens;
}

export async function logout(refreshToken: string): Promise<void> {
    await usersRepo.deleteRefreshToken(refreshToken); // logs out this device only
}

export async function logoutAll(userId: string): Promise<void> {
    await usersRepo.deleteAllRefreshTokensForUser(userId); // Logs out on all devices
}