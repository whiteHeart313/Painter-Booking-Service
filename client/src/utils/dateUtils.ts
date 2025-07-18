/**
 * Utility functions for date and time formatting
 */

export const formatDateFromISO = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTimeFromISO = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const combineDateAndTime = (date: string, time: string): string => {
  return new Date(`${date}T${time}`).toISOString();
};

export const extractDateFromISO = (isoString: string): string => {
  return new Date(isoString).toISOString().split('T')[0];
};

export const extractTimeFromISO = (isoString: string): string => {
  return new Date(isoString).toTimeString().slice(0, 5);
};
