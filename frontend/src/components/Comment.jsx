export default function Comment({ comment }) {
  return (
    <div className="border-top py-2">
      <strong>{comment.user.username}</strong>: {comment.text}
    </div>
  );
}