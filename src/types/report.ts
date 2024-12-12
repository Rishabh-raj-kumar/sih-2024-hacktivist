export interface Report {
  id: number;
  report_number: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  location: string;
  description: string;
  photo: string;
  status: 'active' | 'found' | 'closed';
  created_at: string;
  updated_at: string;
}