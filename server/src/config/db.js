// server/src/config/db.js
import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || typeof uri !== "string") {
    // Make it super obvious what's wrong
    console.error("❌ MONGODB_URI is missing/invalid.");
    console.error("   Tip: set it in server/.env and load it BEFORE connectDB().");
    throw new Error("MONGODB_URI not set");
  }

  // Optional: quiet strict warnings
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB Connected:", mongoose.connection.name);
    mongoose.connection.on("error", err => {
      console.error("Mongo connection error:", err?.message || err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("Mongo disconnected");
    });
  } catch (err) {
    console.error("MongoDB error:", err?.message || err);
    throw err;
  }
}
