import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createDiscussion, getDiscussions, addReply } from "../controllers/discussionController.js";

const router = express.Router();

router.post("/", protect, createDiscussion);          // Create discussion
router.get("/:resourceId", getDiscussions);          // Get discussions for a resource
router.post("/:id/reply", protect, addReply);        // Add reply to a discussion

export default router;
