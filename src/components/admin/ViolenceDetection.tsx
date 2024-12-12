import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertTriangle, Clock, MapPin, Shield, Settings, X, Loader2 } from 'lucide-react';
import Webcam from 'react-webcam';

interface ViolenceAlert {
  id: string;
  type: 'fight' | 'weapon' | 'crowd' | 'vandalism';
  timestamp: string;
  location: string;
  confidence: number;
  image: string;
  status: 'new' | 'reviewing' | 'resolved';
}

const mockAlerts: ViolenceAlert[] = [
  {
    id: '1',
    type: 'fight',
    timestamp: new Date().toISOString(),
    location: 'Ram Ghat Gate 3',
    confidence: 95,
    image: 'https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9',
    status: 'new'
  },
  {
    id: '2',
    type: 'crowd',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    location: 'Mahakal Temple Entrance',
    confidence: 88,
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
    status: 'reviewing'
  }
];

export const ViolenceDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<ViolenceAlert[]>(mockAlerts);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('CAM_001');
  const [showSettings, setShowSettings] = useState(false);
  const [sensitivity, setSensitivity] = useState(80);
  const webcamRef = useRef<Webcam>(null);

  const handleNewAlert = useCallback((alert: ViolenceAlert) => {
    setAlerts(prev => [alert, ...prev]);
  }, []);

  const updateAlertStatus = (id: string, status: 'new' | 'reviewing' | 'resolved') => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-orange-600" />
            Violence Detection System
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <div className="space-y-4">
            <div className="relative bg-black rounded-xl overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                className="w-full h-[400px] object-cover"
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
              />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white flex items-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Processing Feed...
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-5 h-5" />
                    <span>Camera {selectedCamera}</span>
                  </div>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Live
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Detection Stats</h3>
                <div className="space-y-2 text-sm">
                  <p>Processing Rate: 30 fps</p>
                  <p>Detection Accuracy: 95%</p>
                  <p>Alerts Today: {alerts.length}</p>
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
          </div>

          {/* Alerts Section */}
          <div>
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
                    <motion.div
                      key={alert.id}
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
                                onClick={() => updateAlertStatus(alert.id, 'resolved')}
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
                                onClick={() => updateAlertStatus(alert.id, 'reviewing')}
                                className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-colors"
                              >
                                Review
                              </button>
                              <button
                                onClick={() => updateAlertStatus(alert.id, 'resolved')}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                              >
                                Mark Resolved
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detection Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detection Sensitivity ({sensitivity}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensitivity}
                    onChange={(e) => setSensitivity(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detection Types
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Physical Violence</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Weapon Detection</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Crowd Violence</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Vandalism</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Sound Alerts</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Push Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm">Auto-dispatch Security</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};