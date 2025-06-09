import React, { useEffect, useState, useCallback } from "react";
import { fetch_u } from "../utility/fetch";
import InputModal from "../components/InputModal";
import { getUserInfo } from "../auth/authService";
import { TextareaAutosize } from "@mui/material";
import { useNavigate } from "react-router";

function UserProfile() {
  const [modalOpen, setModalOpen] = useState(false);
  const [from, setFrom] = useState(false);
  const [user, setUser] = useState({});
  const [description, setDescription] = useState("");
  const nav = useNavigate();
  const userL = getUserInfo();

  if (!userL) {
    window.location.href = "/signin";
  }
  console.log(user, "user");

  async function handleUpdate(e) {
    setFrom(e);
    setModalOpen(true);
  }

  async function handleDeleteAccount() {
    let conf = window.confirm(
      "Are you sure you want to delete your account?⚠️"
    );
    if (conf) {
      try {
        const res = await fetch_u("http://localhost:8000/api/user", "DELETE");

        if (!res.error) {
          console.log("Account deleted successfully:", res.message);
          localStorage.clear();
          nav("/signin", { replace: true });
        } else {
          console.error("Failed to delete account:", res.message);
          alert("Failed to delete account. Please try again.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        alert(
          "An error occurred while deleting your account. Please try again."
        );
      }
    }
  }

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to update the description on the server
  const updateDescription = async (newDescription) => {
    const res = await fetch_u("http://localhost:8000/api/user", "PATCH", {
      description: newDescription,
    });

    if (!res.error) {
      console.log("Description updated successfully:", res.data);
    } else {
      console.error("Failed to update description:", res.message);
    }
  };

  // Debounced version of the updateDescription function
  const debouncedUpdateDescription = useCallback(
    debounce(updateDescription, 1000),
    []
  );

  // Handle description change
  const handleDescription = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    debouncedUpdateDescription(newDescription); // Call the debounced function
  };

  useEffect(() => {
    console.log(userL, "user");

    setUser(userL);
    if (userL?.description) {
      setDescription(userL?.description);
    }
  }, []);

  if (!userL) {
    nav("/signin", { replace: true });
  }

  return (
    <div className="container-c">
      <InputModal
        setUser={setUser}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        from={from}
      />
      <div className="flex items-center gap-2 mt-10 mb-4">
        <img src={user.avatar} alt="" className="w-12" />
        <h2 className="text-4xl">{user.username}</h2>
      </div>
      <div>
        <TextareaAutosize
          value={description}
          maxLength={200}
          onChange={handleDescription} // Use the debounced handler
          placeholder="Tell the world about yourself"
          className={`max-w-[600px] h-[100px] max-h-[300px] text-xl mt-5 mb-[80px] pb-[20px] `}
        />
      </div>
      <div className="flex flex-col gap-5 ">
        <div
          onClick={() => handleUpdate("username")}
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="text-xl">Username</div>
          <div className="text-[#8f8e8e]"> {user.username}</div>
        </div>
        <div
          onClick={() => handleUpdate("email")}
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="text-xl">Email</div>
          <div className="text-[#8f8e8e]">{user.email}</div>
        </div>
        <div
          onClick={() => handleUpdate("password")}
          className="flex justify-between items-center cursor-pointer"
        >
          <div className="text-xl">Password</div>
          <div className="text-[#8f8e8e]">*****</div>
        </div>
        <div
          onClick={handleDeleteAccount}
          className="text-red-700 mt-5 cursor-pointer w-fit"
        >
          Delete Account
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
