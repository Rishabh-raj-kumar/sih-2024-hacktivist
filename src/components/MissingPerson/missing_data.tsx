import { createContext, useState } from 'react';

export interface MissingPersonData {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  location: string;
  description: string;
  status: string;
  reportedAt: string;
  image: string;
}

export const MissingPersonContext = createContext<MissingPersonData[]>([]);

export const MissingPersonProvider: React.FC = ({ children }) => {
  const [missingPersons, setMissingPersons] = useState<MissingPersonData[]>([]);

  return (
    <MissingPersonContext.Provider value={missingPersons}>
      {children}
    </MissingPersonContext.Provider>
  );
};
