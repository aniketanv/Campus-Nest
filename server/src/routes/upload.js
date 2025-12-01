import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

// Store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "campusnest/pgs",
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// Multiple image upload (for PG)
router.post(
  "/pg-photos",
  authRequired(["owner"]),
  upload.array("photos", 5),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }

      const urls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      res.json({ urls });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default router;
