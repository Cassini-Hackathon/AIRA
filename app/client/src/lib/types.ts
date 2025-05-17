// Type definitions for the application

export interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

export interface EmergencyRequest {
  id: number;
  userId?: number;
  type: string;
  description?: string;
  victimCount?: string;
  location: Location;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
}

export interface DroneDelivery {
  id: number;
  userId?: number;
  kitType: 'basic' | 'advanced' | 'specialized';
  notes?: string;
  location: Location;
  status: 'pending' | 'preparing' | 'in-flight' | 'delivered';
  estimatedArrival?: Date;
  droneId?: string;
  createdAt: Date;
}

export interface Guide {
  id: number;
  title: string;
  category: string;
  content: GuideContent;
  isOfflineAvailable: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

export interface GuideContent {
  description: string;
  steps: GuideStep[];
  notes?: GuideNote[];
  daeSteps?: GuideStep[];
}

export interface GuideStep {
  title: string;
  description: string;
}

export interface GuideNote {
  title: string;
  description: string;
}

export interface WeatherAlert {
  title: string;
  description: string;
  validUntil: string;
  severity: string;
}

export interface WeatherForecast {
  day: string;
  icon: string;
  condition: string;
  maxTemp: number;
  minTemp: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  minTemp: number;
  maxTemp: number;
  feelsLike: number;
  wind: number;
  humidity: number;
  visibility: string;
  pressure: number;
  alerts?: WeatherAlert[];
  forecast: WeatherForecast[];
}

export interface AppContextState {
  isOffline: boolean;
  location: Location | null;
  weatherData: WeatherData | null;
}
