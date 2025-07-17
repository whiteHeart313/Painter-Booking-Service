export interface PaintingService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  category: 'interior' | 'exterior' | 'commercial' | 'residential';
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

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}
