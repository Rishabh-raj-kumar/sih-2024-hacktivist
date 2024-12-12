import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, X } from 'lucide-react';
import { ViolenceAlert } from './types';

interface AlertListProps {
  alerts: ViolenceAlert[];
  onUpdateStatus: (id: string, status: 'new' | 'reviewing' | 'resolved') => void;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, onUpdateStatus }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Violence Alerts</h3>
          <span className="text-sm text-gray-500">
            {alerts.filter(a => a.status === 'new').length} new alerts
          </span>
        </div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-4">
          {alerts.map((alert) => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onUpdateStatus={onUpdateStatus} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AlertItem: React.FC<{
  alert: ViolenceAlert;
  onUpdateStatus: (id: string, status: 'new' | 'reviewing' | 'resolved') => void;
}> = ({ alert, onUpdateStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border rounded-lg overflow-hidden shadow-sm ${
        alert.status === 'new' ? 'border-red-500' : 
        alert.status === 'reviewing' ? 'border-yellow-500' : 'border-green-500'
      }`}
    >
      <div className="p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32">
            <img
              src={alert.image}
              alt={`Violence Alert ${alert.id}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
              alert.status === 'new' ? 'bg-red-100 text-red-800' :
              alert.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {alert.status}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Detected
                </h4>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  alert.confidence >= 90 ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {alert.confidence}% Confidence
                </span>
              </div>
              <button
                onClick={() => onUpdateStatus(alert.id, 'resolved')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {alert.location}
              </p>
              <p className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onUpdateStatus(alert.id, 'reviewing')}
                className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                Review
              </button>
              <button
                onClick={() => onUpdateStatus(alert.id, 'resolved')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};