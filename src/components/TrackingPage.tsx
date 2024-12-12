import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Camera, MapPin, Clock, User, AlertCircle, Home, CheckCircle2, X, Settings, Loader2 } from 'lucide-react';
import { useReport } from '../hooks/useReport';

interface TrackingPageProps {
  onBack: () => void;
}

interface MatchedFace {
  id: string;
  image: string;
  location: string;
  timestamp: string;
  confidence: number;
  cameraId: string;
}

const dummyMatches: MatchedFace[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c',
    location: 'Ram Ghat',
    timestamp: '2024-03-15 14:30',
    confidence: 95,
    cameraId: 'CAM_001'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    location: 'Mahakal Temple',
    timestamp: '2024-03-15 15:45',
    confidence: 88,
    cameraId: 'CAM_003'
  }
];

export const TrackingPage: React.FC<TrackingPageProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'missing-person' | 'phone-number'>('missing-person');
  const [reportNumber, setReportNumber] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchedFace | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [timeWindow, setTimeWindow] = useState(24);
  const [showSettings, setShowSettings] = useState(false);
  const { isLoading, error, reportData, fetchReport } = useReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchReport(reportNumber);
      setShowResults(true);
    } catch (err) {
      // Error is handled by useReport hook
    }
  };

  const handleMatchConfirmation = (match: MatchedFace) => {
    setSelectedMatch(match);
    setShowConfirmDialog(true);
  };

  const filteredMatches = dummyMatches.filter(match => match.confidence >= confidenceThreshold);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <nav className="fixed top-0 left-0 right-0 bg-white border-b shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-xl font-bold text-gray-800">Track Missing Person</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <div className="text-center mb-8">
                    <Search className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Track</h2>
                    <p className="text-gray-600 mt-2">Choose the option to track</p>
                  </div>

                  <div className="flex gap-5 items-center justify-center">
                    <button
                      onClick={() => setTab('missing-person')}
                      className={`py-2 px-4 rounded-lg ${tab === 'missing-person' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Missing Person
                    </button>
                    <button
                      onClick={() => setTab('phone-number')}
                      className={`py-2 px-4 rounded-lg ${tab === 'phone-number' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Phone Number
                    </button>
                  </div>

                  {tab === 'missing-person' && (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Report Number
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter report number (e.g., MP24X7H9KL)"
                          value={reportNumber}
                          onChange={(e) => setReportNumber(e.target.value.toUpperCase())}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Track Status
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}

                  {tab === 'phone-number' && (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Enter phone number (e.g., +91 1234567890)"
                          value={reportNumber}
                          onChange={(e) => setReportNumber(e.target.value.toUpperCase())}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Track Status
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {reportData && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-6 bg-orange-50 border-b border-orange-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <h2 className="text-xl font-bold text-gray-800">
                        Case Details: {reportData.data.report_number}
                      </h2>
                      <span className="text-sm text-orange-600">
                        Last updated: {new Date(reportData.data.updated_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Person Information</h3>
                        <div className="flex flex-col">
                          <div className="flex justify-center mb-6">
                            <motion.img
                              src={reportData.data.photo}
                              alt={reportData.data.name}
                              className="w-40 h-40 object-cover rounded-xl shadow-lg"
                              whileHover={{ scale: 1.05 }}
                            />
                          </div>
                          <div className="space-y-3">
                            <p className="flex items-center text-gray-700">
                              <User className="w-4 h-4 mr-2" />
                              <span className="font-medium">{reportData.data.name}</span>
                            </p>
                            <p className="text-gray-600">
                              Age: {reportData.data.age} • {reportData.data.gender}
                            </p>
                            <p className="text-gray-600">Last Seen: {reportData.data.location}</p>
                            <p className="text-gray-600">{reportData.data.description}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Potential Matches</h3>
                          <span className="text-sm text-gray-600">
                            Showing matches above {confidenceThreshold}% confidence
                          </span>
                        </div>
                        <div className="h-[600px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                          {filteredMatches.map((match) => (
                            <motion.div
                              key={match.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            >
                              <div className="p-4">
                                <div className="flex gap-4">
                                  <motion.img
                                    src={match.image}
                                    alt="Match"
                                    className="w-24 h-24 object-cover rounded-lg"
                                    whileHover={{ scale: 1.05 }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                          match.confidence >= 90 ? 'bg-green-100 text-green-800' :
                                          match.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {match.confidence}% Match
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                      <p className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {match.location}
                                      </p>
                                      <p className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {match.timestamp}
                                      </p>
                                      <p className="flex items-center text-gray-600">
                                        <Camera className="w-4 h-4 mr-2" />
                                        Camera ID: {match.cameraId}
                                      </p>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleMatchConfirmation(match)}
                                      className="mt-3 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                    >
                                      Confirm Match
                                    </motion.button>
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
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showConfirmDialog && selectedMatch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Match</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure this is the person you're looking for? This action will mark the case as found.
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowConfirmDialog(false)}
                      className="px-6 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Confirm Found
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};