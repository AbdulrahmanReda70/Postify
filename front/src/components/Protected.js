import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useIsValidToken } from "../context/ValidTokenContext";

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
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/validate",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    return (
      <div className="flex justify-center items-center h-screen bg-primary text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (isValid) {
    return <Outlet />;
  }
  return <Navigate to="/signin" replace />;
}

export default Protected;
