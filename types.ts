export type Platform = 'ios' | 'android';

export interface CameraDevice {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  thumbnailUrl: string;
  lastActive: string;
  batteryLevel?: number; // Percentage
  signalStrength?: number; // 1-4
}

export interface RecordingEvent {
  id: string;
  timestamp: string;
  duration: string;
  type: 'motion' | 'sound' | 'person' | 'pet';
  thumbnailUrl: string;
}

export type ViewState = 'dashboard' | 'live' | 'playback' | 'setup' | 'settings';

export interface AppState {
  platform: Platform;
  currentView: ViewState;
  selectedDeviceId: string | null;
  devices: CameraDevice[];
}