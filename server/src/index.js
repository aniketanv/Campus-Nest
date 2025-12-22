// server/src/index.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import uploadRouter from "./routes/upload.js";


import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import pgRoutes from "./routes/pgs.js";
import bookingRoutes from "./routes/booking.js";
import contactRoutes from "./routes/contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Force-load server/.env explicitly (fixes undefined MONGODB_URI)
dotenv.config({ path: path.join(__dirname, "../.env") });

// --- App setup ---
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// --- CORS ---
// --- CORS (ALLOW ALL - DEV SAFE) ---
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
// handle preflight
app.options("*", cors());


// --- Parsers & Logs ---
app.use(express.json({ limit: "1mb" }));
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// --- DB connect ---
await connectDB(); // uses process.env.MONGODB_URI

// --- Static: /receipts ---
const receiptsDir = path.join(__dirname, "../receipts");
if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });
app.use("/receipts", express.static(receiptsDir));

// --- Static: /uploads (serves uploaded images) ---
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// --- Health & Root ---
app.get("/health", (_req, res) =>
  res.json({ ok: true, env: NODE_ENV, time: new Date().toISOString() })
);
app.get("/", (_req, res) => res.json({ ok: true, msg: "CampusNest API up" }));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRouter); // ⬅️ mount uploads here

// --- 404 & Error handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (NODE_ENV !== "test") {
    console.error("⚠️  Error:", err.message || err);
  }
  res.status(status).json({
    error: err.message || "Server error",
    ...(NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

// --- Start ---
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// --- Graceful shutdown ---
const shutdown = (sig) => async () => {
  console.log(`\n${sig} received. Shutting down...`);
  server.close(async () => {
    try {
      const { default: mongoose } = await import("mongoose");
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    } finally {
      process.exit(0);
    }
  });
};
process.on("SIGINT", shutdown("SIGINT"));
process.on("SIGTERM", shutdown("SIGTERM"));
