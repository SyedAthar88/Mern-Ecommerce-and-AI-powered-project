import { env } from "../config/env.js";

// ==========================================
// Expiry times (in milliseconds)
// ==========================================
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;           // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// ==========================================
// Base cookie options (no maxAge — that's per-cookie)
// ==========================================
const baseCookieOptions = {
  httpOnly: true,                          // JS can't read → XSS protection
  secure: env.NODE_ENV === "production",   // HTTPS only in prod
  sameSite: "strict",                      // CSRF protection
  path: "/",                               // available on all routes
};

// ==========================================
// Set BOTH cookies (used on login AND on refresh rotation)
// ==========================================
export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

// ==========================================
// Clear BOTH cookies (used on logout)
// ⚠️ NO maxAge here — otherwise cookies won't clear in some browsers
// ==========================================
export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};