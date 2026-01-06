import { useState } from 'react';
import { ArrowLeft, Smartphone, QrCode, CreditCard, Building2, Wallet } from 'lucide-react';
import { Booking } from '../types';

interface PaymentProps {
  booking: Booking;
  onConfirm: () => void;
  onBack: () => void;
}

export function Payment({ booking, onConfirm, onBack }: PaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onConfirm();
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Passenger Details
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-2 text-gray-900">Payment</h2>
          <p className="text-gray-600">Complete your booking with secure payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl mb-4 text-gray-900">Select Payment Method</h3>

              <div className="space-y-3 mb-6">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="text-gray-900">UPI</div>
                      <div className="text-sm text-gray-600">Pay using UPI ID</div>
                    </div>
                  </div>
                </button>

                {/* QR Code Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('qr')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === 'qr'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="text-gray-900">Scan QR Code</div>
                      <div className="text-sm text-gray-600">Pay using any UPI app</div>
                    </div>
                  </div>
                </button>

                {/* Cards Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                    </div>
                  </div>
                </button>

                {/* Net Banking Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="text-gray-900">Net Banking</div>
                      <div className="text-sm text-gray-600">All major banks</div>
                    </div>
                  </div>
                </button>

                {/* Wallet Option */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('wallet')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === 'wallet'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-indigo-600" />
                    <div>
                      <div className="text-gray-900">Digital Wallets</div>
                      <div className="text-sm text-gray-600">Paytm, PhonePe, Google Pay</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* UPI Details Form */}
              {selectedMethod === 'upi' && (
                <form onSubmit={handlePayment} className="space-y-4 bg-indigo-50 p-4 rounded-lg">
                  <div>
                    <label className="block mb-2 text-gray-700">Enter UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg transition-colors"
                  >
                    {processing ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
                  </button>
                </form>
              )}

              {/* QR Code Display */}
              {selectedMethod === 'qr' && (
                <div className="bg-indigo-50 p-6 rounded-lg text-center">
                  <div className="bg-white p-4 rounded-lg inline-block mb-4">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">Scan this QR code with any UPI app</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                  </p>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    {processing ? 'Verifying Payment...' : 'I have completed the payment'}
                  </button>
                </div>
              )}

              {/* Other Payment Methods */}
              {(selectedMethod === 'card' || selectedMethod === 'netbanking' || selectedMethod === 'wallet') && (
                <div className="bg-indigo-50 p-6 rounded-lg text-center">
                  <p className="text-gray-700 mb-4">
                    You will be redirected to complete your payment securely
                  </p>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    {processing ? 'Processing...' : `Proceed to Pay ₹${booking.totalAmount}`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h3 className="text-xl mb-4 text-gray-900">Payment Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare:</span>
                <span>₹{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Convenience Fee:</span>
                <span>₹0</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg">Total Amount:</span>
                <span className="text-2xl text-indigo-600">₹{booking.totalAmount}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm">
                🔒 Your payment is 100% secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}