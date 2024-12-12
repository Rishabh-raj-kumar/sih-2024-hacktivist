import React from 'react';

interface DetectionStatsProps {
  alertCount: number;
}

export const DetectionStats: React.FC<DetectionStatsProps> = ({ alertCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">Detection Stats</h3>
        <div className="space-y-2 text-sm">
          <p>Processing Rate: 30 fps</p>
          <p>Detection Accuracy: 95%</p>
          <p>Alerts Today: {alertCount}</p>
        </div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-semibold text-orange-800 mb-2">Active Cameras</h3>
        <div className="space-y-2 text-sm">
          <p>Total Cameras: 160</p>
          <p>Online: 156</p>
          <p>Processing: 152</p>
        </div>
      </div>
    </div>
  );
};