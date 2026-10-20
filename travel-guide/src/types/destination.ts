export interface TicketPrice {
  adult: number;
  student: number;
  elderly: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Itinerary {
  oneDay: string[];
  twoDays: string[];
  threeDays?: string[];
}

export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  province: string;
  category: 'natural' | 'cultural' | 'urban' | 'beach';
  rating: number;
  bestSeason: string[];
  suggestedDuration: string;
  ticketPrice: TicketPrice;
  openingHours: string;
  coverImage: string;
  gallery: string[];
  description: string;
  transportation: string;
  accommodations: {
    name: string;
    level: 'luxury' | 'mid' | 'budget';
  }[];
  foods: {
    name: string;
    description: string;
  }[];
  itinerary: Itinerary;
  tips: string[];
  coordinates: Coordinates;
}
