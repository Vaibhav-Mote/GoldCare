import { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Save, CheckCircle, Trash2 } from 'lucide-react';
import BookingTable from '../components/BookingTable';
import { getBookings, getShops, updateBooking, deleteBooking } from '../services/localStorageService';

const STATUSES = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_BADGE = {
  'Pending': 'badge-pending',
  'Confirmed': 'badge-confirmed',
  'In Progress': 'badge-in-progress',
  'Completed': 'badge-completed',
  'Cancelled': 'badge-cancelled',
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [shopFilter, setShopFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [remarkSaved, setRemarkSaved] = useState(false);

  const reload = () => {
    setBookings(getBookings());
    setShops(getShops());
  };
  useEffect(() => { reload(); }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.mobile?.includes(search);
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchShop = shopFilter === 'All' || b.shopId === shopFilter;
    const matchDate = !dateFilter || b.appointmentDate === dateFilter;
    return matchSearch && matchStatus && matchShop && matchDate;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleStatusChange = (id, status) => {
    updateBooking(id, { status });
    reload();
    if (selectedBooking?.id === id) {
      setSelectedBooking((b) => ({ ...b, status }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(id);
      reload();
      if (selectedBooking?.id === id) setSelectedBooking(null);
    }
  };

  const handleSaveRemarks = () => {
    if (!selectedBooking) return;
    updateBooking(selectedBooking.id, { adminRemarks: remarks });
    setRemarkSaved(true);
    reload();
    setTimeout(() => setRemarkSaved(false), 2000);
  };

  const handlePaymentUpdate = (id, newStatus, method = 'Paid at Shop (Cash/POS)') => {
    const b = bookings.find((item) => item.id === id);
    const amount = b?.budget ? parseInt(b.budget, 10) : 1500;
    const updates = {
      paymentStatus: newStatus,
      paidAmount: newStatus === 'Paid' ? amount : 0,
      paymentMethod: newStatus === 'Paid' ? method : '',
      transactionId: newStatus === 'Paid' ? `TXN-POS-${Date.now().toString().slice(-6)}` : '',
      paidAt: newStatus === 'Paid' ? new Date().toISOString() : null,
    };
    updateBooking(id, updates);
    reload();
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => ({ ...prev, ...updates }));
    }
  };

  const openDetail = (booking) => {
    setSelectedBooking(booking);
    setRemarks(booking.adminRemarks || '');
    setRemarkSaved(false);
  };

  return (
    <div className="p-3.5 sm:p-6 flex flex-col lg:flex-row gap-6 h-full">
      {/* Main panel */}
      <div className={`flex-1 space-y-4 min-w-0 ${selectedBooking ? 'lg:max-w-[calc(100%-380px)]' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Booking Management
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm">{filtered.length} bookings found</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-amber-100 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Booking ID, customer name, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-sm input-gold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Filter className="w-4 h-4 text-amber-600 self-center" />
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                  statusFilter === s
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                }`}>
                {s}
              </button>
            ))}
            <select value={shopFilter} onChange={(e) => setShopFilter(e.target.value)}
              className="text-xs border border-stone-200 rounded-xl px-3 py-1.5 bg-white text-stone-600 focus:outline-none focus:border-amber-400">
              <option value="All">All Shops</option>
              {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs border border-stone-200 rounded-xl px-3 py-1.5 bg-white text-stone-600 focus:outline-none focus:border-amber-400" />
            {(search || statusFilter !== 'All' || shopFilter !== 'All' || dateFilter) && (
              <button onClick={() => { setSearch(''); setStatusFilter('All'); setShopFilter('All'); setDateFilter(''); }}
                className="text-xs text-red-500 hover:text-red-700 font-medium">
                Clear All
              </button>
            )}
          </div>
        </div>

        <BookingTable
          bookings={filtered}
          onView={openDetail}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      {/* Detail panel */}
      {selectedBooking && (
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-amber-100">
              <h2 className="font-bold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Booking Details
              </h2>
              <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-700 font-bold">{selectedBooking.bookingId}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
              </div>

              {[
                { label: 'Customer', value: selectedBooking.customerName },
                { label: 'Mobile', value: selectedBooking.mobile },
                { label: 'Email', value: selectedBooking.email || '–' },
                { label: 'Shop', value: selectedBooking.shopName },
                { label: 'Jewellery', value: selectedBooking.jewelleryType },
                { label: 'Service', value: selectedBooking.repairService },
                { label: 'Date', value: selectedBooking.appointmentDate },
                { label: 'Time', value: selectedBooking.appointmentTime },
                { label: 'Budget', value: selectedBooking.budget ? `₹${selectedBooking.budget}` : '–' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-stone-50 pb-2">
                  <span className="text-xs text-stone-400">{label}</span>
                  <span className="text-xs font-medium text-stone-700 text-right max-w-[60%]">{value}</span>
                </div>
              ))}

              {selectedBooking.description && (
                <div>
                  <p className="text-xs text-stone-400 mb-1">Description</p>
                  <p className="text-xs text-stone-600 bg-stone-50 rounded-lg p-2">{selectedBooking.description}</p>
                </div>
              )}
              {selectedBooking.instructions && (
                <div>
                  <p className="text-xs text-stone-400 mb-1">Instructions</p>
                  <p className="text-xs text-stone-600 bg-stone-50 rounded-lg p-2">{selectedBooking.instructions}</p>
                </div>
              )}
              {selectedBooking.image && (
                <div>
                  <p className="text-xs text-stone-400 mb-1">Jewellery Image</p>
                  <img src={selectedBooking.image} alt="Jewellery" className="rounded-lg w-full object-cover h-24" />
                </div>
              )}

              {/* Status changer */}
              <div>
                <p className="text-xs font-semibold text-stone-600 mb-1">Update Repair Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((s) => (
                    <button key={s} onClick={() => handleStatusChange(selectedBooking.id, s)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
                        selectedBooking.status === s
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-stone-600">Payment Status</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedBooking.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : selectedBooking.paymentStatus === 'Pay at Counter'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {selectedBooking.paymentStatus || 'Pending'}
                  </span>
                </div>

                {selectedBooking.paymentStatus === 'Paid' && (
                  <div className="bg-emerald-50 rounded-lg p-2 text-[11px] text-emerald-800 mb-2 space-y-0.5">
                    <p><strong>Paid:</strong> ₹{selectedBooking.paidAmount || 0}</p>
                    <p><strong>Method:</strong> {selectedBooking.paymentMethod || 'Online'}</p>
                    {selectedBooking.transactionId && (
                      <p className="font-mono text-[10px]"><strong>Ref:</strong> {selectedBooking.transactionId}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handlePaymentUpdate(selectedBooking.id, 'Paid', 'Cash/POS Counter')}
                    className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                      selectedBooking.paymentStatus === 'Paid'
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200'
                    }`}
                  >
                    Mark Paid
                  </button>
                  <button
                    onClick={() => handlePaymentUpdate(selectedBooking.id, 'Pending')}
                    className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
                      selectedBooking.paymentStatus === 'Pending' || !selectedBooking.paymentStatus
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-700 border border-stone-200'
                    }`}
                  >
                    Mark Pending
                  </button>
                </div>
              </div>

              {/* Admin remarks */}
              <div>
                <p className="text-xs font-semibold text-stone-600 mb-1">Admin Remarks</p>
                <textarea
                  value={remarks}
                  onChange={(e) => { setRemarks(e.target.value); setRemarkSaved(false); }}
                  rows={3}
                  placeholder="Add remarks for the customer..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs input-gold resize-none"
                />
                <button onClick={handleSaveRemarks}
                  className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    remarkSaved ? 'bg-emerald-100 text-emerald-700' : 'btn-gold text-white'
                  }`}>
                  {remarkSaved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved!</> : <><Save className="w-3.5 h-3.5" /> Save Remarks</>}
                </button>
              </div>

              <button onClick={() => handleDelete(selectedBooking.id)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200">
                <Trash2 className="w-3.5 h-3.5" /> Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
