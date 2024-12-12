import axios from 'axios';
import { Report } from '../types/report';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchMissingReports = async (status: string = 'active'): Promise<Report[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/persons/reports?status=${status}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error('Failed to fetch missing person reports');
  }
};

export const fetchReportByNumber = async (reportNumber: string): Promise<Report> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/persons/report/${reportNumber}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw new Error('Failed to fetch report details');
  }
};

export const updateReportStatus = async (reportNumber: string, status: string): Promise<Report> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/persons/report/${reportNumber}`, { status });
    return response.data.data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw new Error('Failed to update report status');
  }
};