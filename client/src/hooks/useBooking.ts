import { useState, useEffect } from 'react';
import { BookingService } from '../services/bookingService';
import { combineDateAndTime } from '../utils/dateUtils';
import type { ServiceType } from '../constants/bookingConstants';

interface RoomSelection {
  type: string;
  count: number;
  pricePerRoom: number;
}

export const useBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<RoomSelection[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Room and service management
  const handleRoomTypeSelect = (roomType: string) => {
    const exists = selectedRooms.find(room => room.type === roomType);
    if (!exists) {
      setSelectedRooms([...selectedRooms, { 
        type: roomType, 
        count: 1, 
        pricePerRoom: selectedService?.pricePerRoom || 80 
      }]);
    }
  };

  const updateRoomCount = (roomType: string, increment: boolean) => {
    setSelectedRooms(prev => 
      prev.map(room => {
        if (room.type === roomType) {
          const newCount = increment ? room.count + 1 : Math.max(1, room.count - 1);
          return { ...room, count: newCount };
        }
        return room;
      })
    );
  };

  const removeRoom = (roomType: string) => {
    setSelectedRooms(prev => prev.filter(room => room.type !== roomType));
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    // Update prices for existing rooms
    setSelectedRooms(prev => 
      prev.map(room => ({ ...room, pricePerRoom: service.pricePerRoom }))
    );
    // Update end date/time when service changes
    if (startDate && startTime) {
      updateEndDateTime();
    }
  };

  // Calculations
  const calculateTotal = () => {
    return selectedRooms.reduce((total, room) => total + (room.count * room.pricePerRoom), 0);
  };

  const getTotalRooms = () => {
    return selectedRooms.reduce((total, room) => total + room.count, 0);
  };

  const getTotalDurationHours = () => {
    if (!selectedService || !selectedService.durationInHours) return 0;
    return selectedService.durationInHours * getTotalRooms();
  };

  // Date/time validation and updates
  const validateDateTime = () => {
    if (!startDate || !startTime || !endDate || !endTime) return false;
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const now = new Date();
    
    // Check if start date is not in the past
    if (startDateTime <= now) return false;
    
    // Check if end date is after start date
    if (endDateTime <= startDateTime) return false;
    
    // Check if the duration is at least the required service duration
    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    const requiredDuration = getTotalDurationHours();
    
    return durationHours >= requiredDuration;
  };

  const updateEndDateTime = () => {
    if (startDate && startTime && selectedService?.durationInHours) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const totalDurationMs = getTotalDurationHours() * 60 * 60 * 1000;
      const endDateTime = new Date(startDateTime.getTime() + totalDurationMs);
      
      setEndDate(endDateTime.toISOString().split('T')[0]);
      setEndTime(endDateTime.toTimeString().slice(0, 5));
    }
  };

  // Auto-update end date/time when start date/time or service changes
  useEffect(() => {
    if (startDate && startTime && selectedService) {
      updateEndDateTime();
    }
  }, [startDate, startTime, selectedService, selectedRooms]);

  // Navigation
  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      // Complete the booking - submit to service
      await submitBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedRooms.length > 0;
      case 2:
        return selectedService !== null;
      case 3:
        return address.trim().length > 10; // Ensure reasonable address length
      case 4:
        return validateDateTime();
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'SELECT ROOM TYPES & QUANTITIES';
      case 2:
        return 'PAINT TYPE';
      case 3:
        return 'ADDRESS';
      case 4:
        return 'SCHEDULE DATE & TIME';
      default:
        return '';
    }
  };

  // Booking submission
  const submitBooking = async () => {
    if (!selectedService) {
      setError('Please select a service');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Convert date and time to ISO format
      const bookingData = {
        requestedStart: combineDateAndTime(startDate, startTime),
        requestedEnd: combineDateAndTime(endDate, endTime),
        description: `${selectedService.name} service for ${getTotalRooms()} rooms`,
        address,
        estimatedHours: getTotalDurationHours()
      };

      console.log('Sending booking data:', bookingData);

      const result = await BookingService.createBookingRequest(bookingData);
      setBookingId(result.id);
      setIsCompleted(true);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    currentStep,
    selectedRooms,
    selectedService,
    address,
    startDate,
    startTime,
    endDate,
    endTime,
    isCompleted,
    isSubmitting,
    bookingId,
    error,
    
    // Setters
    setAddress,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    
    // Room management
    handleRoomTypeSelect,
    updateRoomCount,
    removeRoom,
    handleServiceSelect,
    
    // Calculations
    calculateTotal,
    getTotalRooms,
    getTotalDurationHours,
    
    // Navigation
    handleNext,
    handleBack,
    canProceed,
    getStepTitle,
    
    // Validation
    validateDateTime,
    updateEndDateTime,
    
    // Booking
    submitBooking
  };
};
