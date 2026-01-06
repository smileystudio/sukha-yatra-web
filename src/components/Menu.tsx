import { useState, useRef, useEffect } from 'react';
import { Menu as MenuIcon, X, Info, HelpCircle, Clock, Languages, Phone, Mail, Bot } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation, languages } from '../utils/translations';

interface MenuProps {
  onClose?: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function Menu({ onClose }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your SUKHA YATRA assistant. I can help you with real-time bus information, timings, seat availability, and booking assistance. What would you like to know?'
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen && onClose) {
      onClose();
    }
  };

  const showSection = (section: string) => {
    setSelectedSection(section);
  };

  const closeSection = () => {
    setSelectedSection(null);
  };

  const timetableData = [
    {
      operator: 'KSRTC',
      routes: [
        { from: 'Bengaluru', to: 'Mysuru', times: ['06:00 AM', '10:30 AM', '03:00 PM', '08:00 PM'] },
        { from: 'Bengaluru', to: 'Mangaluru', times: ['07:00 AM', '11:00 AM', '04:00 PM', '09:00 PM'] },
        { from: 'Mysuru', to: 'Coorg', times: ['08:00 AM', '02:00 PM', '06:00 PM'] },
      ],
    },
    {
      operator: 'VRL Travels',
      routes: [
        { from: 'Bengaluru', to: 'Hubli', times: ['09:00 AM', '02:00 PM', '07:00 PM', '11:00 PM'] },
        { from: 'Bengaluru', to: 'Belgaum', times: ['08:30 AM', '01:30 PM', '06:30 PM'] },
      ],
    },
    {
      operator: 'SRS Travels',
      routes: [
        { from: 'Bengaluru', to: 'Udupi', times: ['06:30 AM', '12:00 PM', '05:00 PM'] },
        { from: 'Mangaluru', to: 'Bengaluru', times: ['07:00 AM', '01:00 PM', '08:00 PM'] },
      ],
    },
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;
    
    const userMessage = messageInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setMessageInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8b20e17b/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    let message = '';
    if (action === 'availability') message = 'Show me available buses';
    else if (action === 'track') message = 'How do I track my booking?';
    else if (action === 'cancel') message = 'How do I cancel a ticket?';
    else if (action === 'routes') message = 'What are the popular routes?';
    
    setMessageInput(message);
    await handleSendMessage();
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-lg transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Menu Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleMenu}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="p-6">
              <div className="mb-8 mt-12">
                <h2 className="text-3xl text-indigo-900">SUKHA YATRA</h2>
                <p className="text-gray-600">Your Travel Companion</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => showSection('about')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Info className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">About SUKHA YATRA</span>
                </button>

                <button
                  onClick={() => showSection('help')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Help</span>
                </button>

                <button
                  onClick={() => showSection('timetable')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Bus Time Tables</span>
                </button>

                <button
                  onClick={() => showSection('language')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Languages className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Language Selection</span>
                </button>

                <button
                  onClick={() => showSection('contact')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Call Center</span>
                </button>

                <button
                  onClick={() => showSection('mail')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">Email Support</span>
                </button>

                <button
                  onClick={() => showSection('ai')}
                  className="w-full flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50 transition-colors text-left"
                >
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-700">AI Assistant</span>
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Content Modal */}
      {selectedSection && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeSection}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h3 className="text-2xl text-gray-900">
                  {selectedSection === 'about' && 'About SUKHA YATRA'}
                  {selectedSection === 'help' && 'Help & Support'}
                  {selectedSection === 'timetable' && 'Bus Time Tables'}
                  {selectedSection === 'language' && 'Select Language'}
                  {selectedSection === 'contact' && 'Call Center'}
                  {selectedSection === 'mail' && 'Email Support'}
                  {selectedSection === 'ai' && 'AI Assistant'}
                </h3>
                <button
                  onClick={closeSection}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {selectedSection === 'about' && (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Welcome to <strong>SUKHA YATRA</strong>, your trusted bus booking platform for Karnataka!
                    </p>
                    <p className="text-gray-700">
                      We provide seamless bus ticket booking services across Karnataka, connecting major cities like Bengaluru, Mysuru, Mangaluru, Hubli, and more.
                    </p>
                    <h4 className="text-lg text-gray-900 mt-4">Our Services:</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Easy online booking</li>
                      <li>Live location tracking</li>
                      <li>Multiple bus operators (Government & Private)</li>
                      <li>Affordable pricing (₹400-450)</li>
                      <li>Real-time seat availability</li>
                      <li>Secure payment options</li>
                    </ul>
                    <p className="text-gray-700 mt-4">
                      Experience comfortable and safe journeys with SUKHA YATRA - making travel a pleasant experience!
                    </p>
                  </div>
                )}

                {selectedSection === 'help' && (
                  <div className="space-y-4">
                    <h4 className="text-lg text-gray-900">Frequently Asked Questions</h4>
                    
                    <div className="border-b pb-4">
                      <h5 className="text-gray-900 mb-2">How do I book a ticket?</h5>
                      <p className="text-gray-600">
                        1. Enter your departure and destination cities<br />
                        2. Select your travel date<br />
                        3. Choose a bus from available options<br />
                        4. Select your preferred seats<br />
                        5. Enter passenger details<br />
                        6. Confirm and make payment
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h5 className="text-gray-900 mb-2">Can I cancel my booking?</h5>
                      <p className="text-gray-600">
                        Yes, you can cancel your booking up to 2 hours before departure. Cancellation charges may apply.
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h5 className="text-gray-900 mb-2">How do I get my ticket?</h5>
                      <p className="text-gray-600">
                        After successful booking, you will receive your e-ticket via SMS and email. You can show the digital ticket to the bus driver.
                      </p>
                    </div>

                    <div>
                      <h5 className="text-gray-900 mb-2">What payment methods are accepted?</h5>
                      <p className="text-gray-600">
                        We accept UPI, Credit/Debit Cards, Net Banking, and digital wallets.
                      </p>
                    </div>
                  </div>
                )}

                {selectedSection === 'timetable' && (
                  <div className="space-y-6">
                    {timetableData.map((operator, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h4 className="text-lg text-indigo-900 mb-3">{operator.operator}</h4>
                        <div className="space-y-3">
                          {operator.routes.map((route, routeIdx) => (
                            <div key={routeIdx} className="bg-gray-50 p-3 rounded">
                              <div className="text-gray-900 mb-2">
                                {route.from} → {route.to}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {route.times.map((time, timeIdx) => (
                                  <span
                                    key={timeIdx}
                                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSection === 'language' && (
                  <div className="space-y-3">
                    <p className="text-gray-600 mb-4">Select your preferred language:</p>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          closeSection();
                        }}
                        className={`w-full p-4 border-2 ${
                          language === lang.code
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-300'
                        } rounded-lg text-left hover:bg-gray-50 transition-colors`}
                      >
                        <span className="text-gray-900">{lang.nativeName} ({lang.name})</span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedSection === 'contact' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-6 rounded-lg text-center">
                      <Phone className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                      <h4 className="text-xl text-gray-900 mb-2">24/7 Customer Support</h4>
                      <a
                        href="tel:1800-123-4567"
                        className="text-3xl text-indigo-600 hover:text-indigo-700"
                      >
                        1800-123-4567
                      </a>
                      <p className="text-gray-600 mt-2">Toll-free number</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="text-gray-900 mb-2">Regional Support Numbers:</h5>
                      <ul className="space-y-2 text-gray-600">
                        <li>Bengaluru: 080-2345-6789</li>
                        <li>Mysuru: 0821-234-5678</li>
                        <li>Mangaluru: 0824-234-5678</li>
                        <li>Hubli: 0836-234-5678</li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedSection === 'mail' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-6 rounded-lg text-center">
                      <Mail className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                      <h4 className="text-xl text-gray-900 mb-2">Email Support</h4>
                      <a
                        href="mailto:support@sukhayatra.com"
                        className="text-xl text-indigo-600 hover:text-indigo-700"
                      >
                        support@sukhayatra.com
                      </a>
                      <p className="text-gray-600 mt-2">We respond within 24 hours</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="text-gray-900 mb-2">For specific queries:</h5>
                      <ul className="space-y-2 text-gray-600">
                        <li>Booking Issues: bookings@sukhayatra.com</li>
                        <li>Refunds: refunds@sukhayatra.com</li>
                        <li>Feedback: feedback@sukhayatra.com</li>
                        <li>Corporate Bookings: corporate@sukhayatra.com</li>
                      </ul>
                    </div>
                  </div>
                )}

                {selectedSection === 'ai' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg text-center">
                      <Bot className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                      <h4 className="text-xl text-gray-900 mb-2">AI Assistant</h4>
                      <p className="text-gray-600">Get instant help from our AI-powered assistant</p>
                    </div>

                    <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`bg-${msg.role === 'user' ? 'gray-100' : 'indigo-50'} p-3 rounded-lg`}>
                            <p className="text-sm text-gray-600">{msg.role === 'user' ? 'You' : 'AI Assistant'}</p>
                            <p className="text-gray-900">
                              {msg.content}
                            </p>
                          </div>
                        ))}
                        <div ref={chatEndRef}></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send'}
                      </button>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-gray-900 mb-2">Quick Actions:</h5>
                      <div className="flex gap-2">
                        <button
                          className="bg-indigo-50 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          onClick={() => handleQuickAction('availability')}
                        >
                          Check Availability
                        </button>
                        <button
                          className="bg-indigo-50 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          onClick={() => handleQuickAction('track')}
                        >
                          Track Booking
                        </button>
                        <button
                          className="bg-indigo-50 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          onClick={() => handleQuickAction('cancel')}
                        >
                          Cancel Ticket
                        </button>
                        <button
                          className="bg-indigo-50 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          onClick={() => handleQuickAction('routes')}
                        >
                          Popular Routes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}