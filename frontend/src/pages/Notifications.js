import React from "react";
import NotificationsList from "../components/notifications/NotificationsList";
import { useNotifications } from "../context/NotificationsContext";

function Notifications() {
  const { loading, notifications, markAsRead } = useNotifications();

  if (loading) return <div>Loading...</div>;
  if (notifications.length === 0)
    return (
      <div className='container-c'>
        <h1 className='text-5xl mb-5 mt-5'>Notifications</h1>
        <div className='bg-secondary rounded-xl p-8 text-center text-gray-200'>
          No notifications yet.
        </div>
      </div>
    );

  return (
    <div className='container-c'>
      <h1 className='text-5xl mb-5 mt-5'>Notifications</h1>
      <NotificationsList
        items={notifications}
        loading={loading}
        onMarkRead={markAsRead}
      />
    </div>
  );
}

export default Notifications;
