import React, { useState } from "react";
import { TextareaAutosize } from "@mui/material";
import api from "../api/axios";
import AlertPopup from "../components/popup/AlertPopup";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router";
import WriteComment from "../components/comment/WriteComment";
import Comment from "../components/comment/Comment";
import CommentsLayout from "../components/comment/CommentsLayout";

function PostCreate() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  async function handlePostPublish() {
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (image) {
        formData.append("image", image);
      }

      let response = await api.post("posts", formData);

      if (response.error) {
        setRes({ error: true, message: response.message });
      } else {
        setRes({ error: false, message: response.data.message });
        nav("/posts/history");
      }
      setIs_open(true);
    } catch (error) {
      console.log(error, "++++");

      setRes({
        error: true,
        message: error.message || "Failed to create post. Please try again.",
      });
      setIs_open(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <AlertPopup is_open={is_open} setIs_open={setIs_open} status={res} />
      <div className='container-c'>
        <label
          className={`flex items-center justify-center w-60 h-14 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg hover:border-blue-500 transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className='text-white'>Upload Image</span>
          <input
            type='file'
            className='hidden'
            disabled={isLoading}
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>
        <button
          onClick={handlePostPublish}
          disabled={isLoading}
          className={`bg-green flex items-center justify-center ml-auto mb-5 px-6 py-2 rounded transition duration-200 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </button>
        <div>
          <TextareaAutosize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title'
            disabled={isLoading}
            className={`w-[600px] h-[100px] text-4xl mb-[30px] pb-[20px] ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
        <div className='flex justify-center mb-8'>
          {preview && (
            <img
              className={`h-[500px] w-[100%] rounded object-cover ${
                isLoading ? "opacity-70" : ""
              }`}
              src={preview}
              alt='img'
            />
          )}
        </div>

        <div>
          <TextareaAutosize
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='Tell Your Story'
            disabled={isLoading}
            className={`w-[600px] mb-80 text-2xl ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
