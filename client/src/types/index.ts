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
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
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
}
