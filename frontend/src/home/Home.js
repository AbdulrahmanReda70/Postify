import { useEffect, useRef, useState } from "react";
import DisplayHomePosts from "../components/displayPosts/DisplayHomePosts";
import { CiSearch } from "react-icons/ci";
import { usePosts } from "../context/PostsContext";
import { useInView } from "motion/react";
import { Link } from "react-router-dom";
import api from "../api/axios";
function Home() {
  const [searchLastPage, setSearchLastPage] = useState();
  const [searchPosts, setSearchPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [isVisible, setIsVisible] = useState(false);
  const searchRef = useRef(null);

  // Show element when specific logic is met
  const handleShow = () => {
    setIsVisible(true);
  };

  // Hide element when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    addPostsToSection,
    setLoadHomePosts,
    homeCurrentPage,
    setHomeCurrentPage,
    homeLastPage,
    hasFetchedHomePosts,
    setHasFetchedHomePosts,
    setHomeLastPage,
  } = usePosts();

  async function handleSearch(e) {
    console.log(e.target.value);
    handleShow();
    let value = e.target.value;
    let res = await api.get(`posts/search?query=${value}`);
    if (!res.error) {
      const posts = res.data.data;
      const lastPage = res.data.last_page;

      setSearchPosts(posts);
      setSearchLastPage(lastPage);
    }
  }

  function renderSearchInput() {
    return (
      <div className='relative w-full max-w-md mb-[40px]'>
        {/* Input container */}
        <div
          className='flex items-center bg-[#1e1e1f] border border-gray-700 rounded-2xl px-3 py-1
                      hover:border-gray-500 focus-within:border-blue-500 transition-all duration-200 shadow-sm '
        >
          <CiSearch className='text-gray-400 size-5 mr-2' />
          <input
            onChange={handleSearch}
            placeholder='Search'
            className='bg-transparent border-none w-full outline-none text-gray-200 placeholder-gray-500 !mb-0'
            autoComplete='off'
          />
        </div>

        {/* Dropdown results */}
        {isVisible && (
          <div
            ref={searchRef}
            className='absolute top-full mt-2 left-0 right-0 custom-scroll-bar scrollbar-hidden
                     overflow-auto p-3 opacity-[97%] max-h-[310px] rounded-2xl z-20
                     bg-[#1e1e1f] border border-gray-700 shadow-lg'
          >
            {searchPosts.length > 0 ? (
              searchPosts.map((post, index) => (
                <Link
                  to={`/view/${post.id}`}
                  key={index}
                  className='flex gap-3 items-center mb-2 hover:bg-[#414140] p-2 rounded-lg transition'
                >
                  <img
                    src={post.image_url}
                    alt=''
                    className='rounded min-6 w-6  h-6'
                  />
                  <div className='text-gray-200'>{post.title}</div>
                </Link>
              ))
            ) : (
              <div className='text-gray-400 text-center py-10'>
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    if (isInView && !loading && homeCurrentPage < homeLastPage) {
      setHomeCurrentPage((prev) => prev + 1);
      setHasFetchedHomePosts(false);
    }
  }, [
    hasFetchedHomePosts,
    homeCurrentPage,
    homeLastPage,
    loading,
    setHasFetchedHomePosts,
    setHomeCurrentPage,
    isInView,
  ]);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      let res = await api.get(`posts/home?page=${homeCurrentPage}`);
      if (!res.error) {
        let posts = res.data.posts.data;
        posts.forEach((post) => {
          post.section = "home";
        });
        const lastPage = res.data.posts.last_page;

        addPostsToSection(posts, "home");
        setHomeLastPage(lastPage);
      }
      setLoadHomePosts(false);
      setLoading(false);
      setHasFetchedHomePosts(true);
    }
    if (!hasFetchedHomePosts) {
      getPosts();
    }
  }, [homeCurrentPage]);

  return (
    <div className='container-c'>
      {renderSearchInput()}
      <div className='w-[100%]'>
        <DisplayHomePosts />
      </div>
      <div ref={ref} style={{ height: 20, background: "transparent" }}></div>
    </div>
  );
}

export default Home;
