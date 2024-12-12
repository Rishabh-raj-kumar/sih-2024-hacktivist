export interface ViolenceAlert {
  id: string;
  type: 'fight' | 'weapon' | 'crowd' | 'vandalism';
  timestamp: string;
  location: string;
  confidence: number;
  image: string;
  status: 'new' | 'reviewing' | 'resolved';
}

export interface DetectionSettings {
  sensitivity: number;
  enabledTypes: {
    physicalViolence: boolean;
    weaponDetection: boolean;
    crowdViolence: boolean;
    vandalism: boolean;
  };
  alerts: {
    sound: boolean;
    push: boolean;
    autoDispatch: boolean;
  };
}