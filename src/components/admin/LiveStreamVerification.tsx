import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface LiveStreamVerificationProps {
  targetImage: string;
  onMatch: (match: {
    id: string;
    image: string;
    confidence: number;
    location: string;
    timestamp: string;
    cameraId: string;
  }) => void;
}

export const LiveStreamVerification: React.FC<LiveStreamVerificationProps> = ({ targetImage, onMatch }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    verified: boolean;
    confidence: number;
  } | null>(null);

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current || isProcessing) return;

    try {
      const streamImage = webcamRef.current.getScreenshot();
      if (!streamImage) return;

      setIsProcessing(true);
      const response = await axios.post('http://localhost:5000/api/face/stream/check', {
        stream_image: streamImage,
        target_image: targetImage
      });

      const { verified, confidence } = response.data.data;
      setMatchResult({ verified, confidence });

      if (verified && confidence > 52) {
        const matchData = {
          id: `match-${Date.now()}`,
          image: streamImage,
          confidence,
          location: 'Live Stream',
          timestamp: new Date().toISOString(),
          cameraId: 'LIVE-CAM'
        };
        onMatch(matchData);
      }
    } catch (error) {
      console.error('Face verification error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [targetImage, onMatch, isProcessing]);

  useEffect(() => {
    const interval = setInterval(captureAndVerify, 3000);
    return () => clearInterval(interval);
  }, [captureAndVerify]);

  return (
    <div className="relative">
      <div className="rounded-xl overflow-hidden shadow-lg">
      <img src='http://127.0.0.1:5000/video_feed'/>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {matchResult && (
        <div className={`mt-4 p-4 rounded-lg ${
          matchResult.verified ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center">
            {matchResult.verified ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            )}
            <div>
              <p className={`font-medium ${
                matchResult.verified ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {matchResult.verified ? 'Face Match Found!' : 'No Match Found'}
              </p>
              <p className="text-sm text-gray-600">
                Confidence: {matchResult.confidence.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};