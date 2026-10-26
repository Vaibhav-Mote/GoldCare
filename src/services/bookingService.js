import { getBookings, getSettings, saveSettings, saveShops, saveBookings } from './localStorageService';

// ---- Booking ID Generator ----

export const generateBookingId = () => {
  const bookings = getBookings();
  const year = new Date().getFullYear();
  const prefix = `GC-${year}-`;
  // Find highest number used this year
  const yearBookings = bookings.filter((b) => b.bookingId && b.bookingId.startsWith(prefix));
  let max = 0;
  yearBookings.forEach((b) => {
    const num = parseInt(b.bookingId.replace(prefix, ''), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  const next = max + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

// ---- Demo Data Seeds ----

const DEMO_SHOPS = [
  {
    id: 'shop-001',
    name: 'Raj Gold Works',
    owner: 'Rajesh Kumar',
    contact: '9876543210',
    email: 'raj@goldworks.in',
    address: '12, MG Road, Near Bus Stand',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    description: 'A legacy jewellery repair shop serving customers since 1978. Specialising in gold, silver, and diamond jewellery repair with master craftsmen.',
    services: ['Gold Ring Repair', 'Gold Chain Repair', 'Diamond Jewellery Repair', 'Jewellery Polishing', 'Stone Replacement'],
    openTime: '09:00',
    closeTime: '20:00',
    closingDay: 'Sunday',
    status: 'active',
    image: '',
    rating: 4.8,
    reviews: 312,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-002',
    name: 'Shree Jewellers',
    owner: 'Suresh Mehta',
    contact: '9123456789',
    email: 'shree@jewellers.in',
    address: '45, Laxmi Bazaar, Chandni Chowk',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110006',
    description: 'Premium jewellery repair and customisation studio offering services for all types of precious metal jewellery including antique restoration.',
    services: ['Necklace Repair', 'Bracelet Repair', 'Earring Repair', 'Jewellery Cleaning', 'Custom Jewellery Repair'],
    openTime: '10:00',
    closeTime: '19:00',
    closingDay: 'Monday',
    status: 'active',
    image: '',
    rating: 4.6,
    reviews: 245,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-003',
    name: 'Diamond Touch Studio',
    owner: 'Priya Nair',
    contact: '9988776655',
    email: 'diamond.touch@gmail.com',
    address: '7, Brigade Road, Opposite Forum Mall',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560025',
    description: 'Modern jewellery repair studio specialising in diamond settings, gemstone replacement, and contemporary jewellery restoration services.',
    services: ['Diamond Jewellery Repair', 'Stone Replacement', 'Gold Ring Repair', 'Jewellery Polishing', 'Earring Repair'],
    openTime: '11:00',
    closeTime: '21:00',
    closingDay: 'Tuesday',
    status: 'active',
    image: '',
    rating: 4.9,
    reviews: 189,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-004',
    name: 'Heritage Jewel Craft',
    owner: 'Amit Shah',
    contact: '9011223344',
    email: 'heritage@jewelcraft.in',
    address: '22, Law Garden Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380006',
    description: 'Three generations of master jewellers providing expert repair, restoration, and polishing for heritage and modern jewellery pieces.',
    services: ['Gold Chain Repair', 'Bracelet Repair', 'Jewellery Cleaning', 'Jewellery Polishing', 'Custom Jewellery Repair'],
    openTime: '09:30',
    closeTime: '18:30',
    closingDay: 'Wednesday',
    status: 'active',
    image: '',
    rating: 4.7,
    reviews: 421,
    createdAt: new Date().toISOString(),
  },
];

const DEMO_BOOKINGS = [
  {
    id: 'b001',
    bookingId: 'GC-2026-0001',
    customerName: 'Anjali Sharma',
    mobile: '9876501234',
    email: 'anjali.sharma@email.com',
    jewelleryType: 'Gold Ring',
    repairService: 'Gold Ring Repair',
    shopId: 'shop-001',
    shopName: 'Raj Gold Works',
    description: 'My grandmother\'s gold ring has a bent band and needs reshaping. Also minor polish required.',
    appointmentDate: '2026-11-05',
    appointmentTime: '10:00',
    budget: '1500',
    instructions: 'Please handle carefully, it has sentimental value.',
    status: 'Confirmed',
    adminRemarks: 'Appointment confirmed. Please bring the ring on time.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    image: '',
  },
  {
    id: 'b002',
    bookingId: 'GC-2026-0002',
    customerName: 'Ravi Patel',
    mobile: '9123467890',
    email: 'ravi.patel@email.com',
    jewelleryType: 'Gold Chain',
    repairService: 'Gold Chain Repair',
    shopId: 'shop-002',
    shopName: 'Shree Jewellers',
    description: 'Gold chain has a broken link near the clasp. Need it soldered and clasp replaced.',
    appointmentDate: '2026-11-03',
    appointmentTime: '14:00',
    budget: '800',
    instructions: '22 karat gold chain, approx 18 inches.',
    status: 'In Progress',
    adminRemarks: 'Work started. Expected completion in 2 days.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    image: '',
  },
  {
    id: 'b003',
    bookingId: 'GC-2026-0003',
    customerName: 'Meena Reddy',
    mobile: '9988001122',
    email: 'meena.r@email.com',
    jewelleryType: 'Diamond Ring',
    repairService: 'Diamond Jewellery Repair',
    shopId: 'shop-003',
    shopName: 'Diamond Touch Studio',
    description: 'Diamond solitaire ring – one prong is loose and the diamond seems slightly unstable.',
    appointmentDate: '2026-11-10',
    appointmentTime: '11:30',
    budget: '3500',
    instructions: 'Please inspect all prongs while you are at it.',
    status: 'Pending',
    adminRemarks: '',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    image: '',
  },
  {
    id: 'b004',
    bookingId: 'GC-2026-0004',
    customerName: 'Sunil Verma',
    mobile: '9011001100',
    email: 'sunilv@email.com',
    jewelleryType: 'Bracelet',
    repairService: 'Bracelet Repair',
    shopId: 'shop-004',
    shopName: 'Heritage Jewel Craft',
    description: 'Gold bracelet with a broken lock mechanism. Needs a new lock fitted.',
    appointmentDate: '2026-10-28',
    appointmentTime: '15:00',
    budget: '600',
    instructions: '',
    status: 'Completed',
    adminRemarks: 'Repair completed. New clasp fitted. Ready for pickup.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    image: '',
  },
  {
    id: 'b005',
    bookingId: 'GC-2026-0005',
    customerName: 'Priya Nambiar',
    mobile: '9445566778',
    email: 'priya.n@email.com',
    jewelleryType: 'Necklace',
    repairService: 'Necklace Repair',
    shopId: 'shop-002',
    shopName: 'Shree Jewellers',
    description: 'Antique gold necklace with broken central pendant connection. Needs careful repair.',
    appointmentDate: '2026-11-12',
    appointmentTime: '10:30',
    budget: '2000',
    instructions: 'This is a family heirloom. Please be very careful.',
    status: 'Pending',
    adminRemarks: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    image: '',
  },
];

export const initializeDemoData = () => {
  const settings = getSettings();
  if (!settings.demoDataLoaded) {
    saveShops(DEMO_SHOPS);
    saveBookings(DEMO_BOOKINGS);
    saveSettings({ ...settings, demoDataLoaded: true });
  }
};

export const getDemoShops = () => DEMO_SHOPS;
export const getDemoBookings = () => DEMO_BOOKINGS;
