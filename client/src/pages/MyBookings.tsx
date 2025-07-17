import { useState, useEffect } from 'react';
import { paintingAPI } from '../services/api';
import type { Booking } from '../types';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await paintingAPI.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Mock data for demonstration
      setBookings([
        {
          id: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '(555) 123-4567',
          service: {
            id: '1',
            name: 'Interior Painting',
            description:
              'Transform your indoor spaces with our professional interior painting services.',
            price: 150,
            duration: '1-2 days',
            image: '/api/placeholder/300/200',
            category: 'interior',
          },
          preferredDate: '2024-01-15',
          address: '123 Main St, Anytown, ST 12345',
          additionalNotes: 'Please focus on the living room and kitchen areas.',
          status: 'confirmed',
          createdAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '(555) 987-6543',
          service: {
            id: '2',
            name: 'Exterior Painting',
            description:
              "Protect and beautify your home's exterior with our weather-resistant painting solutions.",
            price: 250,
            duration: '2-3 days',
            image: '/api/placeholder/300/200',
            category: 'exterior',
          },
          preferredDate: '2024-01-20',
          address: '456 Oak Ave, Somewhere, ST 67890',
          additionalNotes: 'Need to match the existing trim color.',
          status: 'pending',
          createdAt: '2024-01-12T14:30:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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
                onClick={() => (window.location.href = '/services')}
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
                          {booking.service.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Preferred Date:</span>{' '}
                            {formatDate(booking.preferredDate)}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Duration:</span>{' '}
                            {booking.service.duration}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Price:</span> $
                            {booking.service.price}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Contact:</span>{' '}
                            {booking.customerEmail}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Phone:</span>{' '}
                            {booking.customerPhone}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Booked:</span>{' '}
                            {formatDate(booking.createdAt)}
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

                      {booking.additionalNotes ? (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">
                              Additional Notes:
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            {booking.additionalNotes}
                          </p>
                        </div>
                      ) : null}

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">
                            Service Description:
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          {booking.service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                  {booking.status === 'pending' ? (
                    <button className="text-sm text-red-600 hover:text-red-800">
                      Cancel Booking
                    </button>
                  ) : null}
                  {booking.status === 'confirmed' ? (
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Reschedule
                    </button>
                  ) : null}
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
