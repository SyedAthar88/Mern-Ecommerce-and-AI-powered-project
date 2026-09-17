import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

// NEW IMPORTS ⬇️
import authRoutes from "./routes/auth.routes.js";
import userRoutes  from './routes/user.routes.js'
import { errorHandler } from "./middlewares/error.middleware.js";
const app=express();

//security headders
app.use(helmet());
//cors
app.use(
    cors(
        {
            origin : env.CLIENT_URL,
            credentials:true
        }
    )
)

//body-parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// cookie-parser 
app.use(cookieParser());
// Logger
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// for health check api 
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});
// NEW ⬇️ — auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users" ,userRoutes)
// ===============================
// 404 HANDLER (must be after all routes)
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});
// NEW ⬇️ — error handler MUST be last
app.use(errorHandler);
export default app;