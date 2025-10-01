import { useEffect, useState } from "react";
import NotificationService from "../services/notification/NotificationService";

// Create service instance outside the hook to avoid recreation
const notificationService = new NotificationService();

function useNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  useEffect(() => {
    let count = 0;
    notifications.forEach((n) => {
      if (n.read_at === null) {
        count++;
      }
    });
    setUnreadCount(count);
  }, [notifications]);

  return {
    unreadCount,
    setUnreadCount,
    notifications,
    loading,
    setNotifications,
  };
}

export default useNotification;
