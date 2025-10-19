import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveUserInfo } from "../api/authService";
import logo from "../images/leaf.png";

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}auth/callback${location.search}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      });
  }, []);

  // Helper method to fetch User data for authenticated user
  // Watch out for "Authorization" header that is added to this call

  if (loading) {
    return <DisplayLoading />;
  } else {
    if (data.user) {
      localStorage.setItem("auth_token", data.access_token);
      saveUserInfo(data.user);
      nav("/", { replace: true });
    } else {
      return <div>Some thing went wrong</div>;
    }
  }
}

function DisplayLoading() {
  return (
    <div className='flex justify-center items-center h-screen bg-primary text-white'>
      <div className='flex flex-col items-center gap-4'>
        <img src={logo} className='size-11 mb-[5px]' />{" "}
      </div>
    </div>
  );
}

export default GoogleCallback;
