import React from "react";
import NotificationItem from "./NotificationItem";

function NotificationsList({ items, loading, onMarkRead }) {
  if (loading) {
    return (
      <div className='container-c'>
        <div className='bg-secondary rounded-xl p-5'>
          Loading notifications…
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className='container-c'>
        <div className='bg-secondary rounded-xl p-8 text-center text-gray-200'>
          No notifications yet.
        </div>
      </div>
    );
  }

  return (
    <div className='container-c'>
      {items.map((n) => (
        <NotificationItem
          key={n.id ?? n.time}
          item={n}
          onMarkRead={onMarkRead}
        />
      ))}
    </div>
  );
}

export default NotificationsList;
