import { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userRole?: UserRole;
    }
  }
}

export type typeValidation<req, res> = RequestHandler<
  any,
  Partial<message<res>>,
  Partial<req>,
  any
>;

export type typeValidation_queryParams<req, res> = RequestHandler<
  Partial<req>,
  Partial<message<res>>,
  any,
  any
>;

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isVerified: boolean;
  roleId: string;
  address: string | null;
  phone: string | null;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: UserRole;
  painterProfile?: PainterProfile | null;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PainterProfile {
  id: string;
  userId: string;
  rating: number;
  totalRatings: number;
  experience?: string | null;
  specialties: string[];
  hourlyRate?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Availability {
  id: string;
  painterId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  id: string;
  userId: string;
  requestedStart: Date;
  requestedEnd: Date;
  description?: string;
  address: string;
  estimatedHours?: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  bookingRequestId: string;
  painterId: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: BookingStatus;
  totalCost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export type message<T> = T | { message: string };

// Request/Response types for API endpoints
export interface CreateAvailabilityRequest {
  startTime: string;
  endTime: string;
}

export interface CreateBookingRequest {
  requestedStart: string;
  requestedEnd: string;
  description?: string;
  address: string;
  estimatedHours?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleId: string;
  address?: string;
  phone?: string;
}

export interface AvailabilityResponse {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface BookingResponse {
  id: string;
  requestedStart: string;
  requestedEnd: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  status: BookingStatus;
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

export interface PainterSelectionResult {
  painter: PainterProfile & { user: User };
  availabilitySlot: Availability;
  score: number;
}

export interface AlternativeSlot {
  startTime: Date;
  endTime: Date;
  painter: PainterProfile & { user: User };
  timeDifference: number; // in minutes
}

export interface ServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}