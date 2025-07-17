import React, { useState } from 'react';
import { Clock, X, Trash2, Plus, Info } from 'lucide-react';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
type DaySchedule = { enabled: boolean; startTime: string; endTime: string };
type DaySchedules = Record<DayKey, DaySchedule>;

export default function TimeScheduleDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [businessHoursEnabled, setBusinessHoursEnabled] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const [daySchedules, setDaySchedules] = useState<DaySchedules>({
    monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
  });

  const timezones = [
    {
      value: 'America/New_York',
      label: 'EST (Eastern Standard Time) - GMT-5 (New York)',
    },
    {
      value: 'America/Los_Angeles',
      label: 'PST (Pacific Standard Time) - GMT-8 (Los Angeles)',
    },
    {
      value: 'Europe/London',
      label: 'GMT (Greenwich Mean Time) - GMT+0 (London)',
    },
    {
      value: 'Europe/Paris',
      label: 'CET (Central European Time) - GMT+1 (Paris)',
    },
    { value: 'Asia/Tokyo', label: 'JST (Japan Standard Time) - GMT+9 (Tokyo)' },
    {
      value: 'Australia/Sydney',
      label: 'AEDT (Australian Eastern Daylight Time) - GMT+11 (Sydney)',
    },
    {
      value: 'Canada/Mountain',
      label: 'MST (Mountain Standard Time) - GMT-7 (Canada)',
    },
    {
      value: 'Canada/Central',
      label: 'CST (Central Standard Time) - GMT-6 (Canada)',
    },
    {
      value: 'Canada/Eastern',
      label: 'EST (Eastern Standard Time) - GMT-5 (Canada)',
    },
    {
      value: 'Europe/Berlin',
      label: 'CET (Central European Time) - GMT+1 (Berlin)',
    },
  ];
  const daysOfWeek: { key: DayKey; label: string }[] = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
  ];

  const handleDayToggle = (day: DayKey) => {
    setDaySchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (
    day: DayKey,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setDaySchedules(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('Saving schedule:', {
      businessHoursEnabled,
      timezone: selectedTimezone,
      schedules: daySchedules,
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div className="text-center">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Set time schedule
        </button>
      </div>

      {/* Overlay */}
      {isDrawerOpen ? (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      ) : null}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform bg-white w-96 dark:bg-gray-800 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
            Time schedule
          </h5>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        {/* Business Hours Toggle */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-900 dark:text-white text-base font-medium">
              Business hours
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={businessHoursEnabled}
                onChange={e => setBusinessHoursEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span className="sr-only">Business hours</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
            Enable or disable business working hours for all weekly working days
          </p>
        </div>

        {/* Timezone Selection */}
        <div className="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
          <label className="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white">
            <span className="me-1">Select a timezone</span>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="ml-1"
              >
                <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white dark:text-gray-500" />
                <span className="sr-only">Details</span>
              </button>
              {showTooltip ? (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg dark:bg-gray-700 z-50">
                  Select a timezone that fits your location to accurately
                  display time-related information.
                </div>
              ) : null}
            </div>
          </label>
          <select
            value={selectedTimezone}
            onChange={e => setSelectedTimezone(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="">Choose a timezone</option>
            {timezones.map(timezone => (
              <option key={timezone.value} value={timezone.value}>
                {timezone.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days Schedule */}
        <div className="mb-6">
          {daysOfWeek.map(day => (
            <div key={day.key} className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-[4rem]">
                  <input
                    id={day.key}
                    type="checkbox"
                    checked={daySchedules[day.key].enabled}
                    onChange={() => handleDayToggle(day.key)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={day.key}
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {day.label}
                  </label>
                </div>

                <div className="w-full max-w-[7rem]">
                  <label htmlFor={`start-time-${day.key}`} className="sr-only">
                    Start time:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id={`start-time-${day.key}`}
                      value={daySchedules[day.key].startTime}
                      onChange={e =>
                        handleTimeChange(day.key, 'startTime', e.target.value)
                      }
                      className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      min="09:00"
                      max="18:00"
                      required
                    />
                  </div>
                </div>

                <div className="w-full max-w-[7rem]">
                  <label htmlFor={`end-time-${day.key}`} className="sr-only">
                    End time:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id={`end-time-${day.key}`}
                      value={daySchedules[day.key].endTime}
                      onChange={e =>
                        handleTimeChange(day.key, 'endTime', e.target.value)
                      }
                      className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      min="09:00"
                      max="18:00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="inline-flex items-center p-1.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Interval Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center w-full py-2.5 mb-4 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 me-1" />
          Add interval
        </button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 bottom-4 left-0 w-full md:px-4 md:absolute">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="text-white w-full inline-flex items-center justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save all
          </button>
        </div>
      </div>
    </div>
  );
}
