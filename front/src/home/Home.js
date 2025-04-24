import { useEffect, useRef, useState } from "react";
import DisplayPosts from "../components/DisplayPosts";
import { fetch_u } from "../utility/fetch";
import { CiSearch } from "react-icons/ci";
import { usePosts } from "../context/PostsContext";
import { useInView } from "motion/react";
import { Link } from "react-router-dom";
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
    canFetch,
    setCanFetch,
    homePosts,
    setHomePosts,
    loadHomePosts,
    setLoadHomePosts,
    homeCurrentPage,
    setHomeCurrentPage,
    homeLastPage,
    setHomeLastPage,
  } = usePosts();

  async function handleSearch(e) {
    handleShow();
    let value = e.target.value;
    let res = await fetch_u(`https://51f1-154-178-190-155.ngrok-free.app/api/search?query=${value}`);
    console.log("==", res);
    if (!res.error) {
      const posts = res.data.data;
      const lastPage = res.data.last_page;

      setSearchPosts(posts);
      setSearchLastPage(lastPage);
    }
  }

  useEffect(() => {
    console.log(homeLastPage);

    if (isInView && !loading && homeCurrentPage < homeLastPage) {
      setHomeCurrentPage((prev) => prev + 1);
      setCanFetch(true);
    }
  }, [isInView]);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      let res = await fetch_u(
        `https://51f1-154-178-190-155.ngrok-free.app/api/home_posts?page=${homeCurrentPage}`
      );
      if (!res.error) {
        const posts = res.data.posts.data;
        const lastPage = res.data.posts.last_page;

        setHomePosts((p) => [...p, ...posts]);
        setHomeLastPage(lastPage);
      }
      setLoadHomePosts(false);
      setLoading(false);
    }

    if (canFetch) {
      getPosts();
      setCanFetch(false);
    }
  }, [homeCurrentPage, canFetch]);

  return (
    <div className="container-c">
      <div></div>

      {homePosts.length !== 0 && (
        <div className=" items-center ">
          <div className="flex border-solid border-[1px] flex-row-reverse w-[230px] h-[40px] items-center gap-x-2 pl-4 rounded-full relative">
            <input
              onChange={handleSearch}
              placeholder="Search"
              className="border-none w-[100%] h-[100%] mb-0 outline-none"
              autoComplete="off"
            />
            <CiSearch className="text-gray-400 size-5" />
            {isVisible && (
              <div
                ref={searchRef}
                className="absolute custom-scroll-bar scrollbar-hidden overflow-auto p-3 pt-5 shadow-lg shadow-black bottom-[-11px] left-0 w-[280px] h-[300px] bg-primary translate-y-[100%] rounded-sm z-20"
              >
                <h3 className="border-b-[1px] pb-1 mb-4 text-gray-400">
                  Posts
                </h3>

                {searchPosts.map((post, index) => {
                  return (
                    <Link
                      to={`/view/${post.id}`}
                      key={index}
                      className="flex gap-2 items-center mb-4"
                    >
                      <img
                        src={`https://51f1-154-178-190-155.ngrok-free.app/storage/${post.image}`}
                        alt=""
                        className="rounded-full w-6 h-6"
                      />
                      <div>{post.title}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="w-[100%]">
        <DisplayPosts
          setPosts={setHomePosts}
          loading={loadHomePosts}
          posts={homePosts}
          type={"view"}
          pageTitle={"Home"}
        />
      </div>

      <div ref={ref} style={{ height: 20, background: "transparent" }}></div>
    </div>
  );
}

export default Home;
