
export enum FuelType {
  Petrol = 'Essence',
  Diesel = 'Diesel',
  Electric = 'Électrique',
  Hybrid = 'Hybride'
}

export type Category = 'Tout' | 'SUV' | 'Berlines' | 'Sport' | 'Électrique' | 'Hybride';

export type BadgeType = 'Nouveauté' | 'Certifié' | 'Bonne Affaire' | 'Occasion';

export interface Seller {
  name: string;
  verified: boolean;
  location: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: string;
  horsepower: number;
  description: string;
  features: string[];
  images: string[];
  category: Category;
  badge?: BadgeType;
  zeroToSixty?: number;
  range?: number;
  drivetrain?: string;
  bodyStyle?: string;
  seating?: number;
  seller?: Seller;
}

export interface FilterState {
  make: string;
  minPrice: number;
  maxPrice: number;
  maxMileage: number;
  fuelType: string;
  category: Category;
}

export type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc';

// --- NEW AUTH TYPES ---

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In a real app, never store plain text
  createdAt: string;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentVehicle: {
    year: string;
    make: string;
    model: string;
    mileage: string;
    vin?: string;
  };
  desiredVehicle: string;
  contactPhone: string;
  status: 'En attente' | 'Approuvé' | 'Refusé';
  date: string;
}
