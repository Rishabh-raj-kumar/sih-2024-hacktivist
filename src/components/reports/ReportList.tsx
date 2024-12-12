import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, AlertCircle, Loader2 } from 'lucide-react';
import { Report } from '../../types/report';
import { ReportCard } from './ReportCard';
import { ReportDetails } from '../admin/ReportDetails';
import { useReports } from '../../hooks/useReports';

export const ReportList: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
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
                <ReportCard
                  key={report.id}
                  report={report}
                  onViewDetails={setSelectedReport}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};