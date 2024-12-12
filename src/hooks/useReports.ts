import { useState, useEffect } from 'react';
import { Report } from '../types/report';
import { getAllReports } from '../services/api';

export const useReports = (status: string = 'active') => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllReports(status);
      setReports(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [status]);

  return {
    reports,
    isLoading,
    error,
    refreshReports: loadReports
  };
};