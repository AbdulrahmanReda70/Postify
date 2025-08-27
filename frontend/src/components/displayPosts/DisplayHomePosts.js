// ------------------ Imports ------------------
import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../../utility/functions";
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import api from "../../api/axios";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import { usePosts } from "../../context/PostsContext";

function DisplayHomePosts({ pageTitle }) {
  const location = useLocation();
  const { allPosts, loadHomePosts, toggleSavedPostState } = usePosts();

  // ------------------ Components & Functions ------------------

  console.log("allPosts allPosts", allPosts);

  async function handleSavePost(e, post) {
    console.log(post);

    e.preventDefault();
    e.stopPropagation();
    const postId = post.id;

    toggleSavedPostState(postId);

    try {
      let res = await api.post(`posts/${postId}/save`);
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
    console.log("USERRR", user);

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
      {}
      <h1 className='text-5xl mb-5 mt-5'>{pageTitle}</h1>
      {!loadHomePosts ? (
        <>
          {allPosts.home.allIds.length !== 0 ? (
            allPosts.home.allIds
              .map((id, index) => {
                const post = allPosts.byId[id];

                // Safety check - skip if post doesn't exist
                if (!post) return null;

                const user = post.user;
                const title = post.title || "";
                const created_at = post.created_at;
                const image = post.image_url;
                const is_saved = post.is_saved || false;
                const section = post.section;
                const canUpdate = post.canUpdate || false;

                return (
                  <Link
                    state={{ from: location.pathname }}
                    to={`/${viewOrEditPost(canUpdate)}/${id}`}
                    className='mb-5 block'
                    key={index}
                  >
                    <div className='flex gap-x-[10px] max-w-[680px] justify-between break-all'>
                      <div className='w-[100%] flex flex-col justify-center gap-y-[12px]'>
                        <div>
                          {user && <DisplayUser user={user} />}
                          <h1 className='text-2xl font-bold'>{title}</h1>
                        </div>

                        <div className='flex mb-[10px] gap-x-[20px] items-center'>
                          {created_at && displayDate(created_at)}
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
                      {image && (
                        <img
                          src={image}
                          alt=''
                          className='w-[150px] min-w-[150px] h-[140px] object-cover'
                        />
                      )}
                    </div>
                    <div className='h-[1px] w-[70%] bg-secondary mb-[25px]'></div>
                  </Link>
                );
              })
              .filter(Boolean) // Remove null entries
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
