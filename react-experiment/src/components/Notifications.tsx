import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getNotificationsByUserId,
  markAllNotificationsAsRead,
  getRequestById,
} from '../services/storage';
import { AcceptOffer } from './AcceptOffer';
import type { Request } from '../types';

export const Notifications = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [notifications, setNotifications] = useState(
    user ? getNotificationsByUserId(user.id) : []
  );

  useEffect(() => {
    if (user) {
      setNotifications(getNotificationsByUserId(user.id));
    }
  }, [user, isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = () => {
    setIsOpen(true);
    if (user) {
      markAllNotificationsAsRead(user.id);
    }
  };

  const handleNotificationClick = (requestId: string) => {
    const request = getRequestById(requestId);
    if (request) {
      setSelectedRequest(request);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={handleOpen}
          className="relative p-2 text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => {
                      const request = getRequestById(notification.requestId);

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            if (request) {
                              handleNotificationClick(notification.requestId);
                            }
                          }}
                        >
                          <p className="text-sm">
                            {request ? (
                              <>
                                Someone offered help on your request: <strong>{request.title}</strong>
                              </>
                            ) : (
                              'New offer on your request'
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {selectedRequest && (
        <AcceptOffer
          request={selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            setIsOpen(false);
          }}
          onUpdate={() => {
            if (user) {
              setNotifications(getNotificationsByUserId(user.id));
            }
          }}
        />
      )}
    </>
  );
};

