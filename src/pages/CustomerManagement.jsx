import { useState, useEffect } from 'react';
import { Users, Phone, Mail, CalendarCheck, Search } from 'lucide-react';
import { getBookings } from '../services/localStorageService';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const bookings = getBookings();
    // Derive unique customers from bookings
    const customerMap = new Map();
    bookings.forEach((b) => {
      const key = b.mobile.replace(/\D/g, '');
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: b.customerName,
          mobile: b.mobile,
          email: b.email || '–',
          bookingCount: 0,
          lastBookingDate: b.createdAt,
          lastService: b.repairService,
        });
      }
      const cust = customerMap.get(key);
      cust.bookingCount++;
      if (new Date(b.createdAt) > new Date(cust.lastBookingDate)) {
        cust.lastBookingDate = b.createdAt;
        cust.lastService = b.repairService;
      }
    });
    setCustomers([...customerMap.values()].sort((a, b) => new Date(b.lastBookingDate) - new Date(a.lastBookingDate)));
  }, []);

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Customer Management
          </h1>
          <p className="text-stone-500 text-sm">{customers.length} unique customers</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'from-amber-500 to-yellow-400' },
          { label: 'Repeat Customers', value: customers.filter((c) => c.bookingCount > 1).length, icon: Users, color: 'from-emerald-500 to-green-400' },
          { label: 'This Month', value: customers.filter((c) => {
            const d = new Date(c.lastBookingDate);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length, icon: CalendarCheck, color: 'from-blue-500 to-sky-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            <p className="text-stone-500 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, mobile or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-sm input-gold"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-amber-200 mx-auto mb-3" />
            <p className="text-stone-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-gold">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Customer Name</th>
                  <th className="px-4 py-3 text-left">Mobile</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Total Bookings</th>
                  <th className="px-4 py-3 text-left">Last Service</th>
                  <th className="px-4 py-3 text-left">Last Booking</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.mobile} className={`border-b border-amber-50 ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}>
                    <td className="px-4 py-3 text-sm text-stone-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
                          {c.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-stone-800 text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-stone-600">
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        {c.mobile}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-stone-600">
                        <Mail className="w-3.5 h-3.5 text-amber-500" />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                        c.bookingCount > 1 ? 'bg-amber-600' : 'bg-stone-400'
                      }`}>
                        {c.bookingCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-600">{c.lastService}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {new Date(c.lastBookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
