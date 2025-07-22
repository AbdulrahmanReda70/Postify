import React, { useEffect, useState } from "react";
import { fetch_u } from "../../utility/fetch";
import DisplayMyPosts from "../../components/displayPosts/DisplayMyPosts";
import { useLocation } from "react-router";
import { usePosts } from "../../context/PostsContext";
function History() {
  const { allPosts, setAllPosts, loadHistoryPosts, setLoadHistoryPosts } =
    usePosts();
  const [likesCount, setLikesCount] = useState(null);

  const loc = useLocation();
  console.log(loc);

  useEffect(() => {
    async function getPosts() {
      let res = await fetch_u("http://localhost:8000/api/user/posts");
      if (!res.error) {
        const posts = res.data.posts;
        // setHistoryPosts(posts);
        setLikesCount(res.data.likes_count);

        setAllPosts((p) => {
          const historyPosts = posts.reduce((acc, post) => {
            acc[post.id] = post;
            allPosts.history.allIds.push(post.id);
            return acc;
          }, {});

          const history = allPosts.history;
          const newById = { ...historyPosts };
          const newHistory = { ...history, byId: newById };
          return { ...p, history: newHistory };
        });
      }

      setLoadHistoryPosts(false);
    }
    getPosts();

    return () =>
      setAllPosts((p) => {
        return {
          ...p,
          history: {
            byId: {},
            allIds: [],
          },
        };
      });
  }, []);
  return (
    <div className='container-c'>
      <DisplayMyPosts
        loading={loadHistoryPosts}
        pageTitle={"History"}
        posts={allPosts.history}
        type={"edit"}
      />
    </div>
  );
}

export default History;
