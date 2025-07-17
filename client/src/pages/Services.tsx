import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paintingAPI } from '../services/api';
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import type { PaintingService } from '../types';

const serviceCategories = [
  { id: 'all', name: 'All Services', color: 'bg-blue-100 text-blue-800' },
  { id: 'interior', name: 'Interior', color: 'bg-green-100 text-green-800' },
  { id: 'exterior', name: 'Exterior', color: 'bg-purple-100 text-purple-800' },
  {
    id: 'commercial',
    name: 'Commercial',
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'residential',
    name: 'Residential',
    color: 'bg-pink-100 text-pink-800',
  },
];

export default function Services() {
  const [services, setServices] = useState<PaintingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await paintingAPI.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
      // Mock data for demonstration
      setServices([
        {
          id: '1',
          name: 'Premium Interior Painting',
          description:
            'Transform your indoor spaces with our premium interior painting services. We use eco-friendly paints and expert techniques for a flawless finish.',
          price: 180,
          duration: '1-2 days',
          image:
            'https://images.unsplash.com/photo-1562259949-e8e7689d7828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'interior',
        },
        {
          id: '2',
          name: 'Exterior House Painting',
          description:
            "Protect and beautify your home's exterior with our weather-resistant painting solutions. Perfect for all seasons and climates.",
          price: 320,
          duration: '2-4 days',
          image:
            'https://images.unsplash.com/photo-1605276373954-0c4a0dac5cc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'exterior',
        },
        {
          id: '3',
          name: 'Commercial Painting',
          description:
            'Professional painting services for offices, retail spaces, and commercial buildings. Minimal disruption to your business operations.',
          price: 650,
          duration: '3-7 days',
          image:
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'commercial',
        },
        {
          id: '4',
          name: 'Quick Touch-ups',
          description:
            'Fast and affordable touch-up services for small areas, scratches, and minor paint damage. Perfect for maintenance.',
          price: 95,
          duration: '2-4 hours',
          image:
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'residential',
        },
        {
          id: '5',
          name: 'Luxury Finish Painting',
          description:
            'Premium textures and finishes for high-end properties. Specialty paints and advanced techniques for exceptional results.',
          price: 450,
          duration: '3-5 days',
          image:
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'interior',
        },
        {
          id: '6',
          name: 'Deck & Fence Staining',
          description:
            'Protect and enhance your outdoor wooden structures with professional staining services. Long-lasting protection against weather.',
          price: 280,
          duration: '1-3 days',
          image:
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          category: 'exterior',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices =
    selectedCategory === 'all'
      ? services
      : services.filter(service => service.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const categoryObj = serviceCategories.find(cat => cat.id === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Our Services
            </h1>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
              Professional painting services tailored to your needs. From
              residential homes to commercial spaces.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {serviceCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}
                  >
                    {service.category}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                    <div className="flex items-center text-lg font-bold text-blue-600">
                      <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                      {service.price}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/book?service=${service.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 group"
                >
                  Book This Service
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Service CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
              <CheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Every project is unique. We offer customized painting solutions
              tailored to your specific needs, timeline, and budget. Our experts
              will work with you to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Get Custom Quote
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
