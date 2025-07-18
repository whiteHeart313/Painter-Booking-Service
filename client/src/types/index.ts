export interface PaintingService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: 'interior' | 'exterior' | 'commercial' | 'residential';
}

export interface CleaningService {
  id: string;
  name: string;
  duration: string;
  durationInHours: number;
  pricePerRoom: number;
}

export interface RoomSelection {
  type: string;
  count: number;
  pricePerRoom: number;
}

export interface CleaningBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  selectedRooms: RoomSelection[];
  selectedService: CleaningService;
  address: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  totalCost: number;
  totalRooms: number;
  totalDuration: number;
  additionalNotes?: string;
}

export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  preferredDate: string;
  address: string;
  additionalNotes?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: PaintingService;
  preferredDate: string;
  address: string;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CleaningBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  selectedRooms: RoomSelection[];
  selectedService: CleaningService;
  address: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  totalCost: number;
  totalRooms: number;
  totalDuration: number;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  role:Role;
  roleId: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Role {
  id: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  role: 'USER' | 'PAINTER';
  address: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export interface BookingResponse {
  id: string;
  requestedStart: string;
  requestedEnd: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  painter?: {
    id: string;
    firstname: string;
    lastname: string;
    rating: number;
  };
  address: string;
  description?: string;
  estimatedHours?: number;
}

export interface CreateBookingRequest {
  requestedStart: string;
  requestedEnd: string;
  description?: string;
  address: string;
  estimatedHours?: number;
}
