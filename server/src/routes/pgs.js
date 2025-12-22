import express from "express";
import mongoose from "mongoose";
import Pg from "../models/Pg.js";
import { authRequired } from "../middlewares/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ---------- GET TOP PGs (HOME PAGE) ---------- */
// ✅ OWNER PGs — MUST BE ABOVE "/:id"
router.get("/mine", authRequired(["owner"]), async (req, res) => {
  try {
    const items = await Pg.find({ owner: req.user.id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to load owner PGs" });
  }
});

// ✅ TOP PGs
router.get("/top", async (req, res) => {
  const items = await Pg.find({})
    .sort({ rating: -1, createdAt: -1 })
    .limit(10);
  res.json(items);
});

// ✅ ALL PGs (With Correct Sharing Field)
router.get("/", async (req, res) => {
  try {
    const { area, sort, limit, minRating, sharing } = req.query;

    let filter = {};

    // 1. Search by Area OR Name
    if (area) {
      filter.$or = [
        { area: { $regex: area, $options: "i" } },
        { name: { $regex: area, $options: "i" } }
      ];
    }

    // 2. Filter by Rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // 3. Filter by Sharing (Matches your DB field: rentOptions.sharing)
    if (sharing) {
      filter.rentOptions = { 
        $elemMatch: { sharing: { $regex: `^${sharing}$`, $options: "i" } } 
      };
    }

    const items = await Pg.find(filter)
      .sort(sort === "rating_desc" ? { rating: -1 } : { createdAt: -1 })
      .limit(parseInt(limit) || 24);

    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch PGs" });
  }
});

// ❌ ALWAYS LAST
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ error: "Invalid PG id" });

  const pg = await Pg.findById(req.params.id);
  if (!pg) return res.status(404).json({ error: "PG not found" });

  res.json(pg);
});


/* ---------- CREATE PG (OWNER ONLY) ---------- */
router.post(
  "/",
  authRequired(["owner"]),
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "foodPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const photos = [];
      let foodTimingsPhoto = null;

      if (req.files?.photos) {
        for (const file of req.files.photos) {
          const r = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "campusnest/pgs" }
          );
          photos.push(r.public_id);
        }
      }

      if (req.files?.foodPhoto?.[0]) {
        const file = req.files.foodPhoto[0];
        const r = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "campusnest/food" }
        );
        foodTimingsPhoto = r.public_id;
      }

      const rentOptions = JSON.parse(req.body.rentOptions || "[]");

      const pg = await Pg.create({
        name: req.body.name,
        area: req.body.area,
        address: req.body.address,
        city: req.body.city,
        facilities: {
          wifi: req.body.wifi === "true",
          hotWater: req.body.hotWater === "true",
          timings: req.body.timings,
        },
        rentOptions,
        owner: req.user.id,
        photos,
        foodTimingsPhoto,
      });

      res.status(201).json(pg);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to add PG" });
    }
  }
);

/* ---------- RATE PG (STUDENT ONLY) ---------- */
router.post("/:id/rate", authRequired(["seeker"]), async (req, res) => {
  const { rating } = req.body;
  const userId = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Invalid rating" });
  }

  const pg = await Pg.findById(req.params.id);
  if (!pg) return res.status(404).json({ error: "PG not found" });

  // 🔍 check if user already rated
  const existing = pg.ratings.find(
    (r) => r.user.toString() === userId
  );

  if (existing) {
    // 🔄 UPDATE rating
    existing.value = rating;
  } else {
    // ⭐ NEW rating
    pg.ratings.push({ user: userId, value: rating });
    pg.ratingCount += 1;
  }

  // 🔢 RECALCULATE AVERAGE
  const total = pg.ratings.reduce((sum, r) => sum + r.value, 0);
  pg.rating = Number((total / pg.ratingCount).toFixed(1));

  await pg.save();

  res.json({
    rating: pg.rating,
    ratingCount: pg.ratingCount,
    userRating: rating,
    updated: !!existing,
  });
});

// DELETE PG (OWNER ONLY) — MUST BE BELOW /mine & /top
router.delete("/:id", authRequired(["owner"]), async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ error: "PG not found" });
    }

    // 🔒 Ensure owner owns this PG
    if (pg.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await pg.deleteOne();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete PG" });
  }
});




export default router;
