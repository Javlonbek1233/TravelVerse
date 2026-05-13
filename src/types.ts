export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  itinerary: ItineraryDay[];
  status: 'planning' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  type: 'sightseeing' | 'food' | 'transport' | 'accommodation' | 'other';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  preferences: {
    budgetType: 'budget' | 'standard' | 'luxury';
    travelStyle: string[];
  };
}

export interface JournalEntry {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  content: string;
  images: string[];
  date: string;
  location?: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  forecast: any[];
}
