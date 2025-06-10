import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetch_u } from "../utility/fetch";
import { TextareaAutosize } from "@mui/material";
import { RiHeartAdd2Line, RiHeartAdd2Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
function PostView() {
  const { id: post_id } = useParams();
  const [post, setPost] = useState(null);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(null);

  useEffect(() => {
    async function getPost() {
      try {
        const res = await fetch_u(`http://localhost:8000/api/posts/${post_id}`);
        setPost(res.data.post);
        setLikesCount(res.data.post.likes_count);
        setLike(res.data.post.liked);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }
    getPost();
  }, [post_id]);

  async function handlePostLike() {
    const postId = post.id;
    setLike((prev) => !prev);

    try {
      let res = await fetch_u(
        `http://localhost:8000/api/posts/${postId}/like`,
        "POST"
      );
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
      <div className="container-c">
        <Skeleton
          variant="rectangular"
          style={{ height: "50px", marginBottom: "50px" }}
        />
        <Skeleton variant="rectangular" style={{ height: "300px" }} />
      </div>
    );
  }

  return (
    <div className="container-c">
      <div>
        <TextareaAutosize
          value={post?.title}
          disabled
          placeholder="Title"
          className="h-[100px] text-4xl mt-6 mb-[30px] pb-[20px]"
          style={{ borderBottom: "solid white 1px" }}
        />
      </div>
      <div className="flex justify-center mb-8">
        <img
          className="h-[500px] w-[100%] rounded object-cover"
          src={`http://localhost:8000/storage/${post?.image}`}
          alt="img"
        />
      </div>
      <div>
        <TextareaAutosize
          disabled
          value={post?.body}
          placeholder="Tell Your Story"
          className="w-[600px] text-2xl"
        />
      </div>

      <div className="flex gap-x-1 mt-5 items-end">
        <motion.div
          className="cursor-pointer flex"
          onClick={handlePostLike}
          whileTap={{ scale: 1.2 }}
          animate={{ color: like ? "#ff2e63" : "#ccc" }}
          transition={{ duration: 0.2 }}
        >
          {like ? (
            <RiHeartAdd2Fill fontSize={"28px"} />
          ) : (
            <RiHeartAdd2Line fontSize={"28px"} />
          )}
        </motion.div>

        <div>{likesCount}</div>
      </div>
    </div>
  );
}

export default PostView;
