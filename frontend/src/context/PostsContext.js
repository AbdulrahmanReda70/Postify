import React, { createContext, useContext, useState } from "react";

const postsContext = createContext();

export function PostsProvider({ children }) {
  const [allPosts, setAllPosts] = useState({
    byId: {},

    home: {
      allIds: [],
    },

    history: {
      allIds: [],
    },

    saved: {
      allIds: [],
    },

    currentVisitedUser: {
      allIds: [],
    },
  });

  const [loadHomePosts, setLoadHomePosts] = useState(true);
  const [hasFetchedHomePosts, setHasFetchedHomePosts] = useState(false);

  const [homeCurrentPage, setHomeCurrentPage] = useState(1);
  const [homeLastPage, setHomeLastPage] = useState();

  const [loadHistoryPosts, setLoadHistoryPosts] = useState(true);

  const [loadSavedPosts, setLoadSavedPosts] = useState(true);

  function addPostsToSection(posts, section) {
    setAllPosts((p) => {
      const currentById = p.byId;
      const currentAllIds = p.home.allIds;

      const newById = { ...currentById };
      const newAllIds = [...currentAllIds];

      posts.forEach((newPost) => {
        if (newPost.id) {
          // if the post exist we will merge it
          const id = newPost.id;
          const oldPost = allPosts.byId[id];
          newById[newPost.id] = { ...oldPost, ...newPost };
        } else {
          newById[newPost.id] = newPost;
        }
        newAllIds.push(newPost.id);
      });

      return {
        ...p,
        byId: newById,
        [section]: {
          allIds: newAllIds,
        },
      };
    });
  }

  function removeSavedPost(id) {
    const savedPostsById = allPosts.saved.byId;
    const savedPostsAllIds = allPosts.saved.allIds;

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

  function toggleSavedPostState(postId) {
    setAllPosts((prev) => {
      // Copy the existing post from global byId
      const existingPost = prev.byId[postId];
      if (!existingPost) return prev; // avoid crash if post doesn't exist

      // Toggle is_saved
      const updatedPost = {
        ...existingPost,
        is_saved: !existingPost.is_saved,
      };

      return {
        ...prev,
        byId: {
          ...prev.byId,
          [postId]: updatedPost,
        },
      };
    });
  }

  function updatePost(updatedPost, section) {
    const id = updatedPost.id;
    const prevPost = allPosts.byId[id];

    // Merge with previous post if exists
    const mergedPost = { ...prevPost, ...updatedPost };

    setAllPosts((prev) => {
      return {
        ...prev,
        byId: {
          ...prev.byId,
          [id]: mergedPost,
        },
      };
    });
  }

  return (
    <postsContext.Provider
      value={{
        updatePost,
        removeSavedPost,
        setAllPosts,
        toggleSavedPostState,
        addPostsToSection,
        allPosts,
        // //
        loadHomePosts,
        setLoadHomePosts,
        hasFetchedHomePosts,
        setHasFetchedHomePosts,
        // //
        loadHistoryPosts,
        setLoadHistoryPosts,
        // //
        loadSavedPosts,
        setLoadSavedPosts,
        // //
        homeCurrentPage,
        setHomeCurrentPage,
        homeLastPage,
        setHomeLastPage,
      }}
    >
      {children}
    </postsContext.Provider>
  );
}

export const usePosts = () => useContext(postsContext);
