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
      const receivedPostIds = [];
      const currentById = p.byId;
      const currentAllIds = p[section].allIds;

      const newById = { ...currentById };
      // const newAllIds = [...currentAllIds];

      posts.forEach((newPost) => {
        if (newPost?.id != null) {
          // if the post exist merge it
          const id = newPost.id;
          const oldPost = allPosts.byId[id];
          newById[newPost.id] = { ...oldPost, ...newPost };
        } else {
          newById[newPost.id] = newPost;
        }
        receivedPostIds.push(newPost.id);
      });

      const newAllIds = [...new Set([...currentAllIds, ...receivedPostIds])];

      return {
        ...p,
        byId: newById,
        [section]: {
          allIds: newAllIds,
        },
      };
    });
  }

  function deletePost(postId) {
    setAllPosts((prev) => {
      // Remove post from byId
      const newById = { ...prev.byId };
      delete newById[postId];

      // Remove post ID from all sections
      const newState = { ...prev, byId: newById };

      Object.keys(newState).forEach((key) => {
        if (key !== "byId" && newState[key]?.allIds) {
          newState[key] = {
            ...newState[key],
            allIds: newState[key].allIds.filter((id) => id !== postId),
          };
        }
      });

      return newState;
    });
  }

  function toggleSavedPostState(postId) {
    setAllPosts((prev) => {
      // Copy the existing post from global byId
      const existingPost = prev.byId[postId];

      const newSavedPostsIds = prev.saved.allIds.filter(
        (currPId) => currPId !== postId
      );
      if (!existingPost) return prev; // avoid crash if post doesn't exist

      // Toggle is_saved
      const updatedPost = {
        ...existingPost,
        is_saved: !existingPost.is_saved,
      };

      return {
        ...prev,
        saved: {
          allIds: newSavedPostsIds,
        },
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
        deletePost,
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
