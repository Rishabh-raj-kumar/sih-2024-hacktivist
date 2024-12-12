import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, MapPin, Clock } from 'lucide-react';

export const AlertSystem = () => {
  const alerts = [
    {
      type: 'match_found',
      message: 'Potential match found for missing person case #1234',
      location: 'Ram Ghat Camera #3',
      time: '2 minutes ago',
      priority: 'high'
    },
    {
      type: 'new_case',
      message: 'New missing person report submitted',
      location: 'Mahakal Temple Station',
      time: '15 minutes ago',
      priority: 'medium'
    },
    {
      type: 'system',
      message: 'Camera #12 offline - Maintenance required',
      location: 'Kalbhairav Temple',
      time: '1 hour ago',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border ${
            alert.priority === 'high'
              ? 'bg-red-50 border-red-200'
              : alert.priority === 'medium'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${
              alert.priority === 'high'
                ? 'bg-red-200'
                : alert.priority === 'medium'
                ? 'bg-yellow-200'
                : 'bg-blue-200'
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold mb-1">{alert.message}</p>
              <div className="flex items-center text-sm text-gray-600 gap-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {alert.location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {alert.time}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <button className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-medium">
        View All Alerts →
      </button>
    </div>
  );
};