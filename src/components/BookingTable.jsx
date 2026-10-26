import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_BADGE = {
  'Pending': 'badge-pending',
  'Confirmed': 'badge-confirmed',
  'In Progress': 'badge-in-progress',
  'Completed': 'badge-completed',
  'Cancelled': 'badge-cancelled',
};

const STATUS_ICON = {
  'Pending': <Clock className="w-3.5 h-3.5" />,
  'Confirmed': <CheckCircle className="w-3.5 h-3.5" />,
  'In Progress': <AlertCircle className="w-3.5 h-3.5" />,
  'Completed': <CheckCircle className="w-3.5 h-3.5" />,
  'Cancelled': <XCircle className="w-3.5 h-3.5" />,
};

export default function BookingTable({ bookings, onView, onDelete, onStatusChange, compact = false }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-amber-300" />
        </div>
        <p className="text-stone-500 font-medium">No bookings found</p>
        <p className="text-stone-400 text-sm mt-1">Bookings will appear here once created</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-amber-100">
      <table className="w-full table-gold">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left">Booking ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            {!compact && <th className="px-4 py-3 text-left">Shop</th>}
            <th className="px-4 py-3 text-left">Service</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, idx) => (
            <tr
              key={booking.id}
              className={`border-b border-amber-50 transition-colors ${
                idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'
              }`}
            >
              <td className="px-4 py-3">
                <span className="font-mono text-sm font-medium text-amber-700">{booking.bookingId}</span>
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-stone-800">{booking.customerName}</p>
                  <p className="text-xs text-stone-500">{booking.mobile}</p>
                </div>
              </td>
              {!compact && (
                <td className="px-4 py-3">
                  <span className="text-sm text-stone-600">{booking.shopName}</span>
                </td>
              )}
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">{booking.repairService}</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-stone-600">
                  {new Date(booking.appointmentDate).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[booking.status] || 'badge-pending'}`}>
                  {STATUS_ICON[booking.status]}
                  {booking.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1.5">
                  {onView && (
                    <button
                      onClick={() => onView(booking)}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onStatusChange && (
                    <select
                      value={booking.status}
                      onChange={(e) => onStatusChange(booking.id, e.target.value)}
                      className="text-xs border border-amber-200 rounded-lg px-1.5 py-1 bg-white text-stone-700 focus:outline-none focus:border-amber-500"
                    >
                      {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
