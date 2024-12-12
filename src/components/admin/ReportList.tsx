import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, AlertCircle, Loader2 } from 'lucide-react';
import { ReportDetails } from './ReportDetails';
import { useReports } from '../../hooks/useReports';

export const ReportList = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const { reports, isLoading, error, refreshReports } = useReports(filterStatus);

  const filteredReports = reports.filter(report => {
    const typeMatch = filterType === 'all' || report.type === filterType;
    const searchMatch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.report_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {selectedReport ? (
        <ReportDetails 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)}
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Missing Reports</h2>
                <p className="text-gray-600">Total {filteredReports.length} reports found</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none lg:w-64">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                
                <select 
                  className="px-4 py-2 border rounded-lg bg-white flex-1 lg:flex-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="active">Active Cases</option>
                  <option value="found">Found Cases</option>
                  <option value="closed">Closed Cases</option>
                </select>
              </div>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl"
            >
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">No Reports Found</h3>
                  <p className="text-orange-700">Try adjusting your search or filter criteria</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-32 h-32">
                        <img
                          src={report.photo}
                          alt={report.name}
                          className="w-full h-full object-cover rounded-lg shadow-md"
                          loading="lazy"
                        />
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                          report.status === 'active' ? 'bg-red-100 text-red-800' :
                          report.status === 'found' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{report.name}</h3>
                            <p className="text-gray-600">ID: {report.report_number}</p>
                          </div>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <p className="text-gray-600 flex items-center">
                            Age: {report.age} • {report.gender}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            {report.contact}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            {report.location}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => setSelectedReport(report)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};