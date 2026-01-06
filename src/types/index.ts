export interface Bus {
  id: string;
  operator: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  availableSeats: number;
  rating: number;
  amenities: string[];
}

export interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  bus: Bus;
  seats: string[];
  passengers: PassengerInfo[];
  totalAmount: number;
  bookingDate: string;
}

export interface PassengerInfo {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}
