import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize bus data with real-time information
const initializeBusData = async () => {
  const karnatakaBuses = [
    {
      id: 'KSRTC-001',
      operator: 'KSRTC',
      from: 'Bengaluru',
      to: 'Mysuru',
      departureTime: '6:00 AM',
      arrivalTime: '9:30 AM',
      duration: '3h 30m',
      price: 420,
      type: 'AC Seater',
      amenities: ['WiFi', 'Charging', 'AC'],
      availableSeats: 50,
      totalSeats: 50,
      delay: 0,
      currentLocation: 'Bengaluru',
      status: 'on-time'
    },
    {
      id: 'VRL-002',
      operator: 'VRL Travels',
      from: 'Bengaluru',
      to: 'Mangaluru',
      departureTime: '7:30 AM',
      arrivalTime: '11:00 AM',
      duration: '3h 30m',
      price: 450,
      type: 'AC Sleeper',
      amenities: ['WiFi', 'Charging', 'AC'],
      availableSeats: 48,
      totalSeats: 50,
      delay: 5,
      currentLocation: 'Near Bengaluru',
      status: 'delayed'
    },
    {
      id: 'BCS-003',
      operator: 'Bangalore City Bus Service',
      from: 'Bengaluru',
      to: 'Hubli',
      departureTime: '9:00 AM',
      arrivalTime: '1:00 PM',
      duration: '4h',
      price: 410,
      type: 'Non-AC Seater',
      amenities: ['Charging'],
      availableSeats: 45,
      totalSeats: 50,
      delay: 0,
      currentLocation: 'Bengaluru',
      status: 'on-time'
    },
    {
      id: 'SRS-004',
      operator: 'SRS Travels',
      from: 'Mysuru',
      to: 'Coorg',
      departureTime: '10:00 AM',
      arrivalTime: '1:45 PM',
      duration: '3h 45m',
      price: 430,
      type: 'AC Seater',
      amenities: ['WiFi', 'AC'],
      availableSeats: 50,
      totalSeats: 50,
      delay: 0,
      currentLocation: 'Mysuru',
      status: 'on-time'
    },
    {
      id: 'NWKRTC-005',
      operator: 'NWKRTC',
      from: 'Bengaluru',
      to: 'Belgaum',
      departureTime: '11:30 AM',
      arrivalTime: '3:15 PM',
      duration: '3h 45m',
      price: 440,
      type: 'AC Seater',
      amenities: ['WiFi', 'Charging', 'AC'],
      availableSeats: 47,
      totalSeats: 50,
      delay: 0,
      currentLocation: 'Bengaluru',
      status: 'on-time'
    }
  ];

  for (const bus of karnatakaBuses) {
    await kv.set(`bus:${bus.id}`, bus);
  }
};

// AI Assistant route with real-time bus information
app.post('/make-server-8b20e17b/ai-assistant', async (c) => {
  try {
    const { message } = await c.req.json();
    
    const lowerMessage = message.toLowerCase();
    
    // Shivamogga city areas and buses
    const shivamoggaAreas = [
      'gvt bus stand', 'circuit house', 'market', 'shivamurthy circle', 
      'gandhi bazzar', 'kamala nursing home', 'usha nursing home',
      'vinoba nagara', 'gopala', 'gopi circle', 'jnnc', 'navle',
      'sheshadri puram', 'apmc', 'nehru stadium', 'church'
    ];
    
    const buses = [
      { operator: 'Shashi Kumar', from: 'Gvt Bus Stand', to: 'Circuit House', time: '06:00', duration: '15m', price: 15, seats: 15 },
      { operator: 'Manjunatha', from: 'Gvt Bus Stand', to: 'Usha Nursing Home', time: '10:30', duration: '10m', price: 20, seats: 20 },
      { operator: 'Veerabhadreshwara', from: 'Market', to: 'JNNC', time: '15:00', duration: '10m', price: 10, seats: 12 },
      { operator: 'Ganesh Kripa', from: 'Gandhi Bazzar', to: 'Kamala Nursing Home', time: '20:00', duration: '5m', price: 10, seats: 18 },
      { operator: 'SBM', from: 'Gopala', to: 'APMC', time: '23:30', duration: '15m', price: 15, seats: 10 },
      { operator: 'Anjali', from: 'Gvt Bus Stand', to: 'Navle', time: '08:00', duration: '10m', price: 15, seats: 22 },
    ];
    
    // Query about specific area/location
    const foundArea = shivamoggaAreas.find(area => lowerMessage.includes(area));
    if (foundArea) {
      const areaBuses = buses.filter(bus => 
        bus.from.toLowerCase().includes(foundArea) || bus.to.toLowerCase().includes(foundArea)
      );
      
      if (areaBuses.length > 0) {
        const busInfo = areaBuses.map(bus => 
          `\n🚌 ${bus.operator}\n` +
          `   ${bus.from} → ${bus.to}\n` +
          `   Time: ${bus.time} | Duration: ${bus.duration}\n` +
          `   Fare: ₹${bus.price} | Seats: ${bus.seats}`
        ).join('\n');
        
        return c.json({
          response: `Buses for ${foundArea.toUpperCase()}:${busInfo}\n\nAll buses run within Shivamogga city. Would you like to track any of these buses?`
        });
      }
    }
    
    // Query about routes between two locations
    if (lowerMessage.includes('from') && lowerMessage.includes('to')) {
      const words = lowerMessage.split(/\s+/);
      const fromIdx = words.indexOf('from');
      const toIdx = words.indexOf('to');
      
      if (fromIdx !== -1 && toIdx !== -1 && toIdx > fromIdx) {
        const fromArea = words.slice(fromIdx + 1, toIdx).join(' ');
        const toArea = words.slice(toIdx + 1).join(' ').split('?')[0].trim();
        
        const matchingBuses = buses.filter(bus =>
          bus.from.toLowerCase().includes(fromArea) && bus.to.toLowerCase().includes(toArea)
        );
        
        if (matchingBuses.length > 0) {
          const busInfo = matchingBuses.map(bus =>
            `\n🚌 ${bus.operator}\n` +
            `   Time: ${bus.time} (${bus.duration})\n` +
            `   Fare: ₹${bus.price} | ${bus.seats} seats available`
          ).join('\n');
          
          return c.json({
            response: `Buses from ${fromArea.toUpperCase()} to ${toArea.toUpperCase()}:${busInfo}\n\nClick 'Track' to see live location!`
          });
        } else {
          return c.json({
            response: `No direct buses found from ${fromArea} to ${toArea}. Try searching for buses from nearby areas like Gvt Bus Stand or Market.`
          });
        }
      }
    }
    
    // Query about bus availability
    if (lowerMessage.includes('bus') && (lowerMessage.includes('available') || lowerMessage.includes('list'))) {
      const busInfo = buses.map(bus =>
        `\n🚌 ${bus.operator}: ${bus.from} → ${bus.to}\n` +
        `   ${bus.time} | ₹${bus.price} | ${bus.seats} seats`
      ).join('\n');
      
      return c.json({
        response: `Currently available buses in Shivamogga:${busInfo}\n\nAll buses have live GPS tracking! 📍`
      });
    }
    
    // Query about timings
    if (lowerMessage.includes('timing') || lowerMessage.includes('schedule') || lowerMessage.includes('time')) {
      const busInfo = buses.map(bus =>
        `${bus.time} - ${bus.operator} (${bus.from} to ${bus.to})`
      ).join('\n');
      
      return c.json({
        response: `Today's bus schedule:\n\n${busInfo}\n\nAll timings are in 24-hour format. Buses run throughout the day in Shivamogga city.`
      });
    }
    
    // Query about prices/fare
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fare')) {
      return c.json({
        response: `Shivamogga city bus fares:\n\n` +
          `💰 ₹10-20 for intra-city travel\n` +
          `⏱️ 5-15 minutes journey time\n` +
          `🚌 6 operators available\n` +
          `📍 Real-time tracking included\n\n` +
          `All fares are updated in real-time. Which route would you like?`
      });
    }
    
    // Query about crowd/seats
    if (lowerMessage.includes('crowd') || lowerMessage.includes('seat') || lowerMessage.includes('available')) {
      return c.json({
        response: `Real-time seat availability:\n\n` +
          `✅ Shashi Kumar: 15 seats\n` +
          `✅ Manjunatha: 20 seats\n` +
          `✅ Anjali: 22 seats (Low crowd)\n` +
          `⚠️ Veerabhadreshwara: 12 seats\n` +
          `⚠️ SBM: 10 seats (Medium crowd)\n\n` +
          `Track any bus to see live crowd reports! 🚌`
      });
    }
    
    // Query about tracking
    if (lowerMessage.includes('track') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return c.json({
        response: `🗺️ Live Bus Tracking:\n\n` +
          `All our buses have real-time GPS tracking! You can:\n` +
          `📍 See bus location on Google Maps\n` +
          `⏰ Get accurate ETA updates\n` +
          `🛣️ View route with intermediate stops\n` +
          `👥 Check crowd levels live\n\n` +
          `Select any bus and click 'Track' to start!`
      });
    }
    
    // Default greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return c.json({
        response: `Namaste! 🙏 Welcome to SUKHA YATRA - Shivamogga City Bus Service!\n\n` +
          `I can help you with:\n` +
          `🚌 Finding intra-city buses\n` +
          `⏰ Real-time bus schedules\n` +
          `💰 Fare information (₹10-20)\n` +
          `📍 Live bus tracking with GPS\n` +
          `👥 Crowd reports\n` +
          `🗺️ Route information\n\n` +
          `Try asking: "Buses from Gvt Bus Stand to Circuit House" or "Show available buses"`
      });
    }
    
    // Default response
    return c.json({
      response: `I'm your SUKHA YATRA AI assistant for Shivamogga city buses! 🚌\n\n` +
        `I can help you with:\n` +
        `• Bus availability between areas\n` +
        `• Live timings and schedules\n` +
        `• Seat availability and crowd reports\n` +
        `• Fare information (₹10-20)\n` +
        `• Real-time GPS tracking\n` +
        `• Route details with stops\n\n` +
        `Try asking: "Which buses go to JNNC?" or "Show bus timings"`
    });
  } catch (error) {
    console.error('AI Assistant error:', error);
    return c.json({ response: 'I apologize, but I encountered an error. Please try again.' }, 500);
  }
});

// Get real-time bus information
app.get('/make-server-8b20e17b/buses', async (c) => {
  try {
    const from = c.req.query('from');
    const to = c.req.query('to');
    
    const allBuses = await kv.getByPrefix('bus:');
    
    let filteredBuses = allBuses;
    if (from && to) {
      filteredBuses = allBuses.filter((bus: any) => 
        bus.from.toLowerCase().includes(from.toLowerCase()) &&
        bus.to.toLowerCase().includes(to.toLowerCase())
      );
    }
    
    return c.json({ buses: filteredBuses });
  } catch (error) {
    console.error('Error fetching buses:', error);
    return c.json({ error: 'Failed to fetch buses' }, 500);
  }
});

// Get seat availability (real-time)
app.get('/make-server-8b20e17b/seats/:busId', async (c) => {
  try {
    const { busId } = c.req.param();
    const bus = await kv.get(`bus:${busId}`);
    
    if (!bus) {
      return c.json({ error: 'Bus not found' }, 404);
    }
    
    // Get reserved seats
    const reservedSeats = await kv.get(`seats:${busId}`) || [];
    
    return c.json({
      totalSeats: bus.totalSeats,
      availableSeats: bus.availableSeats,
      reservedSeats
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return c.json({ error: 'Failed to fetch seat information' }, 500);
  }
});

// Reserve seats (real-time update)
app.post('/make-server-8b20e17b/seats/reserve', async (c) => {
  try {
    const { busId, seats } = await c.req.json();
    
    const bus = await kv.get(`bus:${busId}`);
    if (!bus) {
      return c.json({ error: 'Bus not found' }, 404);
    }
    
    const reservedSeats = await kv.get(`seats:${busId}`) || [];
    const newReservedSeats = [...reservedSeats, ...seats];
    
    // Update reserved seats
    await kv.set(`seats:${busId}`, newReservedSeats);
    
    // Update available seats count
    bus.availableSeats = bus.totalSeats - newReservedSeats.length;
    await kv.set(`bus:${busId}`, bus);
    
    return c.json({ success: true, reservedSeats: newReservedSeats });
  } catch (error) {
    console.error('Error reserving seats:', error);
    return c.json({ error: 'Failed to reserve seats' }, 500);
  }
});

// Update bus location and status (simulated GPS)
app.post('/make-server-8b20e17b/bus/update-location', async (c) => {
  try {
    const { busId, location, delay, status } = await c.req.json();
    
    const bus = await kv.get(`bus:${busId}`);
    if (!bus) {
      return c.json({ error: 'Bus not found' }, 404);
    }
    
    bus.currentLocation = location;
    bus.delay = delay || 0;
    bus.status = status || 'on-time';
    
    await kv.set(`bus:${busId}`, bus);
    
    return c.json({ success: true, bus });
  } catch (error) {
    console.error('Error updating bus location:', error);
    return c.json({ error: 'Failed to update bus location' }, 500);
  }
});

// Initialize data on startup
await initializeBusData();

// Start bus location simulation (updates every 30 seconds)
setInterval(async () => {
  const buses = await kv.getByPrefix('bus:');
  for (const bus of buses) {
    // Simulate random delays occasionally
    const hasDelay = Math.random() < 0.2; // 20% chance of delay
    const delay = hasDelay ? Math.floor(Math.random() * 15) : 0;
    
    // Update location based on time
    const locations = [`Near ${bus.from}`, 'On Route', `Approaching ${bus.to}`, bus.to];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    bus.currentLocation = randomLocation;
    bus.delay = delay;
    bus.status = delay > 0 ? 'delayed' : 'on-time';
    
    await kv.set(`bus:${bus.id}`, bus);
  }
}, 30000); // Update every 30 seconds

Deno.serve(app.fetch);