import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Clock, User, Camera, ChevronLeft, CheckCircle2, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { Report } from '../../types/report';
import { updateReportStatus } from '../../services/api';
import { LiveStreamVerification } from './LiveStreamVerification';

interface ReportDetailsProps {
  report: Report;
  onClose: () => void;
}

interface StreamMatch {
  id: string;
  image: string;
  confidence: number;
  location: string;
  timestamp: string;
  cameraId: string;
  sourceFace?: string;
  targetFace?: string;
}

const CONFIDENCE_THRESHOLD = 52;
const MAX_VISIBLE_MATCHES = 5;

export const ReportDetails: React.FC<ReportDetailsProps> = ({ report: initialReport, onClose }) => {
  const [selectedMatch, setSelectedMatch] = useState<StreamMatch | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [report, setReport] = useState(initialReport);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [streamMatches, setStreamMatches] = useState<StreamMatch[]>([]);

  const handleNewMatch = useCallback((match: StreamMatch) => {
    setStreamMatches(prev => {
      if (match.confidence >= CONFIDENCE_THRESHOLD && !prev.find(m => m.id === match.id)) {
        return [...prev, match].sort((a, b) => b.confidence - a.confidence);
      }
      return prev;
    });
  }, []);

  const handleConfirmMatch = (match: StreamMatch) => {
    setSelectedMatch(match);
    setShowConfirmDialog(true);
  };

  const handleConfirmFound = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await updateReportStatus(report.report_number, 'found');
      setShowConfirmDialog(false);
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const filteredMatches = streamMatches.filter(match => match.confidence >= CONFIDENCE_THRESHOLD);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg rounded-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={onClose}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Reports
          </button>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              report.status === 'active' ? 'bg-red-100 text-red-800' :
              report.status === 'found' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
            <span className="text-gray-500">Report Number: {report.report_number}</span>
          </div>
        </div>
      </nav>

      {/* Person Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 bg-orange-50 border-b border-orange-100">
          <h2 className="text-xl font-bold text-gray-800">Person Details</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg mb-4">
                <img
                  src={report.photo}
                  alt={report.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 text-center">{report.name}</h3>
            </div>
            
            <div className="md:w-3/4 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Age & Gender</p>
                    <p className="font-medium text-gray-800">{report.age} • {report.gender}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-gray-800">{report.contact}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Last Seen</p>
                    <p className="font-medium text-gray-800">{report.location}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Reported At</p>
                    <p className="font-medium text-gray-800">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                <p className="text-gray-700">{report.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream and Matches Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Live Stream Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-orange-50 border-b border-orange-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Live Verification</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLiveStream(!showLiveStream)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                {showLiveStream ? 'Hide Camera' : 'Start Camera'}
              </motion.button>
            </div>
          </div>
          <div className="p-6">
            {showLiveStream ? (
              <LiveStreamVerification
                targetImage={report.photo}
                onMatch={handleNewMatch}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click the button above to start live verification</p>
              </div>
            )}
          </div>
        </div>

        {/* Potential Matches Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-orange-50 border-b border-orange-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Potential Matches</h2>
              <span className="text-sm font-medium text-gray-600">
                {filteredMatches.length} matches found
              </span>
            </div>
          </div>
          <div className="p-6">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No matches found with confidence above {CONFIDENCE_THRESHOLD}%</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {filteredMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index < MAX_VISIBLE_MATCHES ? index * 0.1 : 0 }}
                    className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className=
                          "text-sm font-medium text-gray-600 mb-2">Original Image</p>
                          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                            <img
                              src={match.image}
                              alt="Original Stream"
                              className="w-full h-full object-cover transform scale-x-[-1]"
                              loading={index < MAX_VISIBLE_MATCHES ? "eager" : "lazy"}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Detected Face</p>
                          <div className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                            <img
                              src={match.image}
                              alt="Detected Face"
                              className="w-full h-full object-cover"
                              loading={index < MAX_VISIBLE_MATCHES ? "eager" : "lazy"}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.confidence >= 85 ? 'bg-green-100 text-green-800' :
                            match.confidence >= 75 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {match.confidence}% Match
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-700">
                          <Camera className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="font-medium">Camera {match.cameraId}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">
                            {new Date(match.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleConfirmMatch(match)}
                        className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Match
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full"
            >
              <div className="text-center">
                <div className="mb-4">
                  <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Match</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure this is a match? This action will mark the case as found and notify all relevant parties.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmDialog(false)}
                    className="px-6 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={isUpdating}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmFound}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Found
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};