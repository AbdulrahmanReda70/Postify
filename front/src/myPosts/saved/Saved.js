import React, { useEffect } from "react";
import { fetch_u } from "../../utility/fetch";
import DisplayPosts from "../../components/DisplayPosts";
import { usePosts } from "../../context/PostsContext";
function Saved() {
  const { savedPosts, setSavedPosts, loadSavedPosts, setLoadSavedPosts } =
    usePosts();

  useEffect(() => {
    async function getPosts() {
      let res = await fetch_u("https://51f1-154-178-190-155.ngrok-free.app/api/saved_posts");
      if (!res.error) {
        setSavedPosts(res.data.posts);
      }
      setLoadSavedPosts(false);
    }
    getPosts();
  }, []);
  // console.log(posts);
  return (
    <div className="container-c">
      <DisplayPosts
        loading={loadSavedPosts}
        pageTitle={"Saved"}
        posts={savedPosts}
        type={"view"}
      />
    </div>
  );
}

export default Saved;
