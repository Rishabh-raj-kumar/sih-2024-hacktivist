import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface MacAddressAlertProps {
  show: boolean;
  onClose: () => void;
}

export const MacAddressAlert: React.FC<MacAddressAlertProps> = ({ show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-4 left-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 animate-pulse" />
              <div>
                <h3 className="font-bold">Target MAC Address Detected!</h3>
                <p className="text-sm mt-1">
                  Device matching target profile detected in vicinity.
                  Location: Ram Ghat Gate 2
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};