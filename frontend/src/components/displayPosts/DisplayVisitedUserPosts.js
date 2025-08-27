import { Link, useLocation } from "react-router-dom";
import { displayDate } from "../../utility/functions";
import { BsBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import api from "../../api/axios";
import HomeSkeleton from "../skeletons/HomeSkeleton";
import { usePosts } from "../../context/PostsContext";

function DisplayVisitedUserPosts({ loading, pageTitle }) {
  const location = useLocation();
  const { toggleSavedPostState, allPosts } = usePosts();

  // ------------------ Components ------------------

  async function handleSavePost(e, post) {
    e.preventDefault();
    e.stopPropagation();

    const { id, section } = post;
    toggleSavedPostState(id); // locally toggle

    try {
      await api.post(`posts/${id}/save`);
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
    if (!user) return null;

    return (
      <Link
        to={`/user/${user.id}`}
        className='flex mb-3 items-center gap-x-[6px] z-20'
      >
        {user.avatar && (
          <img
            className='w-[34px] rounded-full h-[34px] object-cover'
            src={user.avatar}
            alt=''
          />
        )}
        {user.username && user.username}
      </Link>
    );
  }

  // ------------------ Main return ------------------

  return (
    <>
      <h1 className='text-5xl mb-5 mt-5'>{pageTitle}</h1>

      {!loading ? (
        <>
          {allPosts.currentVisitedUser.allIds.length !== 0 ? (
            allPosts.currentVisitedUser.allIds
              .map((id, index) => {
                const post = allPosts.byId[id];
                if (!post) return null;

                const {
                  title,
                  created_at,
                  image_url,
                  is_saved,
                  section,
                  user,
                } = post;

                return (
                  <Link
                    state={{ from: location.pathname }}
                    to={`/view/${id}`}
                    className='mb-5 block'
                    key={index}
                  >
                    <div className='flex gap-x-[10px] max-w-[680px] justify-between break-all'>
                      <div className='w-[100%] flex flex-col justify-center gap-y-[12px]'>
                        <div>
                          <DisplayUser user={user} />
                          <h1 className='text-2xl font-bold'>{title || ""}</h1>
                        </div>

                        <div className='flex mb-[10px] gap-x-[20px] items-center'>
                          {created_at && displayDate(created_at)}
                          <div className='flex items-center gap-2 z-10'>
                            <SaveIcon
                              onClick={(e) =>
                                handleSavePost(e, { id, is_saved, section })
                              }
                              isSaved={is_saved || false}
                            />
                          </div>
                        </div>
                      </div>
                      {image_url && (
                        <img
                          src={image_url}
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
            <h1>No Posts Found</h1>
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

export default DisplayVisitedUserPosts;
