import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  CalendarIcon,
  PaintBrushIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import DropdownMenu from '../components/DropdownMenu';

export default function Home() {
  const [selectedRooms, setSelectedRooms] = useState('Two');
  const [selectedService, setSelectedService] = useState('Bathroom');
  const [selectedPackage, setSelectedPackage] = useState('Standard');

  // Dropdown options
  const roomOptions = [
    { value: 'One', label: 'One' },
    { value: 'Two', label: 'Two' },
    { value: 'Three', label: 'Three' },
    { value: 'Four', label: 'Four' },
    { value: 'Five+', label: 'Five+' },
  ];

  const serviceOptions = [
    { value: 'Bathroom', label: 'Bathroom' },
    { value: 'Bedroom', label: 'Bedroom' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Living Room', label: 'Living Room' },
    { value: 'Office', label: 'Office' },
  ];

  const packageOptions = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' },
  ];

  const features = [
    {
      icon: CalendarIcon,
      title: 'BOOK',
      description: 'Tell us when and where you want your painting.',
    },
    {
      icon: PaintBrushIcon,
      title: 'PAINT',
      description: 'A professional painter comes over and transforms your space.',
    },
    {
      icon: SparklesIcon,
      title: 'ENJOY',
      description: 'Enjoy your beautiful new space and come back to a fresh home!',
    },
  ];

  const articles = [
    {
      title: 'How to Choose the Right Paint Colors for Your Living Room',
      excerpt: 'Selecting the perfect paint colors can transform your living space. Here are professional tips to help you make the right choice...',
      author: 'Sarah Johnson',
      date: 'December 15, 2024',
      image: '/api/placeholder/400/250',
    },
    {
      title: 'Exterior Painting: Best Practices for Weather Protection',
      excerpt: 'Protect your home from the elements with proper exterior painting techniques. Learn about weather-resistant paints and application methods...',
      author: 'Mike Rodriguez',
      date: 'December 12, 2024',
      image: '/api/placeholder/400/250',
    },
    {
      title: '10 Easy Ways to Maintain Your Painted Walls',
      excerpt: 'Keep your painted walls looking fresh and new with these simple maintenance tips. From cleaning to touch-ups, we cover it all...',
      author: 'Lisa Chen',
      date: 'December 10, 2024',
      image: '/api/placeholder/400/250',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your One Stop Painting
                <br />
                <span className="text-blue-600">Centre For All Needs</span>
              </h1>
              
              {/* Service Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto lg:mx-0">
                <div className="grid grid-cols-3 gap-4">
                  {/* Rooms Selector */}
                  <DropdownMenu
                    options={roomOptions}
                    selectedValue={selectedRooms}
                    onSelect={setSelectedRooms}
                    placeholder="Select rooms"
                    buttonClassName="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white text-gray-900 font-normal text-left justify-between inline-flex items-center"
                    menuClassName="w-full"
                  />

                  {/* Service Type Selector */}
                  <DropdownMenu
                    options={serviceOptions}
                    selectedValue={selectedService}
                    onSelect={setSelectedService}
                    placeholder="Select service"
                    buttonClassName="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white text-gray-900 font-normal text-left justify-between inline-flex items-center"
                    menuClassName="w-full"
                  />

                  {/* Package Selector */}
                  <DropdownMenu
                    options={packageOptions}
                    selectedValue={selectedPackage}
                    onSelect={setSelectedPackage}
                    placeholder="Select package"
                    buttonClassName="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white text-gray-900 font-normal text-left justify-between inline-flex items-center"
                    menuClassName="w-full"
                  />
                </div>
              </div>

              <Link
                to="/booking"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Booking from $80
              </Link>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="flex justify-center items-center h-96">
                {/* Painter Character */}
                <div className="relative">
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center">
                    <PaintBrushIcon className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-8 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose PaintPro?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We understand your home is important to you. That's why we focus on the quality of the work. Our painters aren't contract workers - they are full-time employees. They care as much as we do.
              </p>
            </div>

            {/* Right Features */}
            <div className="grid grid-cols-1 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
            The PaintPro Report
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <PaintBrushIcon className="w-16 h-16 text-blue-600" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {article.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        {article.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
