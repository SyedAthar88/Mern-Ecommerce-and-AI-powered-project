import app from "./src/app.js";
import { connDB } from "./src/config/db.js"; 
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    // 1. Connt to MongoDB first
    await connDB();

    // 2. Start Express server
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();