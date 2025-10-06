import React, { useState } from "react";
import API from "../api/api";

export default function ResourceCard({ resource, fetchResources }) {
  const [comments, setComments] = useState(resource.comments || []);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(resource.avgRating ? Math.round(resource.avgRating) : 0);
  const [discussion, setDiscussion] = useState(resource.discussions || []);
  const [newDiscussion, setNewDiscussion] = useState("");

  // -------------------- Comments --------------------
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post("/resources/comment", {
        resourceId: resource._id,
        text: newComment.trim(),
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed:", err);
      alert("Failed to add comment.");
    }
  };

  // -------------------- Ratings --------------------
  const handleRate = async (score) => {
    try {
      const res = await API.post("/resources/rate", {
        resourceId: resource._id,
        rating: score,
      });
      setRating(Math.round(res.data.avgRating));
    } catch (err) {
      console.error("Rating failed:", err);
      alert("Failed to rate resource.");
    }
  };

  // -------------------- Download --------------------
  const handleDownload = async () => {
    try {
      const res = await API.get(`/resources/download/${resource._id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resource.fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (fetchResources) fetchResources();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed.");
    }
  };

  // -------------------- Discussions --------------------
  const handleAddDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) return;

    try {
      const res = await API.post("/resources/discussion", {
        resourceId: resource._id,
        text: newDiscussion.trim(),
      });
      setDiscussion([...discussion, res.data]);
      setNewDiscussion("");
    } catch (err) {
      console.error("Discussion failed:", err);
      alert("Failed to post discussion.");
    }
  };

  return (
    <div className="card mb-4 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{resource.title}</h5>
        <p className="card-text">{resource.description}</p>
        <p className="text-muted mb-3">
          Category: {resource.category} | Tags: {resource.tags?.join(", ")}
        </p>

        {/* Ratings */}
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: star <= rating ? "#ffc107" : "#e4e5e9",
                fontSize: "1.2rem",
              }}
              onClick={() => handleRate(star)}
            >
              ★
            </span>
          ))}
        </div>

        <button className="btn btn-primary mb-3" onClick={handleDownload}>
          Download
        </button>

        {/* Comments Section */}
        <div className="mt-auto mb-3">
          <h6>Comments</h6>
          {comments.length > 0 ? (
            comments.map((c) => (
              <div key={c._id} className="border-top py-1">
                <strong>{c.user?.username || "Unknown"}</strong>: {c.text}
              </div>
            ))
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}

          <form className="mt-2" onSubmit={handleAddComment}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-outline-primary w-100">
              Submit Comment
            </button>
          </form>
        </div>

        {/* Discussion Section */}
        <div className="mt-auto">
          <h6>Discussion</h6>
          {discussion.length > 0 ? (
            discussion.map((d) => (
              <div key={d._id} className="border-top py-1">
                <strong>{d.user?.username || "Unknown"}</strong>: {d.text}
              </div>
            ))
          ) : (
            <p className="text-muted">No discussions yet.</p>
          )}

          <form className="mt-2" onSubmit={handleAddDiscussion}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Start a discussion..."
              value={newDiscussion}
              onChange={(e) => setNewDiscussion(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-outline-success w-100">
              Submit Discussion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
