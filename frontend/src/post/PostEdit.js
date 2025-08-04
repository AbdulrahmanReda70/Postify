import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { TextareaAutosize } from "@mui/material";
import AlertPopup from "../components/popup/AlertPopup";
import AlertDialog from "../components/popup/AlertDialog";
import Skeleton from "@mui/material/Skeleton";
import { usePosts } from "../context/PostsContext";
import api from "../api/axios";
import PostLikeBtn from "../components/PostLikeBtn";
import CommentsLayout from "../components/comment/CommentsLayout";

function PostEdit() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comments, setComments] = useState([]);
  const { updatePost, allPosts } = usePosts();

  const location = useLocation();
  const prev_page = location?.state?.from || "/";
  const navigate = useNavigate();

  function open_confirm() {
    setOpen(true);
  }

  function close_confirm() {
    setOpen(false);
  }

  const postId = useParams().id;

  async function handlePostLike() {
    setIsLiked((prev) => !prev);

    try {
      let res = await api.post(`posts/${postId}/like`);
      if (!res.data.liked) {
        setIsLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  useEffect(() => {
    async function getPost() {
      let res = await api.get(`posts/${postId}`);
      console.log("Post data:", res.data);

      setTitle(res.data.post.title);
      setBody(res.data.post.body);
      setImage(res.data.post.image_url);
      setComments(res.data.comments);

      setLikesCount(res.data.post.likes_count);
      setIsLoading(false);

      if (res.data.post.liked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
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
            className={`w-full h-[100px] text-5xl mb-[30px] pb-[20px] `}
          />
        </div>
        {image && (
          <div className='flex justify-center mb-8'>
            <img
              className='h-[500px] w-[100%] rounded object-cover'
              src={preview ? preview : image}
              alt='img'
            />
          </div>
        )}
        <div>
          <TextareaAutosize
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='Tell Your Story'
            className='w-full text-2xl'
          />
        </div>
        <PostLikeBtn
          handlePostLike={handlePostLike}
          isLiked={isLiked}
          likesCount={likesCount}
        />

        <CommentsLayout comments={comments} addComment={addComment} />
      </div>
    </div>
  );
}

export default PostEdit;
