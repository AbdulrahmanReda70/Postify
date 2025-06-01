// ------------------ Imports ------------------
import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../../utility/functions";
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import { fetch_u } from "../../utility/fetch";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import { usePosts } from "../../context/PostsContext";

function DisplayVisitedUserPosts({
  posts = [],
  loading,
  pageTitle,
  type,
  setPosts,
}) {
  const location = useLocation();
  const { setHomePosts, firstPost } = usePosts();

  // ------------------ Components & Functions ------------------

  async function handleSavePost(e, post) {
    e.preventDefault();
    e.stopPropagation();
    const postId = post.id;
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, is_saved: !p.is_saved } : p
      )
    );

    setHomePosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, is_saved: !p.is_saved } : p
      )
    );

    try {
      let res = await fetch_u(
        `http://localhost:8000/api/posts/${postId}/save`,
        "POST"
      );
      // if (pageTitle !== "Home") setHomePosts([]);
    } catch (error) {
      console.log("+_+_+", error);
    }
  }

  function SaveIcon({ isSaved, onClick }) {
    const Icon = isSaved ? BsBookmarkCheckFill : BsBookmark;
    return (
      <Icon
        onClick={onClick}
        className="cursor-pointer z-20"
        style={{ fontSize: "20px" }}
      />
    );
  }

  function DisplayUser({ post }) {
    return (
      <Link
        to={`/user/${post?.user?.id}`}
        className="flex mb-3 items-center gap-x-[6px] z-20"
      >
        {post?.user?.avatar && (
          <img
            className="w-[34px] rounded-full h-[34px] object-cover"
            src={post?.user?.avatar}
            alt=""
          />
        )}
        {post?.user?.username && post.user.username}
      </Link>
    );
  }

  function DisplayFirstPost() {
    return (
      <Link
        state={{ from: location.pathname }}
        to={`/${type}/${firstPost?.id}`}
        className="mb-5 block"
      >
        <div className="flex gap-x-[10px] max-w-[680px] justify-between break-all">
          <div className="w-[100%] flex flex-col justify-center gap-y-[12px]">
            <div>
              <DisplayUser post={firstPost} />

              <h1 className="text-2xl font-bold">{firstPost?.title}</h1>
            </div>

            <div className="flex  mb-[10px] gap-x-[20px] items-center">
              {displayDate(firstPost?.created_at)}
              <div className="flex items-center gap-2 z-10">
                <SaveIcon
                  onClick={(e) => handleSavePost(e, firstPost)}
                  isSaved={firstPost?.is_saved}
                />
              </div>
            </div>
          </div>
          <img
            src={`http://localhost:8000/storage/${firstPost?.image}`}
            alt=""
            className="w-[150px] min-w-[150px] h-[140px] object-cover"
          />
        </div>
        <div className="h-[1px] w-[70%] bg-secondary  mb-[25px]"></div>
      </Link>
    );
  }

  // ------------------ Main return ------------------

  return (
    <>
      <h1 className="text-5xl mb-5 mt-5">{pageTitle}</h1>
      <DisplayFirstPost />
      {!loading ? (
        <>
          {posts.length !== 0 ? (
            posts.map(({ id, title, created_at, image, is_saved }, index) => {
              return (
                <Link
                  state={{ from: location.pathname }}
                  to={`/${type}/${id}`}
                  className="mb-5 block"
                  key={index}
                >
                  <div className="flex gap-x-[10px] max-w-[680px] justify-between break-all">
                    <div className="w-[100%] flex flex-col justify-center gap-y-[12px]">
                      <div>
                        <DisplayUser
                          post={{ id, title, created_at, image, is_saved }}
                        />
                        <h1 className="text-2xl font-bold">{title}</h1>
                      </div>

                      <div className="flex mb-[10px] gap-x-[20px] items-center">
                        {displayDate(created_at)}
                        <div className="flex items-center gap-2 z-10">
                          <SaveIcon
                            onClick={(e) => handleSavePost(e, { id, is_saved })}
                            isSaved={is_saved}
                          />
                        </div>
                      </div>
                    </div>
                    <img
                      src={`http://localhost:8000/storage/${image}`}
                      alt=""
                      className="w-[150px] min-w-[150px] h-[140px] object-cover"
                    />
                  </div>
                  <div className="h-[1px] w-[70%] bg-secondary mb-[25px]"></div>
                </Link>
              );
            })
          ) : (
            <h1>No Posts Found</h1>
          )}
        </>
      ) : (
        <div className="container-c">
          <HomeSkeleton />
        </div>
      )}
    </>
  );
}

export default DisplayVisitedUserPosts;
