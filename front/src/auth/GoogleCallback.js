// src/GoogleCallback.js

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveUserInfo } from "./authService";

function GoogleCallback() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/auth/callback${location.search}`, {
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
      window.location.reload();
    } else {
      return <div>Some thing went wrong</div>;
    }
  }
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

export default GoogleCallback;
