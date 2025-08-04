import React from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { motion } from "framer-motion";

function PostLikeBtn({ handlePostLike, isLiked, likesCount }) {
  return (
    <div className='flex gap-x-1 mt-5 items-center'>
      <motion.div
        className='cursor-pointer flex'
        onClick={handlePostLike}
        whileTap={{ scale: 1.2 }}
        animate={{ color: isLiked ? "white" : "#ccc" }}
        transition={{ duration: 0.2 }}
      >
        {isLiked ? (
          <FaThumbsUp fontSize={"25px"} />
        ) : (
          <FaRegThumbsUp fontSize={"25px"} />
        )}
      </motion.div>

      <div>{likesCount}</div>
    </div>
  );
}

export default PostLikeBtn;
