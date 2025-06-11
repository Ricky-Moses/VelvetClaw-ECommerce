import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const router = express.Router();
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  } 
});

// Upload route for multiple images
router.post("/", upload.array("image", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Function to handle stream upload to Cloudinary
    const streamUpload = (fileBuffer, originalName) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" }, // Optional: Store in 'products' folder
          (error, result) => {
            if (result) {
              resolve({
                url: result.secure_url,
                altText: originalName,
              });
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file) =>
      streamUpload(file.buffer, file.originalname)
    );
    const images = await Promise.all(uploadPromises);

    // Respond with the uploaded images
    res.json({ images });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error during image upload" });
  }
});

// Error handling middleware for Multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  next(err);
});

export default router;