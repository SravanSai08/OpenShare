import express from "express";
import { 
  uploadResource, 
  getResources, 
  getResourceById,
  getTrendingResources,
  addComment, 
  rateResource, 
  downloadResource 
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload
router.post("/upload", protect, upload.single("file"), uploadResource);

// Get all resources
router.get("/", getResources);

// Get single resource (increment views)
router.get("/:id", getResourceById);

// Trending
router.get("/trending/top", getTrendingResources);

// Comments
router.post("/comment", protect, addComment);

// Ratings
router.post("/rate", protect, rateResource);

// Download
router.get("/download/:id", downloadResource);

export default router;
