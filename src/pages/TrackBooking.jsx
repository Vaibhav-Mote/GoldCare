import { useState } from 'react';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Gem, CreditCard, Receipt, ShieldCheck } from 'lucide-react';
import { getBookingByIdAndMobile } from '../services/localStorageService';
import PaymentModal from '../components/PaymentModal';

const STATUS_BADGE = {
  'Pending': 'badge-pending',
  'Confirmed': 'badge-confirmed',
  'In Progress': 'badge-in-progress',
  'Completed': 'badge-completed',
  'Cancelled': 'badge-cancelled',
};

const STATUS_ICON = {
  'Pending': <Clock className="w-5 h-5 text-amber-600" />,
  'Confirmed': <CheckCircle className="w-5 h-5 text-emerald-600" />,
  'In Progress': <AlertCircle className="w-5 h-5 text-blue-600" />,
  'Completed': <CheckCircle className="w-5 h-5 text-green-600" />,
  'Cancelled': <XCircle className="w-5 h-5 text-red-500" />,
};

const STATUS_STEPS = ['Pending', 'Confirmed', 'In Progress', 'Completed'];

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState('');
  const [mobile, setMobile] = useState('');
  const [booking, setBooking] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!bookingId.trim() || !mobile.trim()) return;
    setLoading(true);
    setNotFound(false);
    setBooking(null);
    setTimeout(() => {
      const found = getBookingByIdAndMobile(bookingId.trim().toUpperCase(), mobile.trim());
      if (found) {
        setBooking(found);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 800);
  };

  const currentStep = booking ? STATUS_STEPS.indexOf(booking.status) : -1;

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }} className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Booking Status</p>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Track Your Booking
          </h1>
          <p className="text-stone-400">Enter your Booking ID and mobile number to check your repair status.</p>
        </div>
      </section>

      <section className="py-10 max-w-2xl mx-auto px-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Find Your Booking
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Booking ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                placeholder="e.g. GC-2026-0001"
                className="w-full px-4 py-3 rounded-xl border input-gold text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Your 10-digit mobile"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border input-gold text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !bookingId || !mobile}
            className="btn-gold w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track Booking
              </>
            )}
          </button>
        </form>

        {/* Not found */}
        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center animate-fade-in">
            <XCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <h3 className="font-bold text-red-700 text-lg mb-1">Booking Not Found</h3>
            <p className="text-red-500 text-sm">
              No booking found with that ID and mobile number combination. Please check and try again.
            </p>
          </div>
        )}

        {/* Booking details */}
        {booking && (
          <div className="animate-fade-in space-y-4">
            {/* Status banner */}
            <div className={`rounded-2xl p-5 border ${STATUS_BADGE[booking.status]} flex items-center gap-4`}>
              {STATUS_ICON[booking.status]}
              <div>
                <p className="font-bold text-lg">{booking.status}</p>
                <p className="text-sm opacity-80">Current repair status</p>
              </div>
              <span className="ml-auto font-mono font-bold text-lg">{booking.bookingId}</span>
            </div>

            {/* Progress bar (for non-cancelled) */}
            {booking.status !== 'Cancelled' && (
              <div className="bg-white rounded-2xl border border-amber-100 p-5">
                <h3 className="font-bold text-stone-700 text-sm mb-4">Repair Progress</h3>
                <div className="flex items-center">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className={`flex flex-col items-center relative ${i < STATUS_STEPS.length - 1 ? 'w-full' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 z-10 ${
                          i <= currentStep
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'bg-white border-stone-200 text-stone-400'
                        }`}>
                          {i < currentStep ? '✓' : i + 1}
                        </div>
                        <p className={`text-xs mt-1.5 font-medium text-center w-16 ${i <= currentStep ? 'text-amber-700' : 'text-stone-400'}`}>
                          {step}
                        </p>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-4 ${i < currentStep ? 'bg-amber-600' : 'bg-stone-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details grid */}
            <div className="bg-white rounded-2xl border border-amber-100 p-5">
              <h3 className="font-bold text-stone-800 mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Booking Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Customer Name', value: booking.customerName },
                  { label: 'Mobile', value: booking.mobile },
                  { label: 'Shop', value: booking.shopName },
                  { label: 'Jewellery Type', value: booking.jewelleryType },
                  { label: 'Repair Service', value: booking.repairService },
                  { label: 'Appointment Date', value: new Date(booking.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'Appointment Time', value: booking.appointmentTime },
                  { label: 'Budget', value: booking.budget ? `₹${booking.budget}` : 'Not specified' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-stone-700">{value}</p>
                  </div>
                ))}
              </div>

              {booking.description && (
                <div className="mt-3 bg-stone-50 rounded-xl p-3">
                  <p className="text-xs text-stone-400 mb-0.5">Description</p>
                  <p className="text-sm text-stone-700">{booking.description}</p>
                </div>
              )}

              {booking.adminRemarks && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-600 font-semibold mb-0.5">Admin Remarks</p>
                  <p className="text-sm text-stone-700">{booking.adminRemarks}</p>
                </div>
              )}

              {/* Payment Status Card */}
              <div className="mt-4 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-700" /> Payment & Billing
                  </h4>
                  {booking.paymentStatus === 'Paid' ? (
                    <span className="badge-confirmed px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Paid
                    </span>
                  ) : booking.paymentStatus === 'Pay at Counter' ? (
                    <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Pay at Shop
                    </span>
                  ) : (
                    <span className="badge-pending px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Payment Pending
                    </span>
                  )}
                </div>

                {booking.paymentStatus === 'Paid' ? (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Amount Paid:</span>
                      <span className="font-bold text-emerald-800">₹{booking.paidAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Method:</span>
                      <span className="font-medium text-stone-700">{booking.paymentMethod}</span>
                    </div>
                    {booking.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Transaction ID:</span>
                        <span className="font-mono font-bold text-stone-700">{booking.transactionId}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="mt-2 w-full py-2 bg-white border border-emerald-300 rounded-lg text-emerald-800 font-semibold text-xs hover:bg-emerald-100 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Receipt className="w-3.5 h-3.5" /> View Official Receipt
                    </button>
                  </div>
                ) : booking.paymentStatus === 'Pay at Counter' ? (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-blue-900">Pay in Person at Counter</p>
                      <p className="text-[11px] text-blue-700">Pay ₹{booking.budget || '1,500'} via Cash/Card during your shop visit.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-800 font-semibold text-xs hover:bg-blue-100 shrink-0 shadow-sm"
                    >
                      Pay Online Now
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-amber-900">Advance / Online Payment Available</p>
                      <p className="text-[11px] text-stone-500">Secure your spot with UPI, Card, or choose to pay at counter.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="btn-gold px-3.5 py-1.5 rounded-lg text-white font-bold text-xs shrink-0 shadow-sm"
                    >
                      Pay Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => { setBooking(null); setBookingId(''); setMobile(''); setNotFound(false); }}
              className="btn-gold-outline w-full py-3 rounded-xl font-semibold text-sm"
            >
              Search Another Booking
            </button>

            {/* Payment Modal */}
            {showPaymentModal && (
              <PaymentModal
                booking={booking}
                onClose={() => setShowPaymentModal(false)}
                onPaymentSuccess={(updated) => {
                  setBooking(updated);
                }}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
