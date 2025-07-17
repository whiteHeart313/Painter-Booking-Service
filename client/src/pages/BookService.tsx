import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paintingAPI } from '../services/api';
import type { PaintingService, BookingRequest } from '../types';

export default function BookService() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<PaintingService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<BookingRequest>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    preferredDate: '',
    address: '',
    additionalNotes: '',
  });

  useEffect(() => {
    fetchServices();
    const serviceId = searchParams.get('service');
    if (serviceId) {
      setSelectedService(serviceId);
      setFormData(prev => ({ ...prev, serviceId }));
    }
  }, [searchParams]);

  const fetchServices = async () => {
    try {
      const data = await paintingAPI.getServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      // Mock data for demonstration
      setServices([
        {
          id: '1',
          name: 'Interior Painting',
          description:
            'Transform your indoor spaces with our professional interior painting services.',
          price: 150,
          duration: '1-2 days',
          image: '/api/placeholder/300/200',
          category: 'interior',
        },
        {
          id: '2',
          name: 'Exterior Painting',
          description:
            "Protect and beautify your home's exterior with our weather-resistant painting solutions.",
          price: 250,
          duration: '2-3 days',
          image: '/api/placeholder/300/200',
          category: 'exterior',
        },
        {
          id: '3',
          name: 'Commercial Painting',
          description:
            'Professional painting services for offices, retail spaces, and commercial buildings.',
          price: 500,
          duration: '3-5 days',
          image: '/api/placeholder/300/200',
          category: 'commercial',
        },
        {
          id: '4',
          name: 'Residential Touch-ups',
          description:
            'Quick and affordable touch-up services for small areas, scratches, and minor paint damage.',
          price: 75,
          duration: '4-6 hours',
          image: '/api/placeholder/300/200',
          category: 'residential',
        },
      ]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await paintingAPI.createBooking(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setError('Failed to submit booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Submitted!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your booking request. We'll contact you soon to
            confirm the details.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Book a Service
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Schedule your painting service with us
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label
              htmlFor="serviceId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Service *
            </label>
            <select
              id="serviceId"
              name="serviceId"
              value={selectedService}
              onChange={e => {
                setSelectedService(e.target.value);
                handleInputChange(e);
              }}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} ({service.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Service Details */}
          {selectedServiceData ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {selectedServiceData.name}
              </h3>
              <p className="text-blue-700 text-sm mb-2">
                {selectedServiceData.description}
              </p>
              <div className="flex justify-between text-sm text-blue-600">
                <span>Duration: {selectedServiceData.duration}</span>
                <span>Price: ${selectedServiceData.price}</span>
              </div>
            </div>
          ) : null}

          {/* Customer Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferred Date *
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Service Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="123 Main St, City, State 12345"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="additionalNotes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={4}
              value={formData.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any special requirements or additional information..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
