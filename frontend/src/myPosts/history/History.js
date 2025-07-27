import React, { useEffect, useState } from "react";
import { fetch_u } from "../../utility/fetch";
import DisplayHistoryOrSavedPosts from "../../components/displayPosts/DisplayHistoryOrSavedPosts";
import { useLocation } from "react-router";
import { usePosts } from "../../context/PostsContext";
function History() {
  const { addPostsToSection, loadHistoryPosts, setLoadHistoryPosts } =
    usePosts();
  const [likesCount, setLikesCount] = useState(null);

  const loc = useLocation();
  console.log(loc);

  useEffect(() => {
    async function getPosts() {
      let res = await fetch_u("http://13.53.39.169/api/user/posts");
      if (!res.error) {
        const posts = res.data.posts;
        setLikesCount(res.data.likes_count);
        addPostsToSection(posts, "history");
      }

      setLoadHistoryPosts(false);
    }
    getPosts();
  }, []);
  return (
    <div className='container-c'>
      <DisplayHistoryOrSavedPosts
        loading={loadHistoryPosts}
        pageTitle={"History"}
        type={"edit"}
      />
    </div>
  );
}

export default History;
