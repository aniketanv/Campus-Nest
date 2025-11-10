import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authRequired } from "../middlewares/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Ensure uploads directory exists
const uploadRoot = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const orig = file.originalname || "file";
    const ext = path.extname(orig);
    const base = path.basename(orig, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

// Only allow images, 5MB max
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image uploads are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/upload/single  (field: "file")
router.post("/single", authRequired(), upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  return res.json({ url: `/uploads/${req.file.filename}` });
});

// POST /api/upload/multi  (field: "files")
router.post("/multi", authRequired(), upload.array("files", 10), (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "No files uploaded" });
  const urls = files.map((f) => `/uploads/${f.filename}`);
  return res.json({ urls });
});

export default router;
