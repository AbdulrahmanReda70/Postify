import React from "react";
import { BsBell, BsDot } from "react-icons/bs";
import { displayDate } from "../../utility/functions";

function NotificationItem({ item, onMarkRead }) {
  const isUnread = !item.read_at;
  const message = item?.data?.message || item?.message || "No message";
  const createdAt = item?.created_at || item?.time;

  return (
    <div
      className={`bg-secondary rounded-xl p-4 mb-3 flex gap-3 items-start transition-colors ${
        isUnread ? "ring-1 ring-green/40" : ""
      }`}
    >
      <div className='mt-1 text-green'>
        <BsBell size={20} />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-3'>
          <p className='font-medium break-words'>{message}</p>
          <span className='text-xs text-gray-300 whitespace-nowrap'>
            {createdAt ? displayDate(createdAt) : ""}
          </span>
        </div>

        {isUnread && (
          <div className='flex items-center gap-1 mt-2'>
            <BsDot className='text-green' size={22} />
            <span className='text-sm text-gray-200'>Unread</span>
          </div>
        )}

        {isUnread && (
          <div className='mt-3'>
            <button
              onClick={() => onMarkRead(item.id)}
              className='px-3 py-1.5 bg-green/90 hover:bg-green text-white rounded-lg text-sm'
            >
              Mark as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
