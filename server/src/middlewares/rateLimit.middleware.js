import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// ==========================================
// Skip rate limiting in test environment
// (so tests don't randomly fail)
// ==========================================
const skip = () => env.NODE_ENV === "test";

// ==========================================
// Helper to build a limiter
// ==========================================
const buildLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    skip,
    standardHeaders: true,   // Return RateLimit-* headers
    legacyHeaders: false,    // Disable X-RateLimit-* (deprecated)
    message: {
      success: false,
      statusCode: 429,
      message,
      errors: [],
    },
  });

// ==========================================
// 1. General API limiter
//    100 requests per 15 min per IP
// ==========================================
export const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

// ==========================================
// 2. Auth limiter (login, signup)
//    5 requests per 15 min per IP
// ==========================================
export const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

// ==========================================
// 3. Forgot password limiter
//    3 requests per hour per IP
// ==========================================
export const forgotPasswordLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset requests. Please try again in 1 hour.",
});

// ==========================================
// 4. Refresh token limiter (more lenient)
//    Because legit users refresh often
//    30 requests per 15 min per IP
// ==========================================
export const refreshLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many token refresh attempts. Please try again later.",
});