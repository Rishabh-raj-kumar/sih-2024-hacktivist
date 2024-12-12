import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, Camera, Bell, Home, UserSearch, Package, Shield, Settings, LogOut, Menu, X, Search } from 'lucide-react';
import { LiveFeed } from './LiveFeed';
import { AlertSystem } from './AlertSystem';
import { ReportList } from './admin/ReportList';
import { Report } from './admin/types';
import { NotificationCenter } from './admin/NotificationCenter';
import { ViolenceDetection } from './admin/ViolenceDetection';

const mockReports: Report[] = [
  {
    id: 'MP24X7H9KL',
    type: 'person',
    name: 'Rishabh Raj',
    age: 25,
    gender: 'Male',
    contact: '9876543210',
    location: 'Ram Ghat',
    description: 'Wearing orange kurta and white dhoti. Has a small scar on right hand.',
    status: 'active',
    reportedAt: '2024-03-14T15:30:00',
    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c'
  },
  {
    id: 'MP24X7H9KM',
    type: 'person',
    name: 'Khushi Rani',
    age: 22,
    gender: 'Female',
    contact: '9876543211',
    location: 'Mahakal Temple',
    description: 'Wearing red and gold saree. Has a birthmark on left cheek.',
    status: 'active',
    reportedAt: '2024-03-14T16:45:00',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'
  }
];

export const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: UserSearch, label: 'Missing Reports', id: 'reports' },
    { icon: Package, label: 'Lost Items', id: 'items' },
    { icon: Shield, label: 'Violence Detection', id: 'violence' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'reports':
      case 'items':
        return <ReportList />;
      case 'violence':
        return <ViolenceDetection />;
      default:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-10 h-10 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">24</h3>
                    <p>Active Missing Cases</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center">
                  <Users className="w-10 h-10 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">18</h3>
                    <p>Found Today</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center">
                  <Camera className="w-10 h-10 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">156</h3>
                    <p>Active Cameras</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
                  <Camera className="w-6 h-6 mr-2" />
                  Live Surveillance Feed
                </h2>
                <LiveFeed />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center text-orange-800">
                  <Bell className="w-6 h-6 mr-2" />
                  Real-time Alerts
                </h2>
                <AlertSystem />
              </motion.div>
            </div>
          </div>        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50 px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg hidden lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">MP Police Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <NotificationCenter />
            <div className="hidden md:flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">Inspector Sharma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 lg:hidden pt-16"
          >
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setSelectedTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        selectedTab === item.id
                          ? 'bg-orange-100 text-orange-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 240 : 80,
          opacity: 1
        }}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r shadow-lg transition-all duration-300 z-30 hidden lg:block`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setSelectedTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedTab === item.id
                      ? 'bg-orange-100 text-orange-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-60' : 'lg:ml-20'
        } pt-20`}
      >
        <div className="p-8">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {}}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg"
        >
          <Search className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );};