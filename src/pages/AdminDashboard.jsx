import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store, CalendarCheck, Clock, CheckCircle, AlertCircle, XCircle, Users,
  TrendingUp, ArrowRight, RefreshCw,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import BookingTable from '../components/BookingTable';
import { getShops, getBookings, updateBooking, deleteBooking } from '../services/localStorageService';

// Simple bar chart component
function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(d.value / max) * 100}%`,
              background: 'linear-gradient(180deg, #f59e0b, #b45309)',
              minHeight: d.value > 0 ? '4px' : '0',
            }}
          />
          <span className="text-xs text-stone-500 truncate w-full text-center">{d.label}</span>
          <span className="text-xs font-bold text-stone-700">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <div className="text-stone-400 text-center py-4">No data</div>;

  const colors = ['#d97706', '#059669', '#3b82f6', '#10b981', '#ef4444'];
  let accumulated = 0;
  const segments = data.map((d, i) => {
    const pct = (d.value / total) * 100;
    const start = accumulated;
    accumulated += pct;
    return { ...d, pct, start, color: colors[i % colors.length] };
  });

  const radius = 40;
  const cx = 60, cy = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${(seg.pct / 100) * circumference} ${circumference}`}
            strokeDashoffset={`${(-seg.start / 100) * circumference}`}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dy="4" className="text-sm font-bold fill-stone-700" fontSize="16">
          {total}
        </text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
              <span className="text-xs text-stone-600">{seg.label}</span>
            </div>
            <span className="text-xs font-bold text-stone-700">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const reload = () => {
    setBookings(getBookings());
    setShops(getShops());
  };

  useEffect(() => { reload(); }, []);

  const counts = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'Pending').length,
    confirmed: bookings.filter((b) => b.status === 'Confirmed').length,
    inProgress: bookings.filter((b) => b.status === 'In Progress').length,
    completed: bookings.filter((b) => b.status === 'Completed').length,
    cancelled: bookings.filter((b) => b.status === 'Cancelled').length,
    shops: shops.length,
    activeShops: shops.filter((s) => s.status === 'active').length,
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Monthly chart data
  const monthlyData = (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = Array(12).fill(0);
    bookings.forEach((b) => {
      const m = new Date(b.createdAt).getMonth();
      counts[m]++;
    });
    const now = new Date().getMonth();
    return months.slice(Math.max(0, now - 5), now + 1).map((m, i) => ({
      label: m,
      value: counts[Math.max(0, now - 5) + i],
    }));
  })();

  const statusChartData = [
    { label: 'Pending', value: counts.pending },
    { label: 'Confirmed', value: counts.confirmed },
    { label: 'In Progress', value: counts.inProgress },
    { label: 'Completed', value: counts.completed },
    { label: 'Cancelled', value: counts.cancelled },
  ];

  const handleStatusChange = (id, status) => {
    updateBooking(id, { status });
    reload();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this booking? This action cannot be undone.')) {
      deleteBooking(id);
      reload();
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Admin Dashboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={reload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-xl hover:border-amber-300 transition-colors shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <Link to="/" target="_blank"
            className="btn-gold px-3.5 py-1.5 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm">
            View Site
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <DashboardCard title="Total Shops" value={counts.shops} icon={Store} color="brown" subtitle={`${counts.activeShops} active`} />
        <DashboardCard title="Total Bookings" value={counts.total} icon={CalendarCheck} color="gold" />
        <DashboardCard title="Pending" value={counts.pending} icon={Clock} color="orange" />
        <DashboardCard title="Confirmed" value={counts.confirmed} icon={CheckCircle} color="blue" />
        <DashboardCard title="In Progress" value={counts.inProgress} icon={AlertCircle} color="purple" />
        <DashboardCard title="Completed" value={counts.completed} icon={CheckCircle} color="green" />
        <DashboardCard title="Cancelled" value={counts.cancelled} icon={XCircle} color="red" />
        <DashboardCard title="Customers" value={new Set(bookings.map((b) => b.mobile.replace(/\D/g, ''))).size} icon={Users} color="gold" />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly chart */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Monthly Bookings
            </h2>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <BarChart data={monthlyData} />
        </div>

        {/* Status donut */}
        <div className="bg-white rounded-2xl border border-amber-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Booking Status
            </h2>
          </div>
          <DonutChart data={statusChartData} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-amber-100 p-5">
        <h2 className="font-bold text-stone-700 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add New Shop', to: '/admin/shops', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { label: 'View All Bookings', to: '/admin/bookings', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'View Customers', to: '/admin/customers', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { label: 'Generate Reports', to: '/admin/reports', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Settings', to: '/admin/settings', color: 'bg-stone-50 text-stone-700 border-stone-200' },
          ].map(({ label, to, color }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:shadow-sm ${color}`}>
              {label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-amber-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-stone-700" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Recent Bookings
          </h2>
          <Link to="/admin/bookings" className="text-sm text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <BookingTable
          bookings={recentBookings}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          compact
        />
      </div>
    </div>
  );
}
