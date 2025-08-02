import avatar from "../../images/signin.jpg";
import Comment from "./Comment";
import WriteComment from "./WriteComment";

function CommentsLayout({ comments, addComment }) {
  if (!comments) {
    return <div className='text-center text-gray-500'>Loading comments...</div>;
  }

  if (!comments || comments.length === 0) {
    return <div className='text-center text-gray-500'>No comments yet.</div>;
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-5 mt-[80px]'>Comments</h2>

      {/* Write Comment Section */}
      <div className='mb-11'>
        <WriteComment onAddComment={addComment} />
      </div>

      {comments.map((c) => (
        <Comment
          key={c.id}
          date={c.created_at}
          body={c.body}
          interactions={c?.interactions}
          avatar={c.user.avatar}
          username={c.user.username}
        />
      ))}
    </div>
  );
}

export default CommentsLayout;
