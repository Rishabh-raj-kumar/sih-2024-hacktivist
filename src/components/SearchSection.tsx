import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="missing-persons">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Missing Persons & Items
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced AI system processes real-time data from over 160 cameras to help locate missing individuals
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-12"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search Type
                </label>
                <select className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500">
                  <option>Missing Person</option>
                  <option>Missing Child</option>
                  <option>Lost Item</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-500">
                  <option>All Locations</option>
                  <option>Ram Ghat</option>
                  <option>Mahakal Temple</option>
                  <option>Kalbhairav Temple</option>
                </select>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors mt-6"
              >
                <Search className="mr-2" />
                Search Now
              </motion.button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6BjM-eAkkKoE9w9JGJEORw1vKX7FjN654bKp2zN8xJUF4YHkDvW4otNCUsrcVnNRHTlw&usqp=CAU`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://img.freepik.com/premium-photo/ethnic-indian-woman-smiling-happily-created-with-generative-ai_762026-40739.jpg`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1 + 1}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://img.freepik.com/premium-photo/portrait-indian-girl-against-background-spikelets-wheat-neural-network-ai-generated_76080-19540.jpg`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1 + 2}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://static.vecteezy.com/system/resources/previews/040/345/235/non_2x/ai-generated-indian-professional-worker-in-workshop-free-photo.jpg`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1 + 3}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://img.freepik.com/premium-photo/image-25-year-old-indian-man-that-is-smiling-camera_878783-7217.jpg`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1 + 4}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
              <motion.div
                key={1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPpG-gm40lWo3f9qUgFhcTaylhfrRhYx7HyaF0KBiby_0kFT4RnCFWV-eOJXmGTqXjgp8&usqp=CAU`}
                    alt="Missing Person"
                    className="w-24 h-24 object-cover rounded-xl shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">Case #{1 + 5}</h3>
                        <p className="text-gray-600 text-sm">ID: MP24X7H9K{1}</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-gray-600 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2" />
                        Age: {20 + 1} • Male
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Last seen: Ram Ghat
                      </p>
                      <p className="text-gray-600 flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2" />
                        2 hours ago
                      </p>
                    </div>

                    <Link to={"/person"}
                      className="mt-4 w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm font-medium"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Load More Cases
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};