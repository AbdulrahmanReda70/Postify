import React, { createContext, useContext, useState } from "react";
// create context
// use it in component and call the component exProvider
// useContext

const postsContext = createContext();

export function HomePostsProvider({ children }) {
  const [AllPosts, setAllPosts] = useState({
    home: {
      byId: {},
      allIds: [],
    },

    history: {
      byId: {},
      allIds: [],
    },

    saved: {
      byId: {},
      allIds: [],
    },
  });

  const [loadHomePosts, setLoadHomePosts] = useState(true);
  const [hasFetchedHomePosts, setHasFetchedHomePosts] = useState(false);

  const [homeCurrentPage, setHomeCurrentPage] = useState(1);
  const [homeLastPage, setHomeLastPage] = useState();

  const [firstPost, setFirstPost] = useState({});

  // const [historyPosts, setHistoryPosts] = useState([]);
  const [loadHistoryPosts, setLoadHistoryPosts] = useState(true);

  // const [savedPosts, setSavedPosts] = useState([]);
  const [loadSavedPosts, setLoadSavedPosts] = useState(true);

  function removeSavedPost(id) {
    const savedPostsById = AllPosts.saved.byId;
    const savedPostsAllIds = AllPosts.saved.allIds;

    const newSavedPostsById = Object.fromEntries(
      Object.entries(savedPostsById).filter((ele) => ele[0] !== String(id))
    );

    const newSavedPostsAllIds = savedPostsAllIds.filter((ele) => ele !== id);

    setAllPosts((p) => {
      return {
        ...p,
        saved: {
          byId: { ...newSavedPostsById },
          allIds: newSavedPostsAllIds,
        },
      };
    });
  }

  function toggleSavedPostState(post) {
    console.log("OUT", post.is_hero);
    if (post.is_hero) {
      setFirstPost((p) => {
        return {
          ...p,
          is_saved: !p.is_saved,
        };
      });
      // return null;
    }
    const id = post.id;
    const PostSection = post.section;
    console.log(PostSection, "SEC");

    setAllPosts((p) => {
      return {
        ...p,
        home: p.home.allIds.includes(id)
          ? {
              ...p.home,
              byId: {
                ...p.home.byId,
                [id]: {
                  ...p.home.byId[id],
                  is_saved: !p.home.byId[id].is_saved,
                },
              },
            }
          : p.home,

        history: p.history.allIds.includes(id)
          ? {
              ...p.history,
              byId: {
                ...p.history.byId,
                [id]: {
                  ...p.history.byId[id],
                  is_saved: !p.history.byId[id].is_saved,
                },
              },
            }
          : p.history,
      };
    });
  }

  function updatePost(updatedPost) {
    const id = updatedPost.id;
    const prevPost = AllPosts.home.byId[id] || AllPosts.history.byId[id];
    updatedPost = { ...prevPost, ...updatedPost };
    setAllPosts((p) => {
      return {
        ...p,
        home: p.home.allIds.includes(id)
          ? {
              ...p.home,
              byId: {
                ...p.home.byId,
                [id]: updatedPost,
              },
            }
          : p.home,

        history: p.history.allIds.includes(id)
          ? {
              ...p.history,
              byId: {
                ...p.history.byId,
                [id]: updatedPost,
              },
            }
          : p.history,
      };
    });
  }

  return (
    <postsContext.Provider
      value={{
        updatePost,
        removeSavedPost,
        AllPosts,
        setAllPosts,
        toggleSavedPostState,
        //
        // homePosts,
        // setHomePosts,
        loadHomePosts,
        setLoadHomePosts,
        hasFetchedHomePosts,
        setHasFetchedHomePosts,

        // //
        // historyPosts,
        // setHistoryPosts,
        loadHistoryPosts,
        setLoadHistoryPosts,
        // //
        // savedPosts,
        // setSavedPosts,
        loadSavedPosts,
        setLoadSavedPosts,
        // //

        //
        homeCurrentPage,
        setHomeCurrentPage,
        homeLastPage,
        setHomeLastPage,
        //
        firstPost,
        setFirstPost,
      }}
    >
      {children}
    </postsContext.Provider>
  );
}

export const usePosts = () => useContext(postsContext);
