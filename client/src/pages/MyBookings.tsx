import { useState, useEffect } from 'react';
import { BookingService } from '../services/bookingService';
import type { BookingResponse } from '../types';

export default function MyBookings() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BookingService.getUserBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status: BookingResponse['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            My Bookings
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Track your painting service appointments
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any painting service bookings yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => (window.location.href = '/booking')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Book a Service
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Painting Service Booking
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1).toLowerCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Requested Start:</span>{' '}
                            {formatDate(booking.requestedStart)}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Requested End:</span>{' '}
                            {formatDate(booking.requestedEnd)}
                          </p>
                          {booking.scheduledStart && booking.scheduledEnd && (
                            <>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Scheduled Start:</span>{' '}
                                {formatDate(booking.scheduledStart)}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Scheduled End:</span>{' '}
                                {formatDate(booking.scheduledEnd)}
                              </p>
                            </>
                          )}
                          {booking.estimatedHours && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Estimated Hours:</span>{' '}
                              {booking.estimatedHours}
                            </p>
                          )}
                        </div>

                        <div>
                          {booking.painter && (
                            <div className="mb-2">
                              <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Assigned Painter:</span>{' '}
                                {booking.painter.firstname} {booking.painter.lastname}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Rating:</span>{' '}
                                {booking.painter.rating}/5 ⭐
                              </p>
                            </div>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Status:</span>{' '}
                            {booking.status}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Service Address:</span>
                        </p>
                        <p className="text-sm text-gray-700">
                          {booking.address}
                        </p>
                      </div>

                      {booking.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">
                              Description:
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            {booking.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  {booking.status === 'PENDING' && (
                    <button className="text-sm text-red-600 hover:text-red-800">
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Contact Painter
                    </button>
                  )}
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Contact Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
