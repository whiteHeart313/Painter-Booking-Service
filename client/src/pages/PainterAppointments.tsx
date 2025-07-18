import { useState, useEffect } from 'react';
import { CalendarDaysIcon, MapPinIcon, ClockIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import AppointmentService from '../services/appointmentService';
import type { Appointment } from '../services/appointmentService';

export default function PainterAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'completed'>('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await AppointmentService.getMyAppointments();
      setAppointments(response);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await AppointmentService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status');
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.scheduledStart);
          return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });
      case 'upcoming':
        return appointments.filter(apt => 
          new Date(apt.scheduledStart) > now && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED'
        );
      case 'completed':
        return appointments.filter(apt => apt.status === 'COMPLETED');
      default:
        return appointments;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <p className="text-gray-600 mt-1">
                  View and manage your painting appointments
                </p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'today', label: 'Today' },
                { key: 'completed', label: 'Completed' },
                { key: 'all', label: 'All' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {filter === 'today' && 'No appointments scheduled for today'}
                {filter === 'upcoming' && 'No upcoming appointments'}
                {filter === 'completed' && 'No completed appointments'}
                {filter === 'all' && 'No appointments available'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.customer.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>{formatDate(appointment.scheduledStart)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4" />
                            <span>
                              {formatTime(appointment.scheduledStart)} - {formatTime(appointment.scheduledEnd)}
                            </span>
                          </div>
                          {appointment.estimatedHours && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4" />
                              <span>{appointment.estimatedHours} hours estimated</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <UserIcon className="h-4 w-4" />
                            <span>{appointment.customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4" />
                            <span>{appointment.customer.phone}</span>
                          </div>
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mt-0.5" />
                            <span>{appointment.address}</span>
                          </div>
                        </div>
                      </div>

                      {appointment.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Description: </span>
                            {appointment.description}
                          </p>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes: </span>
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'IN_PROGRESS')}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Start Job
                      </button>
                    )}
                    
                    {appointment.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Mark Complete
                      </button>
                    )}

                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                      Contact Customer
                    </button>

                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <button
                        onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')}
                        className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
