import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import models
import Pg from "../src/models/Pg.js";
import User from "../src/models/User.js";

const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error("❌ MONGODB_URI missing. Check server/.env");
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ Connected to MongoDB Atlas");

  try {
    // Ensure an OWNER user exists
    let owner = await User.findOne({ email: "owner@campusnest.com" });
    if (!owner) {
      const hash = await bcrypt.hash("password123", 10);
      owner = await User.create({
        name: "Campus Owner",
        email: "owner@campusnest.com",
        phone: "9876543210",
        role: "owner",
        passwordHash: hash,
      });
      console.log("👤 Created owner:", owner.email);
    } else {
      console.log("👤 Using existing owner:", owner.email);
    }

    // Clear existing PGs
    await Pg.deleteMany({});
    console.log("🗑️  Old PGs removed");

    // PG data list
    const pgs = [
      {
        name: "Koramangala Residency",
        area: "Koramangala",
        address: "6th Block",
        city: "Bengaluru",
        rating: 4.7,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 15000 },
          { sharing: "double", price: 10000 },
        ],
        photos: ["https://i.postimg.cc/K4rvHPHd/Untitled-2.jpg"],
        owner: owner._id,
      },
      {
        name: "Basavanagudi Comfort Stay",
        area: "Basavanagudi",
        address: "Gandhi Bazaar Main Road",
        city: "Bengaluru",
        rating: 4.6,
        facilities: { wifi: true, hotWater: true, timings: "6am–10pm" },
        rentOptions: [
          { sharing: "single", price: 12000 },
          { sharing: "double", price: 8500 },
        ],
        photos: ["https://i.postimg.cc/c6M4bRzG/Untitled.jpg"],
        owner: owner._id,
      },
      {
        name: "BTM Comfort PG",
        area: "BTM Layout",
        address: "1st Stage, 7th Main",
        city: "Bengaluru",
        rating: 4.2,
        facilities: { wifi: true, hotWater: true, timings: "6am–11pm" },
        rentOptions: [
          { sharing: "single", price: 12500 },
          { sharing: "double", price: 8800 },
        ],
        photos: ["https://i.postimg.cc/Hj4shwhh/Untitled-6.jpg"],
        owner: owner._id,
      },
      {
        name: "HSR Classic PG",
        area: "HSR Layout",
        address: "Sector 2",
        city: "Bengaluru",
        rating: 4.3,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 13000 },
          { sharing: "double", price: 9000 },
        ],
        photos: ["https://i.postimg.cc/RqQVD7Dp/Untitled-8.jpg"],
        owner: owner._id,
      },
      {
        name: "Whitefield Elite PG",
        area: "Whitefield",
        address: "Main Road, Near Forum Value Mall",
        city: "Bengaluru",
        rating: 4.5,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 14000 },
          { sharing: "double", price: 9500 },
        ],
        photos: ["https://i.postimg.cc/fkjTrcr8/Untitled-9.jpg"],
        owner: owner._id,
      },
      {
        name: "Indiranagar Premium Stay",
        area: "Indiranagar",
        address: "12th Main Road",
        city: "Bengaluru",
        rating: 4.8,
        facilities: { wifi: true, hotWater: true, timings: "6am–11pm" },
        rentOptions: [
          { sharing: "single", price: 16000 },
          { sharing: "double", price: 11000 },
        ],
        photos: ["https://i.postimg.cc/6TL5mrmP/Untitled-5.jpg"],
        owner: owner._id,
      },
      {
        name: "Jayanagar Deluxe PG",
        area: "Jayanagar",
        address: "9th Block",
        city: "Bengaluru",
        rating: 4.4,
        facilities: { wifi: true, hotWater: true, timings: "5am–10pm" },
        rentOptions: [
          { sharing: "single", price: 12500 },
          { sharing: "double", price: 8500 },
        ],
        photos: ["https://i.postimg.cc/xqyT4v4B/Untitled-4.jpg"],
        owner: owner._id,
      },
      {
        name: "Banashankari Residency",
        area: "Banashankari",
        address: "2nd Stage",
        city: "Bengaluru",
        rating: 4.1,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 11500 },
          { sharing: "double", price: 7800 },
        ],
        photos: ["https://i.postimg.cc/DmdyMrMY/Untitled-7.jpg"],
        owner: owner._id,
      },
      {
        name: "Rajajinagar Cozy PG",
        area: "Rajajinagar",
        address: "6th Block, Dr Rajkumar Road",
        city: "Bengaluru",
        rating: 4.0,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 11000 },
          { sharing: "double", price: 7500 },
        ],
        photos: ["https://i.postimg.cc/K4rvHPWX/Untitled-3.jpg"],
        owner: owner._id,
      },
      {
        name: "Malleshwaram Heritage PG",
        area: "Malleshwaram",
        address: "Margosa Road",
        city: "Bengaluru",
        rating: 4.6,
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 13500 },
          { sharing: "double", price: 9500 },
        ],
        photos: ["https://i.postimg.cc/K4rvHPWS/Untitled-1.jpg"],
        owner: owner._id,
      },
    ];

    await Pg.insertMany(pgs);
    console.log(`🌱 Seeded ${pgs.length} PGs to Atlas`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
    process.exit(0);
  }
}

run();
