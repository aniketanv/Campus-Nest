import { Router } from "express";
import Pg from "../models/Pg.js";
import { authRequired } from "../middlewares/auth.js";
const router = Router();

router.get("/featured", async (req, res) => {
  const items = await Pg.find().sort({ rating: -1 }).limit(12).populate("owner", "name phone");
  res.json(items);
});

router.get("/search", async (req, res) => {
  const { area } = req.query;
  if (!area) return res.status(400).json({ error: "area is required" });
  const q = new RegExp(area, "i");
  const items = await Pg.find({ area: q }).sort({ rating: -1 }).limit(50).populate("owner", "name phone");
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const pg = await Pg.findById(req.params.id).populate("owner", "name phone");
  if (!pg) return res.status(404).json({ error: "Not found" });
  res.json(pg);
});

router.post("/", authRequired(["owner"]), async (req, res) => {
  const payload = req.body;
  payload.owner = req.user.id;
  const created = await Pg.create(payload);
  res.status(201).json(created);
});

export default router;
