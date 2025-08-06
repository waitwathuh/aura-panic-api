export type PanicStatus = 'processing' | 'active' | 'resolved';

export interface Panic {
  id: string;
  timestamp: number;
  location: {
    lat: number;
    lng: number;
  };
  metadata?: Record<string, any>;
  status: PanicStatus;
}
