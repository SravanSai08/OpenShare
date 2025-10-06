import Resource from "../models/resourceModel.js";
import Comment from "../models/commentModel.js";

// -------------------- GET ALL RESOURCES --------------------
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploader", "username")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username" },
      });
    
    const resourcesWithAvg = resources.map(r => {
      const avgRating =
        r.ratings.length > 0
          ? r.ratings.reduce((sum, r) => sum + r.score, 0) / r.ratings.length
          : 0;
      return { ...r._doc, avgRating };
    });

    res.json(resourcesWithAvg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- UPLOAD RESOURCE --------------------
export const uploadResource = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const fileUrl = req.file ? req.file.path.replace("\\", "/") : "";

    const resource = await Resource.create({
      title,
      description,
      category,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      fileUrl,
      uploader: req.user._id,
    });

    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- GET RESOURCE BY ID & INCREMENT VIEWS --------------------
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate("uploader", "username")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username" },
      });

    if (!resource) return res.status(404).json({ message: "Resource not found" });

    resource.views += 1;
    await resource.save();

    const avgRating =
      resource.ratings.length > 0
        ? resource.ratings.reduce((sum, r) => sum + r.score, 0) / resource.ratings.length
        : 0;

    res.json({ ...resource._doc, avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- GET TRENDING RESOURCES --------------------
export const getTrendingResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ views: -1, downloads: -1 })
      .limit(10)
      .populate("uploader", "username");

    const resourcesWithAvg = resources.map(r => {
      const avgRating =
        r.ratings.length > 0
          ? r.ratings.reduce((sum, r) => sum + r.score, 0) / r.ratings.length
          : 0;
      return { ...r._doc, avgRating };
    });

    res.json(resourcesWithAvg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- ADD COMMENT --------------------
export const addComment = async (req, res) => {
  try {
    const { resourceId, text } = req.body;

    const existingComment = await Comment.findOne({
      resource: resourceId,
      user: req.user._id,
      text: text.trim(),
    });

    if (existingComment) {
      return res.status(400).json({ message: "You already posted this comment." });
    }

    const comment = await Comment.create({
      resource: resourceId,
      user: req.user._id,
      text,
    });

    const resource = await Resource.findById(resourceId);
    resource.comments.push(comment._id);
    await resource.save();

    await comment.populate("user", "username");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- RATE RESOURCE --------------------
export const rateResource = async (req, res) => {
  try {
    const { resourceId, rating } = req.body;
    const resource = await Resource.findById(resourceId);

    const existingRating = resource.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existingRating) {
      existingRating.score = rating;
    } else {
      resource.ratings.push({ user: req.user._id, score: rating });
    }

    await resource.save();

    const avgRating =
      resource.ratings.reduce((sum, r) => sum + r.score, 0) / resource.ratings.length;

    res.json({ avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- DOWNLOAD RESOURCE --------------------
export const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    resource.downloads += 1;
    await resource.save();

    res.download(resource.fileUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
