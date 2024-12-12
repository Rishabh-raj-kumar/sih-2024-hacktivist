import React from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader2 } from 'lucide-react';
import { DetectionStats } from './DetectionStats';

interface CameraFeedProps {
  webcamRef: React.RefObject<Webcam>;
  isProcessing: boolean;
  selectedCamera: string;
  alertCount: number;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  webcamRef,
  isProcessing,
  selectedCamera,
  alertCount,
}) => {
  return (
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

      <DetectionStats alertCount={alertCount} />
    </div>
  );
};