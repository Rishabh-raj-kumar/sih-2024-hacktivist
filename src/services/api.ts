import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ReportFormData {
  name: string;
  age: number;
  gender: string;
  contact: string;
  location: string;
  description: string;
  photo: string;
}

export interface ApiResponse {
  message: string;
  report_number: string;
  data: any;
  error?: string;
}

export interface PotentialMatch {
  id: number;
  report_id: number;
  confidence: number;
  location: string;
  camera_id: string;
  source_face: string;
  target_face: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export const reportMissingPerson = async (formData: ReportFormData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/persons/report`, formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to submit report');
  }
};

export const getReport = async (reportNumber: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/persons/report/${reportNumber}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch report');
  }
};

export const getAllReports = async (status: string = 'active'): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/persons/reports?status=${status}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch reports');
  }
};

export const updateReportStatus = async (reportNumber: string, status: string): Promise<ApiResponse> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/persons/report/${reportNumber}`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update report status');
  }
};

export const getPotentialMatches = async (reportId: number): Promise<PotentialMatch[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/face/matches/${reportId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch potential matches');
  }
};

export const updateMatchStatus = async (matchId: number, status: 'pending' | 'confirmed' | 'rejected'): Promise<PotentialMatch> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/face/matches/${matchId}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update match status');
  }
};

export const verifyStreamImage = async (streamImage: string, targetImage: string, reportId: number, location: string, cameraId: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/face/stream/check`, {
      stream_image: streamImage,
      target_image: targetImage,
      report_id: reportId,
      location,
      camera_id: cameraId
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to verify stream image');
  }
};