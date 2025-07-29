import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { TextareaAutosize } from "@mui/material";
import AlertPopup from "../components/popup/AlertPopup";
import AlertDialog from "../components/popup/AlertDialog";
import { RiHeartAdd2Fill, RiHeartAdd2Line } from "react-icons/ri";
import Skeleton from "@mui/material/Skeleton";
import { motion } from "framer-motion";
import { usePosts } from "../context/PostsContext";
import api from "../api/axios";

function PostEdit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [like, setLike] = useState(false);
  const [likesCount, setLikesCount] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { updatePost, allPosts } = usePosts();

  const location = useLocation();
  const prev_page = location.state.from || "/";
  const navigate = useNavigate();

  function open_confirm() {
    setOpen(true);
  }

  function close_confirm() {
    setOpen(false);
  }

  const postId = useParams().id;

  async function handlePostLike() {
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

  useEffect(() => {
    async function getPost() {
      let res = await api.get(`user/posts/${postId}`);
      setTitle(res.data.title);
      setBody(res.data.body);
      setImage(res.data.image);
      setLikesCount(res.data.likes_count);
      setIsLoading(false);

      if (res.data.liked) {
        setLike(true);
      } else {
        setLike(false);
      }
    }
    getPost();
  }, [postId]);

  async function handlePostPublish() {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("_method", "PATCH");

    if (image || preview) {
      formData.append("image", image);
    }

    let response = await api.post(`posts/${postId}`, formData);

    if (response.error) {
      setRes({ error: true, message: response.message });
    } else {
      const updatedPost = response.data.post;

      updatePost(updatedPost);

      setRes({ error: false, message: response.data.message });
    }
    setIs_open(true);
  }

  async function handlePostDelete() {
    //TODO: the post don't removed from the posts state after it deleted
    close_confirm();
    let response = await api.delete(`posts/${postId}`);

    if (response.error) {
      setRes({ error: true, message: response.message });
    } else {
      setRes({ error: false, message: response.data.message });
      setTimeout(() => {
        navigate(prev_page, { replace: true });
      }, 1200);
    }
    setIs_open(true);
  }

  if (isLoading) {
    return (
      <div className='container-c'>
        <div className='flex items-center mb-5 flex-row-reverse gap-x-2'>
          <Skeleton
            variant='rectangular'
            width={80}
            height={40}
            className='rounded'
          />
          <Skeleton
            variant='rectangular'
            className='rounded'
            width={80}
            height={40}
          />
        </div>
        <Skeleton variant='rectangular' height={50} className='mb-[50px]' />
        <Skeleton variant='rectangular' height={300} />
      </div>
    );
  }

  return (
    <div>
      <AlertDialog
        open={open}
        onClose={close_confirm}
        title={"Confirm Deletion"}
        content={
          "Are you sure you want to delete this post? Once deleted, it cannot be recovered."
        }
        onConfirm={handlePostDelete}
      />
      <AlertPopup
        message={"Post created successfully"}
        is_open={is_open}
        setIs_open={setIs_open}
        status={res}
      />
      <div className='container-c'>
        <label className='flex items-center justify-center w-60 h-14 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg hover:border-blue-500 transition duration-300'>
          <span className='text-white'>Upload Image</span>
          <input
            type='file'
            className='hidden'
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>
        <div className='flex items-center mb-5 flex-row-reverse gap-x-2'>
          <button onClick={open_confirm} className={`bg-red-500 flex `}>
            Delete
          </button>
          <button onClick={handlePostPublish} className={`bg-green flex `}>
            Update
          </button>
        </div>
        <div>
          <TextareaAutosize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
            className={`w-[600px] h-[100px] text-5xl mb-[30px] pb-[20px] `}
          />
        </div>
        <div className='flex justify-center mb-8'>
          <img
            className='h-[500px] w-[100%] rounded object-cover'
            src={preview ? preview : `http://localhost:8000/storage/${image}`}
            alt='img'
          />
        </div>
        <div>
          <TextareaAutosize
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='Tell Your Story'
            className='w-[600px]  text-2xl'
          />
        </div>

        <div className='flex gap-x-1 mt-5 items-end'>
          <motion.div
            className='cursor-pointer flex'
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
    </div>
  );
}

export default PostEdit;
