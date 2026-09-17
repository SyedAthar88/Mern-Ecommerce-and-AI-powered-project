import mongoose from 'mongoose';


import { env } from "./env.js";    // ← with .js ✅
export const connDB=async()=>{
try {
    const conn=await mongoose.connect(env.MONGO_URI);
    console.log(`mongoose connection on : ${conn.connection.host}` );
    
} catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
}
}