export interface Report {
  id: string;
  type: 'person' | 'item';
  name: string;
  age?: number;
  gender?: string;
  contact: string;
  location: string;
  description: string;
  status: 'active' | 'found' | 'closed';
  reportedAt: string;
  image: string;
}