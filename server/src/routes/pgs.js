import express from "express";
import mongoose from "mongoose";
import Pg from "../models/Pg.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

router.get("/featured", async (req, res, next) => {
  try {
    const items = await Pg.find({}).sort({ rating: -1, createdAt: -1 }).limit(8);
    res.json(items);
  } catch (e) { next(e); }
});


// --- put this BEFORE any '/:id' route ---
router.get("/mine", authRequired(["owner"]), async (req, res, next) => {
  try {
    const items = await Pg.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .populate("owner", "name phone");
    res.json(items);
  } catch (e) { next(e); }
});

// GET /api/pgs?area=BTM&limit=8&sort=rating_desc
router.get("/", async (req, res, next) => {
  try {
    const { area = "", limit = 20, sort = "created_desc" } = req.query;

    const q = {};
    if (area) q.area = new RegExp(area, "i"); // case-insensitive area match

    let sortObj = { createdAt: -1 };
    if (sort === "rating_desc") sortObj = { rating: -1, createdAt: -1 };
    if (sort === "name_asc") sortObj = { name: 1 };

    const items = await Pg.find(q).sort(sortObj).limit(Number(limit));
    res.json(items);
  } catch (e) {
    next(e);
  }
});


// id route with validation
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid PG id" });
    }
    const pg = await Pg.findById(id);
    if (!pg) return res.status(404).json({ error: "PG not found" });
    res.json(pg);
  } catch (e) { next(e); }
});

// create (unchanged)
router.post("/", authRequired(["owner"]), async (req, res, next) => {
  try {
    const data = { ...req.body, owner: req.user.id };
    const created = await Pg.create(data);
    res.status(201).json(created);
  } catch (e) { next(e); }
});

export default router;
