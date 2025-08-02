import React, { useState } from "react";
import avatar from "../../images/signin.jpg";
import { Textarea, Button } from "@mui/joy";

function WriteComment({ onAddComment }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  async function handleSubmit() {
    setIsSubmitting(true);
    await onAddComment(text);
    setText(""); // Clear the textarea after submitting
    setIsSubmitting(false);
  }

  return (
    <div className='flex gap-x-2'>
      {/* Avatar */}
      <div className='w-10 h-10 rounded-full overflow-hidden'>
        <img src={user?.avatar} alt='' className='w-[100%] h-[100%]' />
      </div>

      {/* Textarea and Button */}
      <div>
        <Textarea
          sx={{
            width: "500px",
            minHeight: "200px",
            backgroundColor: "unset",
            padding: "15px",
          }}
          placeholder='Write a Comment...'
          variant='outlined'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className='flex justify-end mt-2'>
          <Button
            variant='solid'
            color='success'
            sx={{
              px: 2,
              fontWeight: 400,
              textTransform: "none",
              borderRadius: "6px",
            }}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WriteComment;
