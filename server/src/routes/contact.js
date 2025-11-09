import { Router } from "express";
import ContactRequest from "../models/ContactRequest.js";
const router = Router();

router.post("/", async (req, res) => {
  const { name, phone, email, pgName, message } = req.body;
  const data = await ContactRequest.create({ name, phone, email, pgName, message });
  res.status(201).json({ ok: true, id: data._id });
});

export default router;
