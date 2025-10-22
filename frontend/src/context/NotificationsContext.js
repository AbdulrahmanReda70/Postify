import React, { createContext, useContext, useEffect, useState } from "react";
import NotificationService from "../services/notification/NotificationService";
import pusher from "../pusher";

const NotificationsContext = createContext();

const notificationService = new NotificationService();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on mount
  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const result = await notificationService.getNotifications();
        setNotifications(result);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((n) => n.read_at === null).length;
    setUnreadCount(count);
  }, [notifications]);

  // Subscribe to real-time notifications
  useEffect(() => {
    const userString = localStorage.getItem("user");
    let userId = null;
    console.log("UU", userString);

    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log(user);
        userId = user?.user_id || user?.id;
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    if (!userId) {
      console.error("No user ID found, cannot subscribe to private channel");
      return;
    }

    // Subscribe to the private channel
    const privateChannel = pusher.subscribe(`private-user.${userId}`);

    // Bind to the event name defined in broadcastAs()
    privateChannel.bind("UserNotification", (data) => {
      console.log("New notification received:", data);
      // Add the new notification to the state
      setNotifications((prev) => [data, ...prev]);
    });

    // Subscribe to public offers channel
    const publicChannel = pusher.subscribe("offers");

    publicChannel.bind("UserNotification", (data) => {
      console.log("📰 New public offer:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      privateChannel.unbind_all();
      privateChannel.unsubscribe();
      publicChannel.unbind_all();
      publicChannel.unsubscribe();
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  };

  const value = {
    notifications,
    setNotifications,
    loading,
    unreadCount,
    setUnreadCount,
    markAsRead,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
}
