
import { Vehicle, FuelType } from './types';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'hyperion-x',
    make: 'Hyperion',
    model: 'X GT',
    year: 2024,
    price: 145000,
    mileage: 1240,
    fuelType: FuelType.Electric,
    transmission: 'Automatique',
    horsepower: 1020,
    zeroToSixty: 2.4,
    range: 637,
    drivetrain: 'AWD',
    bodyStyle: 'Coupé',
    seating: 4,
    description: 'Découvrez le futur de la conduite avec l\'Hyperion X GT 2024. Ce chef-d\'œuvre électrique allie performances sur circuit et luxe sans compromis. Doté de la nouvelle architecture Tri-Motor, il offre un vecteur de couple capable de défier la physique. L\'intérieur est habillé de cuir végétalien durable et dispose d\'un écran cinématique de 17 pouces.',
    features: ['Navigation Autopilot', 'Caméra 360°', 'Système Audio Premium (22 HP)', 'Sièges Chauffants & Ventilés', 'Aileron Fibre de Carbone', 'Jantes Arachnid 21"'],
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493238792015-fa094a310cf5?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Sport',
    badge: 'Nouveauté',
    seller: {
      name: 'Luxe Motors Beverly Hills',
      verified: true,
      location: 'Beverly Hills, CA',
      phone: '+1 (310) 555-0123'
    }
  },
  {
    id: '1',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    price: 135000,
    mileage: 4200,
    fuelType: FuelType.Petrol,
    transmission: 'Automatique (PDK)',
    horsepower: 443,
    zeroToSixty: 3.5,
    drivetrain: 'Propulsion',
    bodyStyle: 'Coupé',
    seating: 4,
    description: 'Une icône intemporelle. La Porsche 911 allie tradition et technologie de pointe. Finition Argent GT Métallisé avec intérieur Rouge Bordeaux.',
    features: ['Pack Sport Chrono', 'Son Surround BOSE', 'Jantes RS Spyder 20/21"', 'Échappement Sport'],
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Sport',
    badge: 'Nouveauté',
    seller: {
      name: 'Porsche Centre',
      verified: true,
      location: 'Los Angeles, CA',
      phone: '(555) 123-4567'
    }
  },
  {
    id: '2',
    make: 'Mercedes-Benz',
    model: 'AMG GT',
    year: 2022,
    price: 112500,
    mileage: 12000,
    fuelType: FuelType.Petrol,
    transmission: 'Automatique',
    horsepower: 523,
    zeroToSixty: 3.7,
    drivetrain: 'Propulsion',
    bodyStyle: 'Coupé',
    seating: 2,
    description: 'Le luxe performant à son apogée. Le long capot et l\'arrière court confèrent à l\'AMG GT des proportions classiques de voiture de sport.',
    features: ['Pack Nuit', 'Son Burmester', 'Inserts Carbone', 'Aérodynamisme Actif'],
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Berlines',
    badge: 'Certifié',
    seller: {
      name: 'MB of Santa Monica',
      verified: true,
      location: 'Santa Monica, CA',
      phone: '(555) 999-8888'
    }
  },
  {
    id: '3',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 89900,
    mileage: 500,
    fuelType: FuelType.Electric,
    transmission: 'Automatique',
    horsepower: 1020,
    zeroToSixty: 1.99,
    range: 600,
    drivetrain: 'AWD',
    bodyStyle: 'Berline',
    seating: 5,
    description: 'La voiture de série la plus rapide en accélération. La transmission intégrale trimoteur et le volant Yoke définissent cette merveille d\'ingénierie.',
    features: ['Conduite Autonome', 'Volant Yoke', 'Jantes 21"', 'Intérieur Carbone'],
    images: [
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Électrique',
    seller: {
      name: 'Tesla Direct',
      verified: true,
      location: 'Fremont, CA',
      phone: '(555) 000-0000'
    }
  },
  {
    id: '4',
    make: 'Audi',
    model: 'RS7 Sportback',
    year: 2024,
    price: 122000,
    mileage: 50,
    fuelType: FuelType.Petrol,
    transmission: 'Automatique',
    horsepower: 591,
    zeroToSixty: 3.5,
    drivetrain: 'AWD',
    bodyStyle: 'Berline',
    seating: 5,
    description: 'Un design époustouflant rencontre des performances fulgurantes. La RS7 Sportback est la voiture quotidienne ultime pour les passionnés.',
    features: ['Freins Céramiques', 'Feux Laser', 'Pack Optique Noir', 'Suspension Pneumatique'],
    images: [
      'https://images.unsplash.com/photo-1603584173870-7b299f589389?q=80&w=2070&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Berlines',
    badge: 'Bonne Affaire'
  },
  {
    id: '5',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2023,
    price: 98500,
    mileage: 8000,
    fuelType: FuelType.Petrol,
    transmission: 'Automatique',
    horsepower: 503,
    zeroToSixty: 3.4,
    drivetrain: 'AWD',
    bodyStyle: 'Coupé',
    seating: 4,
    description: 'La machine à conduire ultime. Style agressif et capacité M xDrive.',
    features: ['Sièges Baquets Carbone', 'Affichage Tête Haute', 'Feux Laser', 'Pack Extérieur Carbone M'],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1556189250-72ba954e6eb3?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Sport',
  },
  {
    id: '6',
    make: 'Land Rover',
    model: 'Defender 110',
    year: 2021,
    price: 78000,
    mileage: 35000,
    fuelType: FuelType.Diesel,
    transmission: 'Automatique',
    horsepower: 296,
    zeroToSixty: 6.7,
    drivetrain: 'AWD',
    bodyStyle: 'SUV',
    seating: 7,
    description: 'Capable de grandes choses. Le Defender 110 respecte son héritage tout en embrassant l\'avenir.',
    features: ['Suspension Pneumatique', 'Son Meridian', 'Pack Off-road', 'Toit Panoramique'],
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop', 
      'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'SUV',
    badge: 'Occasion'
  }
];

export const MAKES = [
  { name: 'Porsche', count: 12 },
  { name: 'Mercedes-Benz', count: 24 },
  { name: 'BMW', count: 18 },
  { name: 'Audi', count: 15 },
  { name: 'Tesla', count: 8 },
  { name: 'Land Rover', count: 6 },
  { name: 'Hyperion', count: 1 },
];

export const CATEGORIES = [
  { id: 'Tout', icon: 'LayoutGrid' },
  { id: 'SUV', icon: 'Truck' },
  { id: 'Berlines', icon: 'CarFront' },
  { id: 'Sport', icon: 'Flag' },
  { id: 'Électrique', icon: 'Zap' },
  { id: 'Hybride', icon: 'Leaf' }
];
