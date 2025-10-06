import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true }, 
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    tags: [{ type: String }],
    ratings: [
      { user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, score: Number }
    ],
    avgRating: { type: Number, default: 0 }, // added
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
