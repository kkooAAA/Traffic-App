import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to Remote MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected to remote successfully!");
  } catch (error) {
    console.error("❌ REMOTE CONNECTION FAILED:");
    console.error(error.message);
    
    if (process.env.USE_MEMORY_DB === 'true') {
        console.log("Falling back to Memory Server as requested...");
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log("MongoDB Connected to Memory Server:", uri);
    } else {
        console.log("\n--- SENIOR TIP ---");
        console.log("Your data isn't showing in Atlas because the connection failed.");
        console.log("Check if your IP is whitelisted in MongoDB Atlas (Network Access).");
        console.log("If you want to use the temporary DB anyway, set USE_MEMORY_DB=true in .env");
        process.exit(1); // Stop the server so the user sees the error
    }
  }
};

export default connectDB;
