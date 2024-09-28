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
  userImage: string | null;
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
      <PopoverContent className="w-[90vw] sm:w-[450px] md:w-[550px] lg:w-[650px] max-w-[90vw] mx-5 my-3">
        <div className="max-h-[70vh] overflow-y-auto">
          <h3 className="font-semibold text-xl sm:text-2xl mb-4">Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-2 p-2 cursor-pointer border-b mx-1 sm:mx-3 ${
                  notification.read ? "" : "border-red-600"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2">
                  <img
                    src={notification.userImage || "/avatar-placeholder.png"}
                    alt="User"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
                  />
                  <div>
                    <p
                      className="text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: notification.content }}
                    />
                    <small className="text-xs sm:text-sm">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
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
