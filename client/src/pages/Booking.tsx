import { Link } from 'react-router-dom';
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useBooking } from '../hooks/useBooking';

interface ServiceType {
  id: string;
  name: string;
  duration: string;
  durationInHours?: number; // Optional for future use
  pricePerRoom: number;
}

export default function Booking() {
  const {
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
    updateEndDateTime,
  } = useBooking();

  const roomTypes = [
    'Studio',
    'Bedroom',
    'Bathroom',
    'Kitchen',
    'Living Room',
    'Dining Room',
    'Office',
    'Laundry Room',
    'Garage',
    'Basement'
  ];

  const serviceTypes: ServiceType[] = [
    { id: 'standard', name: 'Standard', duration: '2 hours', pricePerRoom: 80 , durationInHours: 2},
    { id: 'deep', name: 'Deep Clean', duration: '2.5-3 hours', pricePerRoom: 120  , durationInHours: 3},
    { id: 'moving', name: 'Moving In/Out', duration: '4-5 hours', pricePerRoom: 160 , durationInHours: 5},
    { id: 'construction', name: 'Post Construction', duration: '4.5-5 hours', pricePerRoom: 200 , durationInHours: 5}
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between p-4 h-[78px]">
            <div className="flex items-center space-x-24">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                <XMarkIcon className="w-6 h-6" />
              </Link>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900">{getTotalRooms() || '0'}</span>
                </div>
                <span className="text-xs text-gray-500">BEDROOM NUMBER</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900">{selectedService?.name || '-'}</span>
                </div>
                <span className="text-xs text-gray-500">CLEAN TYPE</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-900">
                    {startDate ? new Date(startDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : '-'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">SCHEDULE DATE</span>
              </div>
              
            </div>
            <div className="bg-gray-800 text-white px-3 py-1 rounded text-center">
              <span className="text-lg font-bold leading-tight">${calculateTotal() || '0'}</span>
              <div className="text-xs leading-tight">SUB TOTAL</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {isCompleted ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 mb-4">
                Thank you for your booking. We'll contact you soon to confirm the details.
              </p>
              {bookingId && (
                <p className="text-sm text-gray-500 mb-8">
                  Booking ID: <span className="font-medium">{bookingId}</span>
                </p>
              )}
              
              {/* Final Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Rooms:</span>
                    <span className="font-medium">{getTotalRooms()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Type:</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedService?.durationInHours ? selectedService.durationInHours * getTotalRooms() : 0} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start Date & Time:</span>
                    <span className="font-medium">
                      {startDate && startTime ? new Date(`${startDate}T${startTime}`).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      }) + ' at ' + startTime : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date & Time:</span>
                    <span className="font-medium">
                      {endDate && endTime ? new Date(`${endDate}T${endTime}`).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                      }) + ' at ' + endTime : '-'}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Cost:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/bookings" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View My Bookings
                </Link>
                <br />
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                Customize Your Requirements
              </h1>

          {/* Step Progress */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              {getStepTitle()}
            </h2>

            {/* Step 1: Room Type Selection with Quantities */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-3">
                  {roomTypes.map((roomType) => (
                    <button
                      key={roomType}
                      onClick={() => handleRoomTypeSelect(roomType)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedRooms.find(room => room.type === roomType)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {roomType}
                    </button>
                  ))}
                </div>
                
                {/* Room quantities */}
                {selectedRooms.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Set Room Quantities</h3>
                    {selectedRooms.map((room) => (
                      <div key={room.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium text-gray-900">{room.type}</span>
                          <button
                            onClick={() => removeRoom(room.type)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateRoomCount(room.type, false)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{room.count}</span>
                          <button
                            onClick={() => updateRoomCount(room.type, true)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                          <span className="ml-4 text-sm text-gray-600">
                            ${room.pricePerRoom} × {room.count} = ${room.pricePerRoom * room.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Service Type Selection */}
            {currentStep === 2 && (
              <div className="grid grid-cols-4 gap-4">
                {serviceTypes.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedService?.id === service.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm mt-1">{service.duration}</div>
                    <div className="text-sm mt-1">${service.pricePerRoom}/room</div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Address Input */}
            {currentStep === 3 && (
              <div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full address (e.g., 1234 Main St, City, State, ZIP)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please provide your complete address including street, city, state, and ZIP code
                </p>
              </div>
            )}

            {/* Step 4: Schedule Date & Time */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        updateEndDateTime();
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        updateEndDateTime();
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Required Duration:</strong> {getTotalDurationHours()} hours
                    {selectedService && (
                      <span className="block mt-1">
                        ({selectedService.durationInHours} hours per room × {getTotalRooms()} rooms)
                      </span>
                    )}
                  </p>
                  {startDate && startTime && endDate && endTime && (
                    <p className="text-sm text-blue-800 mt-2">
                      <strong>Selected Duration:</strong> {
                        Math.round(
                          (new Date(`${endDate}T${endTime}`).getTime() - new Date(`${startDate}T${startTime}`).getTime()) / (1000 * 60 * 60) * 100
                        ) / 100
                      } hours
                    </p>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Please ensure the end time allows for the full service duration and is not in the past.
                </p>
              </div>
            )}
          </div>

          {/* Summary - Show from step 2 onwards */}
          {currentStep > 1 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Summary:</span>
                <span className="text-lg font-semibold">${calculateTotal()}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Total Rooms: {getTotalRooms()}</div>
                {selectedService && <div>Service Type: {selectedService.name}</div>}
                {selectedService && selectedService.durationInHours && (
                  <div>
                    Duration: {selectedService.durationInHours * getTotalRooms()} hours
                  </div>
                )}
                {address && <div>Address: {address}</div>}
                {startDate && startTime && (
                  <div>
                    Start: {new Date(`${startDate}T${startTime}`).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric' 
                    })} at {startTime}
                  </div>
                )}
                {endDate && endTime && (
                  <div>
                    End: {new Date(`${endDate}T${endTime}`).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric' 
                    })} at {endTime}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          {!isCompleted && (
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? (
                  isSubmitting ? 'Submitting...' : 'Complete Booking'
                ) : 'Next'}
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
