import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, User, Phone, Eye } from 'lucide-react';
import { Report } from '../../types/report';

interface ReportCardProps {
  report: Report;
  onViewDetails: (report: Report) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                Age: {report.age} • {report.gender}
              </p>
              <p className="text-gray-600 flex items-center">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                {report.contact}
              </p>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                {report.location}
              </p>
              <p className="text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => onViewDetails(report)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};