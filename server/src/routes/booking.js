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
    
    // ❌ Prevent multiple active bookings for same user
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      status: { $in: ["reserved", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You already have an active PG booking. Please remove it before booking another PG.",
      });
    }

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

// ✅ GET MY BOOKINGS (Student)
router.get("/my", authRequired(["seeker"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
  .populate("pg", "name area photos")
  .sort({ createdAt: -1 });


    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ❌ DELETE / CANCEL A BOOKING (Student)
router.delete("/:id", authRequired(["seeker"]), async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Optional: restrict deletion by status
    if (booking.status === "confirmed") {
      return res.status(400).json({
        error: "Confirmed bookings cannot be removed",
      });
    }

    await booking.deleteOne();

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to remove booking" });
  }
});


export default router;
