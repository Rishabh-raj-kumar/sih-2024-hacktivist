import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserPlus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'new_report' | 'alert' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'new_report',
      title: 'New Missing Person Report',
      message: 'Rishabh Raj (25) reported missing from Ram Ghat area',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      type: 'alert',
      title: 'Potential Match Found',
      message: 'AI system detected 89% match for Case #MP24X7H9KL',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: '3',
      type: 'update',
      title: 'Case Status Updated',
      message: 'Missing person found safe at Mahakal Temple',
      timestamp: '1 hour ago',
      read: true,
    },
  ]);

  const [isOpen, setIsOpen] = React.useState(false);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_report':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'update':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                <span className="text-sm text-gray-500">{unreadCount} new</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {notification.timestamp}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <Link to={"/notification"} onClick={() => setIsOpen(!isOpen)} className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All Notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};