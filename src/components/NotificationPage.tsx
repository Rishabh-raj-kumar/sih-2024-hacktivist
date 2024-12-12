import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationPage = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Missing Person Report',
      message: 'Rishabh Raj (25) reported missing from Ram Ghat area',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: '2',
      title: 'Potential Match Found',
      message: 'AI system detected 89% match for Case #MP24X7H9KL',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: '3',
      title: 'Case Status Updated',
      message: 'Missing person found safe at Mahakal Temple',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: '4',
      title: 'New Missing Person Report',
      message: 'Rishabh Raj (25) reported missing from Ram Ghat area',
      timestamp: '2 minutes ago',
      read: true,
    },
    {
      id: '5',
      title: 'Potential Match Found',
      message: 'AI system detected 89% match for Case #MP24X7H9KL',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: '6',
      title: 'Case Status Updated',
      message: 'Missing person found safe at Mahakal Temple',
      timestamp: '1 hour ago',
      read: true,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://sihapp-d06f1-default-rtdb.firebaseio.com/crowd_alert.json");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        console.log(userData)
        setData(userData);
      } catch (error) {
        console.error('Failed to read data!', error);
      }
    };
    fetchData();
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Notifications</h1>
        <button
          className="flex items-center px-2 py-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={markAllAsRead}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Mark All as Read
        </button>
      </header>
      <ul className="divide-y divide-gray-200">
        {notifications.map(notification => (
          <li
            key={notification.id}
            className="flex items-start p-4 hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 mr-2 text-gray-600" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold">{notification.title}</h2>
              <p className="text-xs text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-600">{notification.timestamp}</p>
            </div>
            {notification.read && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </li>
        ))}
      </ul>
      <ul>
        <li>Count : {data.count}</li>
        <li>Ip Address : {data.ip}</li>
        <li>Message : {data.messsage}</li>
      </ul>
    </motion.div>
  );
};

export default NotificationPage;

