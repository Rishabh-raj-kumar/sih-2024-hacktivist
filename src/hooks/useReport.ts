import { useState } from 'react';
import { getReport, ApiResponse } from '../services/api';

export const useReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ApiResponse | null>(null);

  const fetchReport = async (reportNumber: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReport(reportNumber);
      setReportData(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    reportData,
    fetchReport
  };
};