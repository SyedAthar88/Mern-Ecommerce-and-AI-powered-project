import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();

// ==========================================
// Trust proxy (needed when behind Nginx/Heroku)
// In dev, leave it off
// ==========================================
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ==========================================
// SECURITY — Helmet
// ==========================================
app.use(
  helmet({
    // Allow frontend to read Set-Cookie if needed
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // CSP: relaxed for our own API (no HTML served here)
    contentSecurityPolicy:
      env.NODE_ENV === "production" ? undefined : false,
  })
);

// ==========================================
// CORS — allow our frontend only
// ==========================================
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,           // ⚠️ required for cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset"],
  })
);

// ==========================================
// BODY PARSERS — with size limits
// ==========================================
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ==========================================
// COOKIE PARSER
// ==========================================
app.use(cookieParser());

// ==========================================
// LOGGER
// ==========================================
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ==========================================
// RATE LIMITING — global, applied to all /api routes
// Specific routes (login, forgot) have their own strict limiters
// ==========================================
app.use("/api", apiLimiter);

// ==========================================
// ROUTES
// ==========================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ==========================================
// ERROR HANDLER (must be last)
// ==========================================
app.use(errorHandler);

export default app;