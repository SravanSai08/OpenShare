import Discussion from "../models/discussionModel.js";
import Resource from "../models/resourceModel.js";

// -------------------- CREATE DISCUSSION --------------------
export const createDiscussion = async (req, res) => {
  try {
    const { resourceId, text } = req.body;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const discussion = await Discussion.create({
      resource: resourceId,
      user: req.user._id,
      text,
      replies: [],
    });

    // Push discussion ID to resource
    const resource = await Resource.findById(resourceId);
    if (resource) {
      resource.discussions.push(discussion._id);
      await resource.save();
    }

    await discussion.populate("user", "username"); // populate user for frontend

    res.status(201).json(discussion);
  } catch (err) {
    console.error("Create discussion failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- GET DISCUSSIONS FOR RESOURCE --------------------
export const getDiscussions = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const discussions = await Discussion.find({ resource: resourceId })
      .populate("user", "username")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username" },
      });

    res.json(discussions);
  } catch (err) {
    console.error("Get discussions failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------- ADD REPLY --------------------
export const addReply = async (req, res) => {
  try {
    const { id } = req.params; // discussion ID
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    discussion.replies.push({ user: req.user._id, text });
    await discussion.save();

    await discussion.populate({
      path: "replies.user",
      select: "username",
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error("Add reply failed:", err);
    res.status(500).json({ message: err.message });
  }
};
