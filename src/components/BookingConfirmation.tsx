import { CheckCircle, Download, Home } from 'lucide-react';
import { Booking } from '../types';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
}

export function BookingConfirmation({ booking, onNewBooking }: BookingConfirmationProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Booking Confirmed!</h1>
          <p className="text-gray-600">Your bus ticket has been successfully booked</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl mb-4 text-gray-900">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Booking ID:</span>
                <div className="text-lg text-indigo-600">{booking.id}</div>
              </div>
              <div>
                <span className="text-gray-600">Booking Date:</span>
                <div>{new Date(booking.bookingDate).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg mb-3 text-gray-900">Journey Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">From:</span>
                <span>{booking.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span>{booking.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span>{booking.bus.departureTime}</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg mb-3 text-gray-900">Bus Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Operator:</span>
                <span>{booking.bus.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bus Type:</span>
                <span>{booking.bus.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span>{booking.seats.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg mb-3 text-gray-900">Passenger Details</h3>
            <div className="space-y-3">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <div>{passenger.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Age:</span>
                      <div>{passenger.age}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span>
                      <div>{passenger.gender}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount Paid:</span>
              <span className="text-3xl text-indigo-600">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 py-3 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button
            onClick={onNewBooking}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Book Another Ticket
          </button>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Important:</strong> Please arrive at the boarding point at least 15 minutes
            before departure time. Carry a valid ID proof along with this ticket.
          </p>
        </div>
      </div>
    </div>
  );
}