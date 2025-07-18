export interface ServiceType {
  id: string;
  name: string;
  duration: string;
  durationInHours?: number;
  pricePerRoom: number;
}

export const ROOM_TYPES = [
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
] as const;

export const SERVICE_TYPES: ServiceType[] = [
  { 
    id: 'standard', 
    name: 'Standard', 
    duration: '2 hours', 
    pricePerRoom: 80, 
    durationInHours: 2
  },
  { 
    id: 'deep', 
    name: 'Deep Painting', 
    duration: '2.5-3 hours', 
    pricePerRoom: 120, 
    durationInHours: 3
  },
  { 
    id: 'moving', 
    name: 'Moving In/Out', 
    duration: '4-5 hours', 
    pricePerRoom: 160, 
    durationInHours: 5
  },
  { 
    id: 'construction', 
    name: 'Post Construction', 
    duration: '4.5-5 hours', 
    pricePerRoom: 200, 
    durationInHours: 5
  }
];

export type RoomType = typeof ROOM_TYPES[number];
