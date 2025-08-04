import Comment from "./Comment";
import WriteComment from "./WriteComment";

function CommentsLayout({ comments, addComment }) {
  if (!comments) {
    return <div className='text-center text-gray-500'>Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return (
      <div>
        <h2 className='text-xl font-semibold mb-5 mt-[80px]'>Comments</h2>
        {/* Write Comment Section */}
        <WriteComment onAddComment={addComment} />
        <div className='text-center text-gray-500'>
          No comments yet. Be the first to comment!
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-5 mt-[80px]'>Comments</h2>

      {/* Write Comment Section */}
      <WriteComment onAddComment={addComment} />

      {comments.map((c) => (
        <Comment
          key={`comment-${c.id}`}
          commentId={c.id}
          postId={c.post_id}
          date={c.created_at}
          body={c.body}
          likes={c.likes ?? 0}
          dislikes={c.dislikes ?? 0}
          celebrates={c.celebrates ?? 0}
          loves={c.loves ?? 0}
          avatar={c.user?.avatar || "/default-avatar.png"}
          username={c.user?.username || "Anonymous"}
          auth_reacted={c.auth_reacted}
        />
      ))}
    </div>
  );
}

export default CommentsLayout;
