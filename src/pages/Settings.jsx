import { useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Trash2, Shield, Info, CheckCircle } from 'lucide-react';
import {
  resetAllData,
  saveShops,
  saveBookings,
  saveSettings,
  getSettings,
} from '../services/localStorageService';

// Inline demo data
const DEMO_SHOPS = [
  {
    id: 'shop-001', name: 'Raj Gold Works', owner: 'Rajesh Kumar', contact: '9876543210',
    email: 'raj@goldworks.in', address: '12, MG Road, Near Bus Stand', city: 'Mumbai',
    state: 'Maharashtra', pincode: '400001',
    description: 'A legacy jewellery repair shop serving customers since 1978.',
    services: ['Gold Ring Repair', 'Gold Chain Repair', 'Diamond Jewellery Repair', 'Jewellery Polishing', 'Stone Replacement'],
    openTime: '09:00', closeTime: '20:00', closingDay: 'Sunday', status: 'active',
    image: '', rating: 4.8, reviews: 312, createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-002', name: 'Shree Jewellers', owner: 'Suresh Mehta', contact: '9123456789',
    email: 'shree@jewellers.in', address: '45, Laxmi Bazaar, Chandni Chowk', city: 'Delhi',
    state: 'Delhi', pincode: '110006',
    description: 'Premium jewellery repair and customisation studio.',
    services: ['Necklace Repair', 'Bracelet Repair', 'Earring Repair', 'Jewellery Cleaning', 'Custom Jewellery Repair'],
    openTime: '10:00', closeTime: '19:00', closingDay: 'Monday', status: 'active',
    image: '', rating: 4.6, reviews: 245, createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-003', name: 'Diamond Touch Studio', owner: 'Priya Nair', contact: '9988776655',
    email: 'diamond.touch@gmail.com', address: '7, Brigade Road, Opposite Forum Mall', city: 'Bangalore',
    state: 'Karnataka', pincode: '560025',
    description: 'Modern jewellery repair studio specialising in diamond settings.',
    services: ['Diamond Jewellery Repair', 'Stone Replacement', 'Gold Ring Repair', 'Jewellery Polishing', 'Earring Repair'],
    openTime: '11:00', closeTime: '21:00', closingDay: 'Tuesday', status: 'active',
    image: '', rating: 4.9, reviews: 189, createdAt: new Date().toISOString(),
  },
  {
    id: 'shop-004', name: 'Heritage Jewel Craft', owner: 'Amit Shah', contact: '9011223344',
    email: 'heritage@jewelcraft.in', address: '22, Law Garden Road', city: 'Ahmedabad',
    state: 'Gujarat', pincode: '380006',
    description: 'Three generations of master jewellers.',
    services: ['Gold Chain Repair', 'Bracelet Repair', 'Jewellery Cleaning', 'Jewellery Polishing', 'Custom Jewellery Repair'],
    openTime: '09:30', closeTime: '18:30', closingDay: 'Wednesday', status: 'active',
    image: '', rating: 4.7, reviews: 421, createdAt: new Date().toISOString(),
  },
];

const DEMO_BOOKINGS = [
  {
    id: 'b001', bookingId: 'GC-2026-0001', customerName: 'Anjali Sharma', mobile: '9876501234',
    email: 'anjali.sharma@email.com', jewelleryType: 'Gold Ring', repairService: 'Gold Ring Repair',
    shopId: 'shop-001', shopName: 'Raj Gold Works', description: 'Bent band needs reshaping.',
    appointmentDate: '2026-11-05', appointmentTime: '10:00', budget: '1500', instructions: 'Handle carefully.',
    status: 'Confirmed', adminRemarks: 'Appointment confirmed.', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(), image: '',
  },
  {
    id: 'b002', bookingId: 'GC-2026-0002', customerName: 'Ravi Patel', mobile: '9123467890',
    email: 'ravi.patel@email.com', jewelleryType: 'Gold Chain', repairService: 'Gold Chain Repair',
    shopId: 'shop-002', shopName: 'Shree Jewellers', description: 'Broken link near clasp.',
    appointmentDate: '2026-11-03', appointmentTime: '14:00', budget: '800', instructions: '22K gold chain.',
    status: 'In Progress', adminRemarks: 'Work started. Expected completion in 2 days.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString(), image: '',
  },
  {
    id: 'b003', bookingId: 'GC-2026-0003', customerName: 'Meena Reddy', mobile: '9988001122',
    email: 'meena.r@email.com', jewelleryType: 'Diamond Ring', repairService: 'Diamond Jewellery Repair',
    shopId: 'shop-003', shopName: 'Diamond Touch Studio', description: 'Loose prong on solitaire.',
    appointmentDate: '2026-11-10', appointmentTime: '11:30', budget: '3500', instructions: 'Check all prongs.',
    status: 'Pending', adminRemarks: '', createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(), image: '',
  },
  {
    id: 'b004', bookingId: 'GC-2026-0004', customerName: 'Sunil Verma', mobile: '9011001100',
    email: 'sunilv@email.com', jewelleryType: 'Bracelet', repairService: 'Bracelet Repair',
    shopId: 'shop-004', shopName: 'Heritage Jewel Craft', description: 'Broken lock mechanism.',
    appointmentDate: '2026-10-28', appointmentTime: '15:00', budget: '600', instructions: '',
    status: 'Completed', adminRemarks: 'Repair completed. New clasp fitted.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(), image: '',
  },
  {
    id: 'b005', bookingId: 'GC-2026-0005', customerName: 'Priya Nambiar', mobile: '9445566778',
    email: 'priya.n@email.com', jewelleryType: 'Necklace', repairService: 'Necklace Repair',
    shopId: 'shop-002', shopName: 'Shree Jewellers', description: 'Broken pendant connection.',
    appointmentDate: '2026-11-12', appointmentTime: '10:30', budget: '2000', instructions: 'Family heirloom.',
    status: 'Pending', adminRemarks: '', createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), image: '',
  },
];

export default function Settings() {
  const [resetDone, setResetDone] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleResetDemo = () => {
    if (!window.confirm('This will replace ALL current data with demo data. Are you sure?')) return;
    saveShops(DEMO_SHOPS);
    saveBookings(DEMO_BOOKINGS);
    saveSettings({ demoDataLoaded: true });
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  const handleClearAll = () => {
    if (!window.confirm('This will permanently delete ALL shops and bookings. This cannot be undone. Are you absolutely sure?')) return;
    resetAllData();
    saveShops([]);
    saveBookings([]);
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  const lsUsage = (() => {
    try {
      let total = 0;
      for (const key of ['goldcare_shops', 'goldcare_bookings', 'goldcare_admin_session', 'goldcare_settings']) {
        total += (localStorage.getItem(key) || '').length;
      }
      return (total / 1024).toFixed(1);
    } catch {
      return '?';
    }
  })();

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Settings
        </h1>
        <p className="text-stone-500 text-sm">Manage application data and configuration</p>
      </div>

      {/* Demo Data */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800">Reset Demo Data</h2>
            <p className="text-stone-500 text-sm mt-0.5">
              Restore the 4 sample shops and 5 sample bookings. Your current data will be replaced.
            </p>
          </div>
        </div>
        <button onClick={handleResetDemo}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            resetDone ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'btn-gold text-white'
          }`}>
          {resetDone ? <><CheckCircle className="w-4 h-4" /> Demo Data Restored!</> : <><RefreshCw className="w-4 h-4" /> Reset to Demo Data</>}
        </button>
      </div>

      {/* Clear All */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800">Clear All Data</h2>
            <p className="text-stone-500 text-sm mt-0.5">
              Permanently delete all shops and bookings from LocalStorage. This action cannot be undone.
            </p>
          </div>
        </div>
        <button onClick={handleClearAll}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
            cleared ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          }`}>
          {cleared ? <><CheckCircle className="w-4 h-4" /> All Data Cleared</> : <><Trash2 className="w-4 h-4" /> Clear All Data</>}
        </button>
      </div>

      {/* Storage Info */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <SettingsIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800">LocalStorage Usage</h2>
            <p className="text-stone-500 text-sm mt-0.5">Approximate storage used by GoldCare data</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'goldcare_shops', label: 'Shops Data' },
            { key: 'goldcare_bookings', label: 'Bookings Data' },
            { key: 'goldcare_admin_session', label: 'Admin Session' },
            { key: 'goldcare_settings', label: 'App Settings' },
          ].map(({ key, label }) => {
            const size = ((localStorage.getItem(key) || '').length / 1024).toFixed(1);
            return (
              <div key={key} className="bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-400">{label}</p>
                <p className="text-sm font-bold text-stone-700 mt-0.5">{size} KB</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-stone-400 mt-3">Total: ~{lsUsage} KB (Browser LocalStorage limit: ~5 MB)</p>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-bold text-amber-800 text-sm">Security & Privacy Notice</h3>
            <ul className="text-xs text-amber-700 mt-2 space-y-1 leading-relaxed">
              <li>• Admin credentials (admin / Admin@123) are hardcoded in the frontend JavaScript. This is insecure and for demo purposes only.</li>
              <li>• All data is stored in your browser's LocalStorage — it is NOT shared between different browsers, devices, or users.</li>
              <li>• Customer bookings made on other devices will NOT appear in this admin dashboard.</li>
              <li>• Clearing browser data or using private/incognito mode will erase all stored data.</li>
              <li>• For production use, implement a proper backend with authentication and database storage.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Credentials */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-amber-600" />
          <h2 className="font-bold text-stone-800 text-sm">Demo Admin Credentials</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xs text-stone-400">Username</p>
            <p className="font-mono font-bold text-stone-800 mt-0.5">admin</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xs text-stone-400">Password</p>
            <p className="font-mono font-bold text-stone-800 mt-0.5">Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
