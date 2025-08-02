import { useState } from "react";
import CommentIconBtn from "./CommentIconBtn";

function Comment({ avatar, username, date, body, interactions }) {
  // State to manage the action taken on the comment
  // This will be used to track if the user has liked, disliked, etc.
  const [action, setAction] = useState(null);

  function handleAction(actionType) {
    setAction(actionType);
    console.log(`Action taken: ${actionType}`);
  }

  if (!interactions || interactions.length === 0) {
    interactions = [{ like: 0 }, { dislike: 0 }, { love: 0 }, { celebrate: 0 }];
  }

  const InteractionsCount = interactions.map((interaction) => {
    if (Object.keys(interaction)[0] === "like") {
      return { "👍": interaction["like"] };
    } else if (Object.keys(interaction)[0] === "dislike") {
      return { "👎": interaction["dislike"] };
    } else if (Object.keys(interaction)[0] === "love") {
      return { "❤️": interaction["love"] };
    } else if (Object.keys(interaction)[0] === "celebrate") {
      return { "🎉": interaction["celebrate"] };
    }
    return interaction;
  });

  console.log("Interactions Count:", InteractionsCount);

  return (
    <div className='flex gap-x-2 mb-4'>
      <div className='w-10 h-10 rounded-full overflow-hidden'>
        <img src={avatar} alt='avatar' className='w-full h-full object-cover' />
      </div>

      <div className='min-h-[150px] w-[500px] rounded outline outline-1 outline-[#3d424e]'>
        {/* Header */}
        <div className='h-10 bg-[#151923] flex gap-x-2 items-center text-[13px] pl-[10px] border-b border-[#3d424e] border-1'>
          <div>
            <a href='google.com'>{username}</a>
          </div>
          <div className='text-[#9198a1]'> {date}</div>
        </div>

        <div className='flex flex-col justify-between p-[10px] gap-y-7'>
          {/* Body */}
          <div className='text-[14px] whitespace-pre-wrap'>{body}</div>

          {/* Interaction */}
          <div className=''>
            <CommentIconBtn handleAction={handleAction} />
            {/* Reactions */}
            <div className='flex gap-x-2'>
              {InteractionsCount.map((interaction, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-evenly text-xs w-[50px] h-[25px] border border-[#3d424e] rounded-full ${
                    action === Object.keys(interaction)[0]
                      ? "bg-[#3d424e] text-white"
                      : "bg-[#151923] text-[#9198a1]"
                  }`}
                >
                  <div>{Object.keys(interaction)[0]}</div>
                  <div>{Object.values(interaction)[0]}</div>
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
