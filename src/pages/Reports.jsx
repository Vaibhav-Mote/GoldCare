import { useState, useEffect } from 'react';
import { Download, BarChart3, Calendar, TrendingUp, Filter } from 'lucide-react';
import { getBookings, getShops } from '../services/localStorageService';
import { exportBookingsToCSV } from '../utils/exportCSV';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function HBar({ label, value, max, color = '#d97706' }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-600 w-36 shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold text-stone-700 w-6 text-right">{value}</span>
    </div>
  );
}

export default function Reports() {
  const [bookings, setBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    setBookings(getBookings());
    setShops(getShops());
  }, []);

  const filtered = bookings.filter((b) => {
    if (!dateFrom && !dateTo) return true;
    const d = new Date(b.createdAt);
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo && d > new Date(dateTo + 'T23:59:59')) return false;
    return true;
  });

  // Status summary
  const statusData = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => ({
    label: s,
    value: filtered.filter((b) => b.status === s).length,
  }));

  // Shop-wise
  const shopData = shops.map((s) => ({
    label: s.name,
    value: filtered.filter((b) => b.shopId === s.id).length,
  })).filter((s) => s.value > 0).sort((a, b) => b.value - a.value);

  // Service-wise
  const serviceMap = {};
  filtered.forEach((b) => {
    serviceMap[b.repairService] = (serviceMap[b.repairService] || 0) + 1;
  });
  const serviceData = Object.entries(serviceMap)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  // Monthly
  const monthlyMap = Array(12).fill(0);
  filtered.forEach((b) => {
    const m = new Date(b.createdAt).getMonth();
    monthlyMap[m]++;
  });
  const monthlyData = MONTHS.map((m, i) => ({ label: m, value: monthlyMap[i] }));

  const maxShop = Math.max(...shopData.map((s) => s.value), 1);
  const maxService = Math.max(...serviceData.map((s) => s.value), 1);
  const maxMonthly = Math.max(...monthlyData.map((m) => m.value), 1);

  const handleExport = () => {
    exportBookingsToCSV(filtered, 'goldcare_report');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Reports & Analytics
          </h1>
          <p className="text-stone-500 text-sm">{filtered.length} bookings in selected period</p>
        </div>
        <button onClick={handleExport}
          className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl border border-amber-100 p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-amber-600" />
        <span className="text-sm font-medium text-stone-600">Date Range:</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm border border-amber-200 rounded-xl px-3 py-1.5 bg-amber-50 text-stone-700 focus:outline-none focus:border-amber-500" />
          <span className="text-stone-400 text-sm">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="text-sm border border-amber-200 rounded-xl px-3 py-1.5 bg-amber-50 text-stone-700 focus:outline-none focus:border-amber-500" />
        </div>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }}
            className="text-sm text-red-500 hover:text-red-700 font-medium">Clear</button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusData.map((s, i) => {
          const colors = ['#d97706', '#059669', '#3b82f6', '#10b981', '#ef4444'];
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-amber-100 p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-stone-800 mb-1">{s.value}</div>
              <div className="text-xs font-medium" style={{ color: colors[i] }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shop-wise */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Shop-Wise Bookings
            </h2>
          </div>
          {shopData.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {shopData.map((s) => (
                <HBar key={s.label} label={s.label} value={s.value} max={maxShop} color="#d97706" />
              ))}
            </div>
          )}
        </div>

        {/* Service-wise */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Service-Wise Bookings
            </h2>
          </div>
          {serviceData.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {serviceData.map((s) => (
                <HBar key={s.label} label={s.label} value={s.value} max={maxService} color="#b45309" />
              ))}
            </div>
          )}
        </div>

        {/* Monthly */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Monthly Booking Summary
            </h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-stone-600">{m.value > 0 ? m.value : ''}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-700"
                  style={{
                    height: `${(m.value / maxMonthly) * 100}%`,
                    background: 'linear-gradient(180deg, #f59e0b, #b45309)',
                    minHeight: m.value > 0 ? '4px' : '2px',
                    opacity: m.value > 0 ? 1 : 0.15,
                  }}
                />
                <span className="text-xs text-stone-400">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Raw Data Preview */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-amber-100">
          <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Booking Data Preview
          </h2>
          <button onClick={handleExport} className="text-sm text-amber-700 font-medium flex items-center gap-1 hover:text-amber-800">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-gold text-xs">
            <thead>
              <tr>
                <th className="px-4 py-2.5 text-left">Booking ID</th>
                <th className="px-4 py-2.5 text-left">Customer</th>
                <th className="px-4 py-2.5 text-left">Shop</th>
                <th className="px-4 py-2.5 text-left">Service</th>
                <th className="px-4 py-2.5 text-left">Date</th>
                <th className="px-4 py-2.5 text-left">Budget</th>
                <th className="px-4 py-2.5 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((b, i) => (
                <tr key={b.id} className={`border-b border-amber-50 ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}>
                  <td className="px-4 py-2 font-mono text-amber-700 font-medium">{b.bookingId}</td>
                  <td className="px-4 py-2 text-stone-700">{b.customerName}</td>
                  <td className="px-4 py-2 text-stone-600">{b.shopName}</td>
                  <td className="px-4 py-2 text-stone-600">{b.repairService}</td>
                  <td className="px-4 py-2 text-stone-500">{b.appointmentDate}</td>
                  <td className="px-4 py-2 text-stone-600">{b.budget ? `₹${b.budget}` : '–'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      { Pending: 'badge-pending', Confirmed: 'badge-confirmed', 'In Progress': 'badge-in-progress', Completed: 'badge-completed', Cancelled: 'badge-cancelled' }[b.status]
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 10 && (
            <div className="text-center py-3 text-xs text-stone-400 border-t border-amber-50">
              Showing 10 of {filtered.length} bookings. Export CSV to view all.
            </div>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-stone-400 text-sm">No bookings in selected period</div>
          )}
        </div>
      </div>
    </div>
  );
}
