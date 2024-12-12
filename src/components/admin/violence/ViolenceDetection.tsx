import React, { useState, useRef, useCallback } from 'react';
import { Shield, Settings } from 'lucide-react';
import Webcam from 'react-webcam';
import { ViolenceAlert, DetectionSettings } from './types';
import { CameraFeed } from './CameraFeed';
import { AlertList } from './AlertList';
import { SettingsDialog } from './SettingsDialog';

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

const initialSettings: DetectionSettings = {
  sensitivity: 80,
  enabledTypes: {
    physicalViolence: true,
    weaponDetection: true,
    crowdViolence: true,
    vandalism: true
  },
  alerts: {
    sound: true,
    push: true,
    autoDispatch: true
  }
};

export const ViolenceDetection: React.FC = () => {
  const [alerts, setAlerts] = useState<ViolenceAlert[]>(mockAlerts);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('CAM_001');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DetectionSettings>(initialSettings);
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
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <CameraFeed
            webcamRef={webcamRef}
            isProcessing={isProcessing}
            selectedCamera={selectedCamera}
            alertCount={alerts.length}
          />
          
          <AlertList
            alerts={alerts}
            onUpdateStatus={updateAlertStatus}
          />
        </div>
      </div>

      <SettingsDialog
        show={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSave={setSettings}
      />
    </div>
  );
};