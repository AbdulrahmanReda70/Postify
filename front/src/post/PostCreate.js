import React, { useState } from "react";
import { TextareaAutosize } from "@mui/material";
import { fetch_u } from "../utility/fetch";
import AlertPopup from "../components/AlertPopup";
import { usePosts } from "../context/PostsContext";
import { useNavigate } from "react-router";

function PostCreate() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const [preview, setPreview] = useState(null);
  const { setCanFetch, setHomePosts, setHomeCurrentPage } = usePosts();
  const nav = useNavigate();
  async function handlePostPublish() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }

    let response = await fetch_u(
      "http://127.0.0.1:8000/api/create_post",
      "POST",
      formData,
      true
    );

    if (response.error) {
      setRes({ error: true, message: response.message });
    } else {
      setRes({ error: false, message: response.data.message });
      setHomePosts([]);
      setHomeCurrentPage(1);
      setCanFetch(true);
      nav("/");
    }
    setIs_open(true);
  }

  return (
    <div>
      <AlertPopup is_open={is_open} setIs_open={setIs_open} status={res} />
      <div className="container-c">
        <label className="flex items-center justify-center w-60 h-14 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg hover:border-blue-500 transition duration-300">
          <span className="text-white">Upload Image</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>
        <button
          onClick={handlePostPublish}
          className={`bg-green flex ml-auto mb-5`}
        >
          Publish
        </button>
        <div>
          <TextareaAutosize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className={`w-[600px] h-[100px] text-4xl mb-[30px] pb-[20px] `}
          />
        </div>
        <div className="flex justify-center mb-8">
          {preview && (
            <img
              className="h-[500px] w-[100%] rounded object-cover"
              src={preview}
              alt="img"
            />
          )}
        </div>

        <div>
          <TextareaAutosize
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell Your Story"
            className="w-[600px] mb-80 text-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
