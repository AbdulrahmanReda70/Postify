import React, { createContext, useContext, useState } from "react";
// create context
// use it in component and call the component exProvider
// useContext

const postsContext = createContext();

export function HomePostsProvider({ children }) {
  const [homePosts, setHomePosts] = useState([]);
  const [loadHomePosts, setLoadHomePosts] = useState(true);

  const [canFetch, setCanFetch] = useState(true);

  const [historyPosts, setHistoryPosts] = useState([]);
  const [loadHistoryPosts, setLoadHistoryPosts] = useState(true);

  const [savedPosts, setSavedPosts] = useState([]);
  const [loadSavedPosts, setLoadSavedPosts] = useState(true);

  const [homeCurrentPage, setHomeCurrentPage] = useState(1);
  const [homeLastPage, setHomeLastPage] = useState();

  return (
    <postsContext.Provider
      value={{
        homePosts,
        setHomePosts,
        loadHomePosts,
        setLoadHomePosts,
        //
        historyPosts,
        setHistoryPosts,
        loadHistoryPosts,
        setLoadHistoryPosts,
        //
        savedPosts,
        setSavedPosts,
        loadSavedPosts,
        setLoadSavedPosts,
        //
        canFetch,
        setCanFetch,
        //
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
