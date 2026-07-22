import rateLimit from "express-rate-limit";

// global limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15min window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many requests. Please try again later.",
    },
})


//  Auth routes limiter (register, login)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // User can only make 10 auth attempts every 15min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        statusCode: 429,
        message: "Too many authentication attempts. Please wait 15 minutes.",
    },
});