import { NotFoundError } from "#shared/utils/errors.js";
import * as repo from "./users.repository.js";
import { toUserPublic } from "./users.types.js";
import { hashPassword } from "#shared/utils/hash.js";

import type { UserPublic } from "./users.types.js";
import type { CreateUserInput, UpdateUserInput } from "./users.schemas.js";

export async function create(data: CreateUserInput): Promise<UserPublic> {
    const passwordHash = await hashPassword(data.password)
    const { password: _, ...newUserdata } = data

    const item = await repo.create({ ...newUserdata, passwordHash, })

    return toUserPublic(item)
}

export async function update(id: string, data: UpdateUserInput): Promise<UserPublic> {
    const updated = await repo.update(id, data);
    if (!updated) throw new NotFoundError("User");
    return toUserPublic(updated)
}

export async function getById(id: string): Promise<UserPublic> {
    const item = await repo.findById(id)
    if (!item) throw new NotFoundError("User");
    return toUserPublic(item)
}

export async function remove(id: string): Promise<void> {
    const item = await repo.findById(id)
    if (!item) throw new NotFoundError("User");
    await repo.softDelete(id);
}