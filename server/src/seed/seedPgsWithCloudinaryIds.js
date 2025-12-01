// server/src/seed/seedPgsWithCloudinaryIds.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Pg from "../models/Pg.js";

dotenv.config({ path: "./.env" });

async function getOrCreateOwner() {
  let owner = await User.findOne({
    role: "owner",
    email: "owner@campusnest.com",
  });

  if (owner) {
    console.log("👤 Using existing owner:", owner.email);
    return owner;
  }

  const passwordHash = await bcrypt.hash("owner123", 10);

  owner = await User.create({
    name: "Demo Owner",
    email: "owner@campusnest.com",
    passwordHash,
    role: "owner",
    phone: "9999999999",
  });

  console.log("👤 Created owner: owner@campusnest.com / owner123");
  return owner;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 10 });
    console.log("✅ Connected to MongoDB");

    const owner = await getOrCreateOwner();

    // 🔗 Cloudinary public IDs (folder/name without extension)
    // Make sure these match what you see in Cloudinary
    const CLOUDINARY_IDS = [
      "campusnest/seed/pexels-fotoaibe-1571450",
      "campusnest/seed/pexels-fotoaibe-1743229",
      "campusnest/seed/pexels-itsterrymag-2631746",
      "campusnest/seed/pexels-julieaagaard-1374125",
      "campusnest/seed/pexels-marywhitneyph-90319",
      "campusnest/seed/pexels-pixabay-262048",
      "campusnest/seed/pexels-pixabay-271618",
      "campusnest/seed/pexels-pixabay-271619",
      "campusnest/seed/pexels-pixabay-279746",
    ];

    const basePgs = [
      {
        name: "Koramangala Residency",
        area: "Koramangala",
        address: "6th Block",
        city: "Bengaluru",
        rating: 4.7,
      },
      {
        name: "HSR Classic PG",
        area: "HSR Layout",
        address: "Sector 2",
        city: "Bengaluru",
        rating: 4.3,
      },
      {
        name: "Indiranagar Comfort Stay",
        area: "Indiranagar",
        address: "100 ft Road",
        city: "Bengaluru",
        rating: 4.8,
      },
      {
        name: "BTM Elite PG",
        area: "BTM Layout",
        address: "2nd Stage",
        city: "Bengaluru",
        rating: 4.2,
      },
      {
        name: "Whitefield Tech Stay",
        area: "Whitefield",
        address: "Near ITPL",
        city: "Bengaluru",
        rating: 4.5,
      },
      {
        name: "Marathahalli Comfort PG",
        area: "Marathahalli",
        address: "Outer Ring Road",
        city: "Bengaluru",
        rating: 4.1,
      },
      {
        name: "Electronic City Nest",
        area: "Electronic City",
        address: "Phase 1",
        city: "Bengaluru",
        rating: 4.0,
      },
      {
        name: "Hebbal Lake View PG",
        area: "Hebbal",
        address: "Near Hebbal Lake",
        city: "Bengaluru",
        rating: 4.4,
      },
      {
        name: "Jayanagar Premium Stay",
        area: "Jayanagar",
        address: "4th Block",
        city: "Bengaluru",
        rating: 4.6,
      },
    ];

    const count = Math.min(basePgs.length, CLOUDINARY_IDS.length);

    await Pg.deleteMany({});
    console.log("🧹 Cleared Pg collection");

    const pgsData = [];
    for (let i = 0; i < count; i++) {
      pgsData.push({
        ...basePgs[i],
        facilities: { wifi: true, hotWater: true, timings: "24x7" },
        rentOptions: [
          { sharing: "single", price: 15000 + i * 500 },
          { sharing: "double", price: 11000 + i * 500 },
        ],
        owner: owner._id,
        // 👇 Store Cloudinary public ID (folder/name)
        photos: [CLOUDINARY_IDS[i]],
      });
    }

    const created = await Pg.insertMany(pgsData);
    console.log(`✅ Inserted ${created.length} PGs with Cloudinary IDs`);
  } catch (err) {
    console.error("❌ Error seeding PGs:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
