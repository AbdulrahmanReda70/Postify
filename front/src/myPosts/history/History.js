import React, { useEffect, useState } from "react";
import { fetch_u } from "../../utility/fetch";
import DisplayPosts from "../../components/DisplayPosts";
import { useLocation } from "react-router";
import { usePosts } from "../../context/PostsContext";
function History() {
  const {
    historyPosts,
    setHistoryPosts,
    loadHistoryPosts,
    setLoadHistoryPosts,
  } = usePosts();
  const [likesCount, setLikesCount] = useState(null);

  const loc = useLocation();
  console.log(loc);

  useEffect(() => {
    async function getPosts() {
      let res = await fetch_u("https://51f1-154-178-190-155.ngrok-free.app/api/user_posts");
      if (!res.error) {
        setHistoryPosts(res.data.posts);
        setLikesCount(res.data.likes_count);
      }

      setLoadHistoryPosts(false);
    }
    getPosts();
  }, []);
  return (
    <div className="container-c">
      <DisplayPosts
        setPosts={setHistoryPosts}
        loading={loadHistoryPosts}
        pageTitle={"History"}
        posts={historyPosts}
        type={"edit"}
      />
    </div>
  );
}

export default History;
