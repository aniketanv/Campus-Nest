import { Router } from "express";
import Booking from "../models/Booking.js";
import Pg from "../models/Pg.js";
import User from "../models/User.js";
import path from "path";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { generateReceipt } from "../utils/receipt.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", authRequired(["seeker"]), async (req, res) => {
  try {
    const { pgId, sharing, months, amount } = req.body;
    const pg = await Pg.findById(pgId).populate("owner", "name phone");
    if (!pg) return res.status(404).json({ error: "PG not found" });

    const booking = await Booking.create({
      pg: pg._id, user: req.user.id, sharing, months: months || 1, amount, status: "reserved"
    });

    const user = await User.findById(req.user.id);
    const receiptsDir = path.join(__dirname, "../../receipts");
    await mkdir(receiptsDir, { recursive: true });
    const file = path.join(receiptsDir, `${booking._id}.pdf`);
    await generateReceipt({
      bookingId: booking._id.toString(),
      user: { name: user.name, email: user.email },
      pg: { name: pg.name, area: pg.area, sharing },
      amount,
      filepath: file
    });

    res.status(201).json({ bookingId: booking._id, receiptUrl: `/receipts/${booking._id}.pdf` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
