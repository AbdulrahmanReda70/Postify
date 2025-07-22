// ------------------ Imports ------------------
import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../../utility/functions";
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import { fetch_u } from "../../utility/fetch";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import { usePosts } from "../../context/PostsContext";

function DisplayHomePosts({ posts = [], pageTitle }) {
  const location = useLocation();
  const { allPosts, loadHomePosts, toggleSavedPostState } = usePosts();

  // ------------------ Components & Functions ------------------

  async function handleSavePost(e, post) {
    console.log(post);

    e.preventDefault();
    e.stopPropagation();
    const postId = post.id;

    toggleSavedPostState(post);

    try {
      let res = await fetch_u(
        `http://localhost:8000/api/posts/${postId}/save`,
        "POST"
      );
    } catch (error) {
      console.log("+_+_+", error);
    }
  }

  function SaveIcon({ isSaved, onClick }) {
    const Icon = isSaved ? BsBookmarkCheckFill : BsBookmark;
    return (
      <Icon
        onClick={onClick}
        className='cursor-pointer z-20'
        style={{ fontSize: "20px" }}
      />
    );
  }

  function DisplayUser({ user }) {
    console.log("user in DisplayUser", user);

    const avatar = user.avatar;
    const username = user.username;
    return (
      <Link
        to={`/user/${user.id}`}
        className='flex mb-3 items-center gap-x-[6px] z-20'
      >
        {avatar && (
          <img
            className='w-[34px] rounded-full h-[34px] object-cover'
            src={avatar}
            alt=''
          />
        )}
        {username && username}
      </Link>
    );
  }

  function viewOrEditPost(canUpdate) {
    console.log("canUpdate", canUpdate);

    if (canUpdate) return "edit";
    return "view";
  }

  // ------------------ Main return ------------------

  return (
    <>
      <h1 className='text-5xl mb-5 mt-5'>{pageTitle}</h1>
      {!loadHomePosts ? (
        <>
          {allPosts.home.allIds.length !== 0 ? (
            allPosts.home.allIds.map((id, index) => {
              const title = allPosts.home.byId[id].title;
              const created_at = allPosts.home.byId[id].created_at;
              const image = allPosts.home.byId[id].image;
              const is_saved = allPosts.home.byId[id].is_saved;
              const section = allPosts.home.byId[id].section;
              const canUpdate = allPosts.home.byId[id].canUpdate;
              const user = allPosts.home.byId[id].user;

              return (
                <Link
                  state={{ from: location.pathname }}
                  to={`/${viewOrEditPost(canUpdate)}/${id}`}
                  className='mb-5 block'
                  key={index}
                >
                  <div className='flex gap-x-[10px] max-w-[680px] justify-between break-all'>
                    <div className='w-[100%] flex flex-col justify-center gap-y-[12px]'>
                      {}
                      <div>
                        <DisplayUser user={user} />
                        <h1 className='text-2xl font-bold'>{title}</h1>
                      </div>

                      <div className='flex mb-[10px] gap-x-[20px] items-center'>
                        {displayDate(created_at)}
                        <div className='flex items-center gap-2 z-10'>
                          <SaveIcon
                            onClick={(e) =>
                              handleSavePost(e, { id, is_saved, section })
                            }
                            isSaved={is_saved}
                          />
                        </div>
                      </div>
                    </div>
                    <img
                      src={`http://localhost:8000/storage/${image}`}
                      alt=''
                      className='w-[150px] min-w-[150px] h-[140px] object-cover'
                    />
                  </div>
                  <div className='h-[1px] w-[70%] bg-secondary mb-[25px]'></div>
                </Link>
              );
            })
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className='container-c'>
          <HomeSkeleton />
        </div>
      )}
    </>
  );
}

export default DisplayHomePosts;
