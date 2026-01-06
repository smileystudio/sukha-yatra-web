// Real Shivamogga coordinates based on Google Maps data
export const shivamogaCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Gvt Bus Stand': { lat: 13.9299, lng: 75.5681 },
  'Circuit House': { lat: 13.9318, lng: 75.5695 },
  'Market': { lat: 13.9287, lng: 75.5672 },
  'Shivamurthy Circle': { lat: 13.9275, lng: 75.5689 },
  'Gandhi Bazzar': { lat: 13.9265, lng: 75.5701 },
  'Kamala Nursing Home': { lat: 13.9395, lng: 75.5643 },
  'Usha Nursing Home': { lat: 13.9412, lng: 75.5628 },
  'Vinoba Nagara': { lat: 13.9342, lng: 75.5718 },
  'Gopala': { lat: 13.9201, lng: 75.5655 },
  'Gopi Circle': { lat: 13.9218, lng: 75.5668 },
  'Draupadamma Circle': { lat: 13.9248, lng: 75.5682 },
  'APMC': { lat: 13.9158, lng: 75.5785 },
  'Ragigudda': { lat: 13.9185, lng: 75.5695 },
  'Navle': { lat: 13.9485, lng: 75.5722 },
  'JNNC': { lat: 13.9378, lng: 75.5715 },
  'Sheshadri Puram': { lat: 13.9448, lng: 75.5655 },
  'Bommanakatte': { lat: 13.9325, lng: 75.5798 },
  'Savalanga Road': { lat: 13.9365, lng: 75.5602 },
  'Gurupura': { lat: 13.9352, lng: 75.5688 },
  'Tank Moholla': { lat: 13.9308, lng: 75.5658 },
  'Gandhi Nagara': { lat: 13.9255, lng: 75.5748 },
  'Nehru Stadium': { lat: 13.9385, lng: 75.5620 },
  'Karnataka Sangha': { lat: 13.9292, lng: 75.5712 },
  'Church': { lat: 13.9305, lng: 75.5685 },
  'Meenakshi Bhavana': { lat: 13.9322, lng: 75.5665 },
  'Harige': { lat: 13.9368, lng: 75.5755 },
  'Kashipura': { lat: 13.9282, lng: 75.5815 },
  'Lakshmi Talkies': { lat: 13.9225, lng: 75.5742 },
  'Nehru Road': { lat: 13.9310, lng: 75.5675 },
  'Jail Road': { lat: 13.9340, lng: 75.5640 },
  'Court Circle': { lat: 13.9375, lng: 75.5630 },
  'Meghan Hospital': { lat: 13.9308, lng: 75.5688 },
  'Town Hall': { lat: 13.9295, lng: 75.5678 },
  'Kote Area': { lat: 13.9285, lng: 75.5665 },
  'PG Hospital': { lat: 13.9315, lng: 75.5710 },
  'Tunga College': { lat: 13.9355, lng: 75.5695 },
};

// Define accurate routes between major locations in Shivamogga
// Each route contains the intermediate stops in order
export const shivamogaRoutes: { [key: string]: string[] } = {
  // From Gvt Bus Stand
  'Gvt Bus Stand -> Circuit House': [
    'Gvt Bus Stand',
    'Meghan Hospital',
    'Circuit House',
  ],
  'Gvt Bus Stand -> Usha Nursing Home': [
    'Gvt Bus Stand',
    'Gandhi Bazzar',
    'Nehru Road',
    'Jail Road',
    'Savalanga Road',
    'Court Circle',
    'Nehru Stadium',
    'Kamala Nursing Home',
    'Usha Nursing Home',
  ],
  'Gvt Bus Stand -> Kamala Nursing Home': [
    'Gvt Bus Stand',
    'Gandhi Bazzar',
    'Nehru Road',
    'Jail Road',
    'Savalanga Road',
    'Court Circle',
    'Nehru Stadium',
    'Kamala Nursing Home',
  ],
  'Gvt Bus Stand -> JNNC': [
    'Gvt Bus Stand',
    'Market',
    'Church',
    'Gurupura',
    'Vinoba Nagara',
    'JNNC',
  ],
  'Gvt Bus Stand -> Navle': [
    'Gvt Bus Stand',
    'Market',
    'Church',
    'Gurupura',
    'Vinoba Nagara',
    'JNNC',
    'Sheshadri Puram',
    'Navle',
  ],
  'Gvt Bus Stand -> APMC': [
    'Gvt Bus Stand',
    'Draupadamma Circle',
    'Gopala',
    'Gopi Circle',
    'Ragigudda',
    'APMC',
  ],
  'Gvt Bus Stand -> Market': [
    'Gvt Bus Stand',
    'Market',
  ],
  'Gvt Bus Stand -> Gandhi Bazzar': [
    'Gvt Bus Stand',
    'Gandhi Bazzar',
  ],
  'Gvt Bus Stand -> Gopala': [
    'Gvt Bus Stand',
    'Draupadamma Circle',
    'Gopala',
  ],

  // From Market
  'Market -> JNNC': [
    'Market',
    'Church',
    'Gurupura',
    'Vinoba Nagara',
    'JNNC',
  ],
  'Market -> Usha Nursing Home': [
    'Market',
    'Gandhi Bazzar',
    'Nehru Road',
    'Jail Road',
    'Savalanga Road',
    'Nehru Stadium',
    'Kamala Nursing Home',
    'Usha Nursing Home',
  ],
  'Market -> Gopala': [
    'Market',
    'Gvt Bus Stand',
    'Draupadamma Circle',
    'Gopala',
  ],

  // From Gandhi Bazzar
  'Gandhi Bazzar -> Usha Nursing Home': [
    'Gandhi Bazzar',
    'Nehru Road',
    'Jail Road',
    'Savalanga Road',
    'Court Circle',
    'Nehru Stadium',
    'Kamala Nursing Home',
    'Usha Nursing Home',
  ],
  'Gandhi Bazzar -> Kamala Nursing Home': [
    'Gandhi Bazzar',
    'Nehru Road',
    'Jail Road',
    'Savalanga Road',
    'Nehru Stadium',
    'Kamala Nursing Home',
  ],
  'Gandhi Bazzar -> Gvt Bus Stand': [
    'Gandhi Bazzar',
    'Gvt Bus Stand',
  ],

  // From JNNC
  'JNNC -> Gvt Bus Stand': [
    'JNNC',
    'Vinoba Nagara',
    'Gurupura',
    'Church',
    'Market',
    'Gvt Bus Stand',
  ],
  'JNNC -> APMC': [
    'JNNC',
    'Vinoba Nagara',
    'Bommanakatte',
    'APMC',
  ],
  'JNNC -> Usha Nursing Home': [
    'JNNC',
    'Sheshadri Puram',
    'Kamala Nursing Home',
    'Usha Nursing Home',
  ],

  // From Kamala Nursing Home
  'Kamala Nursing Home -> Gvt Bus Stand': [
    'Kamala Nursing Home',
    'Nehru Stadium',
    'Court Circle',
    'Savalanga Road',
    'Jail Road',
    'Nehru Road',
    'Gandhi Bazzar',
    'Gvt Bus Stand',
  ],
  'Kamala Nursing Home -> Market': [
    'Kamala Nursing Home',
    'Nehru Stadium',
    'Savalanga Road',
    'Jail Road',
    'Gandhi Bazzar',
    'Market',
  ],
  'Kamala Nursing Home -> Usha Nursing Home': [
    'Kamala Nursing Home',
    'Usha Nursing Home',
  ],

  // From Usha Nursing Home
  'Usha Nursing Home -> Gvt Bus Stand': [
    'Usha Nursing Home',
    'Kamala Nursing Home',
    'Nehru Stadium',
    'Court Circle',
    'Savalanga Road',
    'Jail Road',
    'Nehru Road',
    'Gandhi Bazzar',
    'Gvt Bus Stand',
  ],
  'Usha Nursing Home -> Market': [
    'Usha Nursing Home',
    'Kamala Nursing Home',
    'Nehru Stadium',
    'Savalanga Road',
    'Jail Road',
    'Nehru Road',
    'Gandhi Bazzar',
    'Market',
  ],
  'Usha Nursing Home -> JNNC': [
    'Usha Nursing Home',
    'Kamala Nursing Home',
    'Sheshadri Puram',
    'JNNC',
  ],

  // From Gopala
  'Gopala -> Gvt Bus Stand': [
    'Gopala',
    'Draupadamma Circle',
    'Gvt Bus Stand',
  ],
  'Gopala -> APMC': [
    'Gopala',
    'Gopi Circle',
    'Ragigudda',
    'APMC',
  ],
  'Gopala -> Market': [
    'Gopala',
    'Draupadamma Circle',
    'Gvt Bus Stand',
    'Market',
  ],

  // From APMC
  'APMC -> Gvt Bus Stand': [
    'APMC',
    'Ragigudda',
    'Gopi Circle',
    'Gopala',
    'Draupadamma Circle',
    'Gvt Bus Stand',
  ],
  'APMC -> JNNC': [
    'APMC',
    'Bommanakatte',
    'Vinoba Nagara',
    'JNNC',
  ],

  // From Vinoba Nagara
  'Vinoba Nagara -> Gvt Bus Stand': [
    'Vinoba Nagara',
    'Gurupura',
    'Church',
    'Market',
    'Gvt Bus Stand',
  ],
  'Vinoba Nagara -> JNNC': [
    'Vinoba Nagara',
    'JNNC',
  ],

  // From Navle
  'Navle -> Gvt Bus Stand': [
    'Navle',
    'Sheshadri Puram',
    'JNNC',
    'Vinoba Nagara',
    'Gurupura',
    'Church',
    'Market',
    'Gvt Bus Stand',
  ],

  // From Sheshadri Puram
  'Sheshadri Puram -> Gvt Bus Stand': [
    'Sheshadri Puram',
    'JNNC',
    'Vinoba Nagara',
    'Gurupura',
    'Church',
    'Market',
    'Gvt Bus Stand',
  ],
  'Sheshadri Puram -> Kamala Nursing Home': [
    'Sheshadri Puram',
    'Kamala Nursing Home',
  ],

  // Additional routes
  'Circuit House -> Market': [
    'Circuit House',
    'Gvt Bus Stand',
    'Market',
  ],
  'Church -> JNNC': [
    'Church',
    'Gurupura',
    'Vinoba Nagara',
    'JNNC',
  ],
  'Nehru Stadium -> Gvt Bus Stand': [
    'Nehru Stadium',
    'Court Circle',
    'Savalanga Road',
    'Jail Road',
    'Nehru Road',
    'Gandhi Bazzar',
    'Gvt Bus Stand',
  ],
};

// Function to get route between two locations
export function getRoute(from: string, to: string): string[] {
  const forwardRoute = `${from} -> ${to}`;
  const reverseRoute = `${to} -> ${from}`;
  
  // Check if direct route exists
  if (shivamogaRoutes[forwardRoute]) {
    return shivamogaRoutes[forwardRoute];
  }
  
  // Check if reverse route exists, then reverse it
  if (shivamogaRoutes[reverseRoute]) {
    return [...shivamogaRoutes[reverseRoute]].reverse();
  }
  
  // If no predefined route, return just from and to
  return [from, to];
}

// Function to get intermediate stops (excluding from and to)
export function getIntermediateStops(from: string, to: string): string[] {
  const route = getRoute(from, to);
  // Remove first and last items (from and to)
  return route.slice(1, -1);
}