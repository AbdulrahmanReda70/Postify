import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { fetch_u } from "../utility/fetch";
import DisplayHomePosts from "../components/displayPosts/DisplayHomePosts";
import DisplayVisitedUserPosts from "../components/displayPosts/DisplayVisitedUserPosts";

export default function VisitedUser() {
  const { visitedUserId } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null); // Store user data
  const [posts, setPosts] = useState([]); // Store user data
  const [loading, setLoading] = useState(null); // Store user data

  const nav = useNavigate();

  // Fetch user data and posts
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user details
        const res = await fetch_u(
          `http://localhost:8000/api/users/${visitedUserId}`,
          "GET"
        );
        if (!res.error) {
          setUser(res.data.user);
          setPosts(res.data.posts);
        } else {
          console.error("Failed to fetch user:", res.message);
          nav("/not-found", { replace: true }); // Redirect if user not found
        }
      } catch (error) {
        console.error("An error occurred:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    }

    fetchUserData();
  }, [visitedUserId, nav]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-c">
      {/* User Info */}
      <div className="flex items-center gap-4 mt-10 mb-8">
        <img
          src={user?.avatar}
          alt={`${user?.username}'s avatar`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <h1 className="text-4xl font-bold">{user?.username}</h1>
      </div>
      <div>{user?.description}</div>

      {/* User Posts */}
      <DisplayVisitedUserPosts
        posts={posts}
        setPosts={setPosts}
        loading={loading}
        type="view"
      />
    </div>
  );
}
