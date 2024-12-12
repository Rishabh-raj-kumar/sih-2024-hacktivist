import { useState } from 'react';
import { Report } from '../types/report';
import { fetchReportByNumber, updateReportStatus } from '../services/reportService';

export const useReportDetails = (initialReport?: Report) => {
  const [report, setReport] = useState<Report | null>(initialReport || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (reportNumber: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchReportByNumber(reportNumber);
      setReport(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (reportNumber: string, newStatus: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedReport = await updateReportStatus(reportNumber, newStatus);
      setReport(updatedReport);
      return updatedReport;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    report,
    isLoading,
    error,
    fetchReport,
    updateStatus
  };
};