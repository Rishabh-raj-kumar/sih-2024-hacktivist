import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DetectionSettings } from './types';

interface SettingsDialogProps {
  show: boolean;
  settings: DetectionSettings;
  onClose: () => void;
  onSave: (settings: DetectionSettings) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  show,
  settings,
  onClose,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!show) return null;

  return (
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
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detection Sensitivity ({localSettings.sensitivity}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localSettings.sensitivity}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                sensitivity: parseInt(e.target.value)
              })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detection Types
            </label>
            <div className="space-y-2">
              {Object.entries(localSettings.enabledTypes).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      enabledTypes: {
                        ...localSettings.enabledTypes,
                        [key]: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Settings
            </label>
            <div className="space-y-2">
              {Object.entries(localSettings.alerts).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      alerts: {
                        ...localSettings.alerts,
                        [key]: e.target.checked
                      }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};