import { useEffect, useState } from "react";
import CommentIconBtn from "./CommentIconBtn";
import api from "../../api/axios";
import { useMemo } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";

function Comment({
  avatar,
  username,
  date,
  body,
  likes = 0,
  dislikes = 0,
  loves = 0,
  celebrates = 0,
  commentId,
  postId,
  auth_reacted,
}) {
  // State for current user action
  const [action, setAction] = useState(null);
  // State for counts
  const [counts, setCounts] = useState({
    like: likes,
    dislike: dislikes,
    love: loves,
    celebrate: celebrates,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const interactionsMap = {
    "👍": "like",
    "👎": "dislike",
    "❤️": "love",
    "🎉": "celebrate",
  };

  const reverseInteractionsMap = useMemo(
    () => ({
      like: "👍",
      dislike: "👎",
      love: "❤️",
      celebrate: "🎉",
    }),
    []
  );

  useEffect(() => {
    setCounts({
      like: likes,
      dislike: dislikes,
      love: loves,
      celebrate: celebrates,
    });

    setAction(auth_reacted ? reverseInteractionsMap[auth_reacted] : null);
  }, [
    likes,
    dislikes,
    loves,
    celebrates,
    auth_reacted,
    reverseInteractionsMap,
  ]);

  async function handleAction(newActionType) {
    const prevAction = action;
    const reactionType = interactionsMap[newActionType];

    // If clicking the same action again → this will delete reaction
    const nextAction = prevAction === newActionType ? null : newActionType;
    setAction(nextAction);

    try {
      await api.patch(`posts/${postId}/comments/${commentId}/reactions`, {
        type: reactionType,
      });

      // Update counts optimistically
      setCounts((prev) => {
        const updated = { ...prev };

        // Remove previous reaction
        if (prevAction) {
          const prevType = interactionsMap[prevAction];
          updated[prevType] = Math.max(0, updated[prevType] - 1);
        }

        // Add new reaction (if not removing)
        if (nextAction) {
          updated[reactionType] = parseInt(updated[reactionType] || 0) + 1;
        }

        return updated;
      });
    } catch (error) {
      // Rollback UI on error
      setAction(prevAction);
      console.error("Error handling reaction:", error);
    }
  }

  return (
    <div className='flex gap-x-2 mb-4 justify-center'>
      {isMobile ? null : (
        <div className='w-10 h-10 rounded-full overflow-hidden flex-shrink-0'>
          <img
            src={avatar}
            alt='avatar'
            className='w-full h-full object-cover'
          />
        </div>
      )}

      <div className='min-h-[150px] w-[500px] rounded outline outline-1 outline-[#3d424e]'>
        {/* Header */}
        <div className='h-10 bg-[#151923] flex gap-x-2 items-center text-[13px] pl-[10px] border-b border-[#3d424e] border-1'>
          <div>
            <a href='google.com'>{username}</a>
          </div>
          <div className='text-[#9198a1]'> {date}</div>
        </div>

        <div className='flex flex-col justify-between p-[10px] gap-y-7 flex-1'>
          {/* Body */}
          <div className='text-[14px] whitespace-pre-wrap'>{body}</div>

          {/* Interaction */}
          <div>
            <CommentIconBtn handleAction={handleAction} />
            {/* Reactions */}
            <div className='flex gap-x-2'>
              {Object.entries(counts).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center justify-evenly text-xs w-[50px] h-[25px] border border-[#3d424e] rounded-full ${
                    action === reverseInteractionsMap[key]
                      ? "bg-[#3d424e] text-white"
                      : "bg-[#151923] text-[#9198a1]"
                  }`}
                >
                  <div>{reverseInteractionsMap[key]}</div>
                  <div>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
