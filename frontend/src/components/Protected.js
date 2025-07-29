import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useIsValidToken } from "../context/ValidTokenContext";
let apiUrl = process.env.REACT_APP_API_URL;
function Protected() {
  const token = localStorage.getItem("auth_token");
  const { isValid, setIsValid } = useIsValidToken();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}auth/validate`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  if (isValid === null) {
    return <></>;
  }

  if (isValid) {
    return <Outlet />;
  }
  return <Navigate to='/signin' replace />;
}

export default Protected;
