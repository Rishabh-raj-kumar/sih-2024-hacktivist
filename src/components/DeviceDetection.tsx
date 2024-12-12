import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi } from 'lucide-react';

interface DeviceDetectionProps {
  devices: string[];
}

export const DeviceDetection: React.FC<DeviceDetectionProps> = ({ devices }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-orange-600" />
          Device Detection
        </h3>
        <span className="text-sm text-gray-500">{devices.length} devices nearby</span>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
        {devices.map((mac, index) => (
          <motion.div
            key={`${mac}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-gray-600" />
              <span className="font-mono text-sm">{mac}</span>
            </div>
            <span className="text-xs text-gray-500">Just detected</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};