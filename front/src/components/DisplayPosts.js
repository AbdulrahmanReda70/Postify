import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import img from "..//images/signin.jpg";
import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../utility/functions";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { fetch_u } from "../utility/fetch";
import HomeSkeleton from "./HomeSkeleton";
import UserPostsSkeleton from "./UserPostsSkeleton";
import { usePosts } from "../context/PostsContext";

function DisplayPosts({ posts = [], loading, pageTitle, type, setPosts }) {
  const location = useLocation();
  const [savePost, setSavePost] = useState(false);
  const { setCanFetch, setHomePosts } = usePosts();

  async function handleSavePost(e, post) {
    e.preventDefault();
    e.stopPropagation();
    const postId = post.id;
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, is_saved: !p.is_saved } : p
      )
    );

    try {
      let res = await fetch_u(
        `http://127.0.0.1:8000/api/save_post/${postId}`,
        "POST"
      );
      if (res.data.saved) {
        setSavePost(true);
      } else {
        setSavePost(false);
      }
      if (pageTitle !== "Home") setHomePosts([]);
      setCanFetch(true);
    } catch (error) {
      console.log("+_+_+", error);
    }
  }

  return !loading ? (
    <>
      <h1 className="text-5xl mb-5 mt-5">{pageTitle}</h1>
      {console.log(posts, "post")}

      {posts.length !== 0 ? (
        posts.map((post, index) => {
          return (
            <Link
              state={{ from: location.pathname }}
              to={`/${type}/${post.id}`}
              className="mb-5 block"
              key={index}
            >
              <div className="flex gap-x-[10px] max-w-[680px] justify-between break-all">
                <div className="w-[100%] flex flex-col justify-center gap-y-[12px]">
                  <div>
                    {pageTitle !== "History" && (
                      <Link
                        to={`/user/${post?.user?.id}`}
                        className="flex mb-3 items-center gap-x-[6px] z-20"
                      >
                        {post?.user?.avatar && (
                          <img
                            className="w-[34px] rounded-full h-[34px] object-cover"
                            src={post?.user?.avatar}
                            alt=""
                          />
                        )}
                        {post?.user?.username && post.user.username}
                      </Link>
                    )}

                    <h1 className="text-2xl font-bold">{post.title}</h1>
                  </div>

                  <div className="flex  mb-[10px] gap-x-[20px] items-center">
                    {displayDate(post.created_at)}
                    <div className="flex items-center gap-2 z-10">
                      {pageTitle !== "Saved" &&
                        (!post.is_saved ? (
                          <BsBookmark
                            onClick={(e) => handleSavePost(e, post)}
                            className="cursor-pointer z-20"
                            style={{ fontSize: "20px" }}
                          />
                        ) : (
                          <BsBookmarkCheckFill
                            onClick={(e) => handleSavePost(e, post)}
                            className="cursor-pointer z-20"
                            style={{ fontSize: "20px" }}
                          />
                        ))}
                    </div>
                    {/* {likePost ? (
                    <IoBookmark
                      className="cursor-pointer"
                      style={{ fontSize: "30px" }}
                    />
                  ) : (
                    <CiBookmarkPlus
                    className="cursor-pointer"
                    style={{ fontSize: "30px" }}
                    />
                  )} */}
                  </div>
                </div>
                <img
                  src={`http://127.0.0.1:8000/storage/${post.image}`}
                  alt=""
                  className="w-[150px] min-w-[150px] h-[140px] object-cover"
                />
              </div>
              <div className="h-[1px] w-[70%] bg-secondary  mb-[25px]"></div>
            </Link>
          );
        })
      ) : (
        <h1>No Posts Found</h1>
      )}
    </>
  ) : (
    <div className="container-c">
      {type === "view" ? <HomeSkeleton /> : <UserPostsSkeleton />}
    </div>
  );
}

export default DisplayPosts;
