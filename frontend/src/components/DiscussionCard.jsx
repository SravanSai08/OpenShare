import React, { useState } from "react";
import API from "../api/api";

export default function DiscussionCard({ discussion, fetchDiscussions }) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(discussion.replies || []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply) return;

    try {
      const res = await API.post(`/discussions/${discussion._id}/reply`, { text: reply });
      setReplies(res.data.replies);
      setReply("");
    } catch (err) {
      console.error("Reply failed:", err);
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{discussion.title}</h5>
        <p className="card-text">{discussion.description}</p>
        <p className="text-muted">By: {discussion.user.username}</p>

        {/* Replies */}
        <div className="mt-3">
          <h6>Replies:</h6>
          {replies.length > 0 ? (
            replies.map((r, idx) => (
              <div key={idx} className="border-top py-1">
                <strong>{r.user.username}</strong>: {r.text}
              </div>
            ))
          ) : (
            <p className="text-muted">No replies yet.</p>
          )}

          {/* Add reply */}
          <form className="mt-2" onSubmit={handleReply}>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Add a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button type="submit" className="btn btn-sm btn-outline-primary w-100">
              Reply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
