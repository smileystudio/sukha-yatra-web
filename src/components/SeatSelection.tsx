import { useState } from 'react';
import { ArrowLeft, Circle } from 'lucide-react';
import { Bus } from '../types';

interface SeatSelectionProps {
  bus: Bus;
  onConfirm: (seats: string[]) => void;
  onBack: () => void;
}

export function SeatSelection({ bus, onConfirm, onBack }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Generate seat layout (50 seats - 10 rows with A, B, C, D, E columns)
  const generateSeats = () => {
    const seats = [];
    const bookedSeats = ['A2', 'B3', 'C1', 'D4', 'E5', 'A7', 'C8', 'D9', 'E2'];

    for (let row = 1; row <= 10; row++) {
      const rowSeats = [];
      for (const col of ['A', 'B', '', 'C', 'D', 'E']) {
        if (col === '') {
          rowSeats.push({ id: '', type: 'aisle' });
        } else {
          const seatId = `${col}${row}`;
          rowSeats.push({
            id: seatId,
            type: 'seat',
            isBooked: bookedSeats.includes(seatId),
          });
        }
      }
      seats.push(rowSeats);
    }
    return seats;
  };

  const seats = generateSeats();

  const toggleSeat = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const getSeatClass = (seat: any) => {
    if (seat.type === 'aisle') return '';
    if (seat.isBooked) return 'bg-gray-400 cursor-not-allowed';
    if (selectedSeats.includes(seat.id)) return 'bg-indigo-600 text-white';
    return 'bg-gray-100 hover:bg-indigo-100 cursor-pointer';
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Buses
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-2 text-gray-900">{bus.operator}</h2>
          <p className="text-gray-600">{bus.type}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl mb-6 text-gray-900">Select Your Seats</h3>

            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Circle className="w-6 h-6 text-gray-600" />
                <span className="text-gray-600">Driver</span>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {row.map((seat, seatIndex) => (
                    <div key={seatIndex}>
                      {seat.type === 'aisle' ? (
                        <div className="w-12 h-12"></div>
                      ) : (
                        <button
                          onClick={() => toggleSeat(seat.id, seat.isBooked)}
                          disabled={seat.isBooked}
                          className={`w-12 h-12 rounded-lg border-2 border-gray-300 transition-colors flex items-center justify-center text-sm ${getSeatClass(
                            seat
                          )}`}
                          title={
                            seat.isBooked
                              ? 'Booked'
                              : selectedSeats.includes(seat.id)
                              ? 'Selected'
                              : 'Available'
                          }
                        >
                          {seat.id}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded-lg"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 border-2 border-gray-300 rounded-lg"></div>
                <span className="text-gray-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-400 border-2 border-gray-300 rounded-lg"></div>
                <span className="text-gray-600">Booked</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-xl mb-4 text-gray-900">Booking Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Selected Seats:</span>
                <span>{selectedSeats.length}</span>
              </div>
              {selectedSeats.length > 0 && (
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Price per seat:</span>
                <span>₹{bus.price}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span>Total Amount:</span>
                <span className="text-2xl text-indigo-600">
                  ₹{selectedSeats.length * bus.price}
                </span>
              </div>
            </div>

            <button
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
            >
              Continue to Passenger Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}