import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TextareaAutosize } from "@mui/material";
import { RiHeartAdd2Line, RiHeartAdd2Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import api from "../api/axios";
import CommentsLayout from "../components/comment/CommentsLayout";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";

function PostView() {
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function getPost() {
      try {
        const res = await api.get(`posts/${postId}`);
        setPost(res.data.post);
        setLike(res.data.post.liked);
        setComments(res.data.comments);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    getPost();
  }, [postId]);

  async function addComment(text) {
    if (!text.trim()) return;

    try {
      const res = await api.post(`posts/${postId}/comments`, { body: text });
      const newComment = {
        ...res.data.comment,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      };
      console.log("New comment added:", newComment);

      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  async function handlePostLike() {
    const postId = post.id;
    setLike((prev) => !prev);

    try {
      let res = await api.post(`posts/${postId}/like`);
      if (!res.data.liked) {
        setLike(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        setLike(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  if (!post) {
    return (
      <div className='container-c'>
        <Skeleton
          variant='rectangular'
          style={{ height: "50px", marginBottom: "50px" }}
        />
        <Skeleton variant='rectangular' style={{ height: "300px" }} />
      </div>
    );
  }

  return (
    <div className='container-c'>
      <div>
        <TextareaAutosize
          value={post?.title}
          disabled
          placeholder='Title'
          className='h-[100px] text-4xl mt-6 mb-[30px] pb-[20px]'
          style={{ borderBottom: "solid white 1px" }}
        />
      </div>
      <div className='flex justify-center mb-8'>
        <img
          className='h-[500px] w-[100%] rounded object-cover'
          src={post?.image_url}
          alt='img'
        />
      </div>
      <div>
        <TextareaAutosize
          disabled
          value={post?.body}
          placeholder='Tell Your Story'
          className='w-[600px] text-2xl'
        />
      </div>

      <div className='flex gap-x-1 mt-5 items-end'>
        <motion.div
          className='cursor-pointer flex'
          onClick={handlePostLike}
          whileTap={{ scale: 1.2 }}
          animate={{ color: like ? "white" : "#ccc" }}
          transition={{ duration: 0.2 }}
        >
          {like ? (
            <FaThumbsUp fontSize={"28px"} />
          ) : (
            <FaRegThumbsUp fontSize={"28px"} />
          )}
        </motion.div>

        <div>{likesCount}</div>
      </div>
      <CommentsLayout comments={comments} addComment={addComment} />
    </div>
  );
}

export default PostView;
