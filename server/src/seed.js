import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Pg from "./models/Pg.js";
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});
  await Pg.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);
  const owner1 = await User.create({ name: "Ravi Kumar", email: "owner1@campusnest.in", passwordHash, role: "owner", phone: "9898989898" });
  const owner2 = await User.create({ name: "Asha Patel", email: "owner2@campusnest.in", passwordHash, role: "owner", phone: "9876501234" });
  await User.create({ name: "Student One", email: "student1@campusnest.in", passwordHash, role: "seeker", phone: "9000000001" });
  await User.create({ name: "Student Two", email: "student2@campusnest.in", passwordHash, role: "seeker", phone: "9000000002" });

  const pics = (id) => [`https://picsum.photos/seed/${id}/800/600`];

  await Pg.create([
    {
      name: "Green Leaf PG",
      area: "Koramangala",
      address: "5th Block, Near Forum",
      city: "Bengaluru",
      rating: 4.6,
      facilities: { wifi: true, hotWater: true, timings: "5am-11pm" },
      rentOptions: [
        { sharing: "single", price: 14000 },
        { sharing: "double", price: 9000 },
        { sharing: "triple", price: 7000 }
      ],
      owner: owner1._id,
      photos: pics("greenleaf")
    },
    {
      name: "Skyline Stay PG",
      area: "HSR Layout",
      address: "Sector 2, Opp. Park",
      city: "Bengaluru",
      rating: 4.4,
      facilities: { wifi: true, hotWater: true, timings: "24x7" },
      rentOptions: [
        { sharing: "single", price: 13500 },
        { sharing: "double", price: 8500 },
        { sharing: "triple", price: 6500 }
      ],
      owner: owner1._id,
      photos: pics("skyline")
    },
    {
      name: "Comfort Cove PG",
      area: "Andheri West",
      address: "Near Infinity Mall",
      city: "Mumbai",
      rating: 4.7,
      facilities: { wifi: true, hotWater: true, timings: "6am-10pm" },
      rentOptions: [
        { sharing: "single", price: 18000 },
        { sharing: "double", price: 12000 }
      ],
      owner: owner2._id,
      photos: pics("comfortcove")
    },
    {
      name: "City Lights PG",
      area: "Gachibowli",
      address: "Near DLF Building",
      city: "Hyderabad",
      rating: 4.5,
      facilities: { wifi: true, hotWater: false, timings: "5am-11pm" },
      rentOptions: [
        { sharing: "single", price: 12000 },
        { sharing: "double", price: 8000 },
        { sharing: "triple", price: 6000 }
      ],
      owner: owner2._id,
      photos: pics("citylights")
    }
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
