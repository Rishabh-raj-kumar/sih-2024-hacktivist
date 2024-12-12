import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, Camera, Package, AlertCircle } from 'lucide-react';

interface LostItem {
  id: string;
  name: string;
  description: string;
  location: string;
  reportedAt: string;
  image: string;
  status: 'active' | 'found';
  matches: Array<{
    id: string;
    confidence: number;
    location: string;
    timestamp: string;
    image: string;
  }>;
}

const mockLostItems: LostItem[] = [
  {
    id: 'ITEM001',
    name: 'Gold Necklace',
    description: 'Traditional Indian gold necklace with ruby pendant',
    location: 'Mahakal Temple',
    reportedAt: '2024-03-15T10:30:00',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed',
    status: 'active',
    matches: [
      {
        id: 'M1',
        confidence: 95,
        location: 'Ram Ghat CCTV 3',
        timestamp: '2024-03-15T11:30:00',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed'
      },
      {
        id: 'M2',
        confidence: 88,
        location: 'Market Area CCTV 2',
        timestamp: '2024-03-15T12:15:00',
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed'
      }
    ]
  },
  {
    id: 'ITEM002',
    name: 'Silver Bracelet',
    description: 'Handcrafted silver bracelet with traditional motifs',
    location: 'Ram Ghat',
    reportedAt: '2024-03-15T09:45:00',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
    status: 'active',
    matches: [
      {
        id: 'M3',
        confidence: 92,
        location: 'Temple Gate CCTV 1',
        timestamp: '2024-03-15T10:30:00',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0'
      }
    ]
  }
];

export const LostItems: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lost Items Detection</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-gray-800 font-medium">Upload Item Image</h3>
                <p className="text-sm text-gray-500">
                  Drop an image or click to browse
                </p>
              </div>
            </div>

            {uploadedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-xl overflow-hidden"
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded item"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Start Scanning</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-orange-50 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-800">Detection Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Radius
                </label>
                <select className="w-full p-2 border rounded-lg">
                  <option>100m</option>
                  <option>500m</option>
                  <option>1km</option>
                  <option>5km</option>
                </select>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-800 mb-2">Active Detectors</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Shape Recognition</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Color Matching</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">Pattern Detection</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockLostItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Location: {item.location}
                </p>
                <p className="text-sm text-gray-500">
                  Reported: {new Date(item.reportedAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Potential Matches ({item.matches.length})</h4>
                <div className="space-y-2">
                  {item.matches.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={match.image}
                              alt="Match"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{match.location}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(match.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          match.confidence >= 90 ? 'bg-green-100 text-green-800' :
                          match.confidence >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {match.confidence}% Match
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(item)}
                className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};