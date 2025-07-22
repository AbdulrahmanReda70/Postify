import React, { useEffect } from "react";
import { fetch_u } from "../../utility/fetch";
import { usePosts } from "../../context/PostsContext";
import DisplayMyPosts from "../../components/displayPosts/DisplayMyPosts";
function Saved() {
  const { loadSavedPosts, setLoadSavedPosts, allPosts, setAllPosts } =
    usePosts();

  useEffect(() => {
    async function getPosts() {
      let res = await fetch_u("http://localhost:8000/api/user/posts/saved");
      if (!res.error) {
        const posts = res.data.posts;

        setAllPosts((p) => {
          const savedPosts = posts.reduce((acc, post) => {
            acc[post.id] = post;
            allPosts.saved.allIds.push(post.id);
            return acc;
          }, {});

          const saved = allPosts.saved;
          const newById = { ...savedPosts };
          const newSaved = { ...saved, byId: newById };
          return { ...p, saved: newSaved };
        });
      }
      setLoadSavedPosts(false);
    }
    getPosts();

    return () =>
      setAllPosts((p) => {
        return {
          ...p,
          saved: {
            byId: {},
            allIds: [],
          },
        };
      });
  }, []);
  // console.log(posts);
  return (
    <div className='container-c'>
      <DisplayMyPosts
        loading={loadSavedPosts}
        pageTitle={"Saved"}
        type={"view"}
      />
    </div>
  );
}

export default Saved;
