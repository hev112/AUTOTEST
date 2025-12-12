import { Vehicle, User, ExchangeRequest } from '../types';
import { MOCK_VEHICLES } from '../constants';

const STORAGE_KEY = 'autoluxe_vehicles_db_v1';
const ADMIN_CREDS_KEY = 'autoluxe_admin_creds_v1';
const ADMIN_SESSION_KEY = 'autoluxe_admin_session_v1';

const USERS_KEY = 'autoluxe_users_db_v1';
const CURRENT_USER_KEY = 'autoluxe_current_user_session_v1';
const REQUESTS_KEY = 'autoluxe_exchange_requests_v1';

// Helper to generate IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// --- VEHICLE OPERATIONS ---

export const getVehicles = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VEHICLES));
      return MOCK_VEHICLES;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading from storage", error);
    return MOCK_VEHICLES;
  }
};

export const getVehicle = (id: string): Vehicle | undefined => {
  const vehicles = getVehicles();
  return vehicles.find((v) => v.id === id);
};

export const saveVehicle = (vehicle: Vehicle): void => {
  const vehicles = getVehicles();
  if (!vehicle.id) {
    vehicle.id = generateId();
  }
  const index = vehicles.findIndex((v) => v.id === vehicle.id);
  if (index >= 0) {
    vehicles[index] = { ...vehicles[index], ...vehicle };
  } else {
    vehicles.push(vehicle);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  window.dispatchEvent(new Event('db-update'));
};

export const deleteVehicle = (id: string): void => {
  const vehicles = getVehicles();
  const newVehicles = vehicles.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVehicles));
  window.dispatchEvent(new Event('db-update'));
};

// --- ADMIN AUTH OPERATIONS ---

export const hasAdminAccount = (): boolean => {
  return !!localStorage.getItem(ADMIN_CREDS_KEY);
};

export const createAdminAccount = (password: string) => {
  const hash = btoa(password + "_autoluxe_secure_salt"); 
  localStorage.setItem(ADMIN_CREDS_KEY, hash);
  localStorage.setItem(ADMIN_SESSION_KEY, 'true');
};

export const loginAdmin = (password: string): boolean => {
  const storedHash = localStorage.getItem(ADMIN_CREDS_KEY);
  const attemptHash = btoa(password + "_autoluxe_secure_salt");
  if (storedHash === attemptHash) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

// --- CLIENT AUTH OPERATIONS ---

const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const checkEmailExists = (email: string): boolean => {
  const users = getUsers();
  return !!users.find(u => u.email === email);
};

export const registerUser = (name: string, email: string, password: string): { success: boolean; message?: string } => {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Cet email est déjà utilisé.' };
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    passwordHash: btoa(password), // Simple encoding for demo
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Auto login
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  window.dispatchEvent(new Event('auth-change'));
  
  return { success: true };
};

export const loginUser = (email: string, password: string): { success: boolean; message?: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.passwordHash === btoa(password));
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
    return { success: true };
  }
  
  return { success: false, message: 'Email ou mot de passe incorrect.' };
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event('auth-change'));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// --- EXCHANGE REQUEST OPERATIONS ---

export const getExchangeRequests = (): ExchangeRequest[] => {
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveExchangeRequest = (request: Omit<ExchangeRequest, 'id' | 'date' | 'status'>) => {
  const requests = getExchangeRequests();
  const newRequest: ExchangeRequest = {
    ...request,
    id: generateId(),
    date: new Date().toISOString(),
    status: 'En attente'
  };
  requests.unshift(newRequest); // Add to top
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event('request-update'));
};

export const updateRequestStatus = (id: string, status: 'Approuvé' | 'Refusé') => {
  const requests = getExchangeRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index >= 0) {
    requests[index].status = status;
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('request-update'));
  }
};