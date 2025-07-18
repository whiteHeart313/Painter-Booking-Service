import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import AvailabilityService from '../services/availabilityService';
import type { AvailabilityData } from '../services/availabilityService';

export default function SetAvailability() {
  const [availabilities, setAvailabilities] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '',
    endTime: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const response = await AvailabilityService.getMyAvailabilities();
      setAvailabilities(response);
    } catch (err) {
      console.error('Error fetching availabilities:', err);
      setError('Failed to load availabilities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAvailability.date || !newAvailability.startTime || !newAvailability.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (newAvailability.startTime >= newAvailability.endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await AvailabilityService.createAvailability(newAvailability);
      setAvailabilities([...availabilities, response]);
      setNewAvailability({
        date: '',
        startTime: '',
        endTime: '',
        isAvailable: true
      });
      
    } catch (err) {
      console.error('Error creating availability:', err);
      setError('Failed to create availability');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await AvailabilityService.deleteAvailability(id);
      setAvailabilities(availabilities.filter(avail => avail.id !== id));
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError('Failed to delete availability');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Set Your Availability</h1>
              <p className="text-gray-600 mt-1">
                Manage your working hours and availability for painting appointments
              </p>
            </div>
          </div>
        </div>

        {/* Add New Availability Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Availability</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newAvailability.date}
                  onChange={(e) => setNewAvailability({...newAvailability, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newAvailability.startTime}
                  onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={newAvailability.endTime}
                  onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                checked={newAvailability.isAvailable}
                onChange={(e) => setNewAvailability({...newAvailability, isAvailable: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                Mark as available
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Adding...' : 'Add Availability'}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Availabilities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Availabilities</h2>
          
          {availabilities.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No availabilities set yet</p>
              <p className="text-gray-400 text-sm">Add your first availability above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDate(availability.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            availability.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {availability.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(availability.id!)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
