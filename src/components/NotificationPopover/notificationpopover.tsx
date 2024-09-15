import React, { useState, useEffect } from "react";
import { PiMailboxBold } from "react-icons/pi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  content: string;
  createdAt: string;
  read: boolean;
  projectId: string;
}

const NotificationPopover = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) => ({ ...n, read: true }))
        );
        setUnreadCount(0);
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.projectId) {
      router.push(`/projects/${notification.projectId}`);
      setIsOpen(false);
    }
  };

  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <PiMailboxBold className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 mx-20 my-3">
        <div className="max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-2 p-2 cursor-pointer ${
                  notification.read ? "border-b" : "border-b border-red-600"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <p dangerouslySetInnerHTML={{ __html: notification.content }} />
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
