import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, ArrowLeft, CheckCircle2, Camera, AlertCircle, Loader2 } from 'lucide-react';
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { fileToBase64, validateImage } from '../utils/imageUtils';
import { reportMissingPerson, ReportFormData } from '../services/api';

interface ReportFormProps {
  onBack?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState<ReportFormData>({
    name: '',
    age: 0,
    gender: 'male',
    contact: '',
    location: '',
    description: '',
    photo: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportNumber, setReportNumber] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);

  React.useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const detectFace = async (imageUrl: string) => {
    if (!model) return false;
    
    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const tensor = tf.browser.fromPixels(img);
      const predictions = await model.estimateFaces(tensor, false);
      tensor.dispose();

      return predictions.length > 0;
    } catch (error) {
      console.error('Face detection error:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        validateImage(file);
        const base64Image = await fileToBase64(file);
        setFormData({ ...formData, photo: base64Image });
        setPreviewImage(base64Image);
        const hasFace = await detectFace(base64Image);
        setIsFaceDetected(hasFace);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setPreviewImage(null);
        setIsFaceDetected(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFaceDetected) {
      setError('Please upload a clear photo with a visible face');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await reportMissingPerson(formData);
      setReportNumber(response.report_number);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-16 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Report Submitted Successfully</h2>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-lg font-semibold text-green-800">Your Report Number:</p>
                <p className="text-4xl font-bold text-green-600 my-3">{reportNumber}</p>
                <p className="text-sm text-green-700">Keep this number for tracking the status</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-orange-800 mb-4">Next Steps</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
                    <span className="text-orange-700">Our team has been notified and will begin the search immediately</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
                    <span className="text-orange-700">You will receive SMS updates on {formData.contact}</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2 mt-0.5" />
                    <span className="text-orange-700">You can track the status using your report number</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onBack}
                className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-16 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h2 className="text-xl font-bold text-gray-800">Report Missing Person</h2>
              <div className="w-20"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div className="flex justify-center">
                <motion.div 
                  className={`relative w-32 h-32 rounded-2xl overflow-hidden ${
                    previewImage ? '' : 'bg-gray-50 border-2 border-dashed border-gray-300'
                  } flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {previewImage ? (
                    <>
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                      {!isProcessing && (
                        <div className={`absolute top-2 right-2 p-1 rounded-full ${
                          isFaceDetected ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                </motion.div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}

              {previewImage && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center ${
                    isFaceDetected ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isFaceDetected ? (
                    <p className="flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Face detected successfully
                    </p>
                  ) : (
                    <p className="flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      No face detected. Please upload a clear photo.
                    </p>
                  )}
                </motion.div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    required
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location *</label>
                  <select
                    required
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option value="">Select location</option>
                    <option value="ram_ghat">Ram Ghat</option>
                    <option value="mahakal_temple">Mahakal Temple</option>
                    <option value="kalbhairav_temple">Kalbhairav Temple</option>
                    <option value="main_market">Main Market</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow h-24"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about the person..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isFaceDetected || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};