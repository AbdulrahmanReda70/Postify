import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../../utility/functions";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { fetch_u } from "../../utility/fetch";
import HistorySkeleton from "../skeletons/HistorySkeleton";
import SavedSkeleton from "../skeletons/SavedSkeleton";
import { usePosts } from "../../context/PostsContext";

function DisplayMyPosts({ posts = [], loading, pageTitle, type }) {
  const category = pageTitle.toLocaleLowerCase(); // get posts group history | saved
  const location = useLocation();
  const { AllPosts, toggleSavedPostState, setFirstPost } = usePosts();

  async function handleSavePost(e, post) {
    e.preventDefault();
    e.stopPropagation();
    const postId = post.id;
    console.log(post);

    console.log("FROM_History", AllPosts);

    toggleSavedPostState(post);

    try {
      await fetch_u(`http://localhost:8000/api/posts/${postId}/save`, "POST");
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

  return (
    <>
      {!loading ? (
        <>
          <h1 className="text-5xl mb-5 mt-5">{pageTitle}</h1>
          {AllPosts[category].allIds.length !== 0 ? (
            AllPosts[category].allIds.map((id, index) => {
              const title = AllPosts[category].byId[id].title;
              const created_at = AllPosts[category].byId[id].created_at;
              const image = AllPosts[category].byId[id].image;
              const is_saved = AllPosts[category].byId[id].is_saved;
              const section = AllPosts[category].byId[id].section;
              const is_hero = AllPosts[category].byId[id].is_hero;
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
                        {pageTitle !== "History" && (
                          <DisplayUser
                            post={{
                              id,
                              title,
                              created_at,
                              image,
                              is_saved,
                              // is_hero,
                            }}
                          />
                        )}

                        <h1 className="text-2xl font-bold">{title}</h1>
                      </div>

                      <div className="flex  mb-[10px] gap-x-[20px] items-center">
                        {displayDate(created_at)}
                        <div className="flex items-center gap-2 z-10">
                          {pageTitle !== "Saved" && (
                            <SaveIcon
                              isSaved={is_saved}
                              onClick={(e) =>
                                handleSavePost(e, {
                                  id,
                                  is_saved,
                                  section,
                                  is_hero,
                                })
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <img
                      src={`http://localhost:8000/storage/${image}`}
                      alt=""
                      className="w-[150px] min-w-[150px] h-[140px] object-cover"
                    />
                  </div>
                  <div className="h-[1px] w-[70%] bg-secondary  mb-[25px]"></div>
                </Link>
              );
            })
          ) : (
            <h1>No Posts Found</h1>
          )}
        </>
      ) : (
        <div className="container-c">
          {pageTitle === "History" ? <HistorySkeleton /> : <SavedSkeleton />}
        </div>
      )}
    </>
  );
}

export default DisplayMyPosts;
