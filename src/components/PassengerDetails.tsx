import { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';

interface PassengerDetailsProps {
  seatCount: number;
  totalAmount: number;
  onConfirm: (passengers: any[]) => void;
  onBack: () => void;
}

export function PassengerDetails({
  seatCount,
  totalAmount,
  onConfirm,
  onBack,
}: PassengerDetailsProps) {
  const [passengers, setPassengers] = useState(
    Array.from({ length: seatCount }, () => ({
      name: '',
      age: '',
      gender: '',
      phone: '',
    }))
  );

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(passengers);
  };

  const isFormValid = passengers.every((p) => p.name && p.age && p.gender && p.phone);

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Seat Selection
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-2 text-gray-900">Passenger Details</h2>
          <p className="text-gray-600">Please enter details for all passengers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((passenger, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg text-gray-900">Passenger {index + 1}</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Age</label>
                  <input
                    type="number"
                    value={passenger.age}
                    onChange={(e) => handleChange(index, 'age', e.target.value)}
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Age"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Gender</label>
                  <select
                    value={passenger.gender}
                    onChange={(e) => handleChange(index, 'gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-2 text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl mb-4 text-gray-900">Payment Summary</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Number of Passengers:</span>
                <span>{seatCount}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg">Total Amount:</span>
                <span className="text-2xl text-indigo-600">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg transition-colors"
            >
              Confirm Booking
            </button>

            <p className="mt-4 text-center text-gray-500 text-sm">
              By confirming, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}