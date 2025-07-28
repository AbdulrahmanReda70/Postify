import React, { useState, useEffect } from "react";
import AlertPopup from "../components/popup/AlertPopup";
import api from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.get("notifications");

        if (!response.error) {
          setNotifications(response.data);
        } else {
          setRes({ error: true, message: response.message });
          setIs_open(true);
        }
      } catch (error) {
        console.error("An error occurred while fetching notifications:", error);
        setRes({
          error: true,
          message: "Failed to load notifications. Please try again later.",
        });
        setIs_open(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center text-xl mt-10">
        You have no notifications at the moment.
      </div>
    );
  }

  return (
    <div className="container-c">
      <AlertPopup is_open={is_open} setIs_open={setIs_open} status={res} />
      <h1 className="text-4xl font-bold mb-6">Notifications</h1>
      <div className="flex flex-col gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border border-gray-300 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold">{notification.title}</h2>
            <p className="text-gray-600">{notification.message}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
