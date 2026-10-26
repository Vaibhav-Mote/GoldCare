import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, Gem, X, CreditCard, Receipt, ShieldCheck } from 'lucide-react';
import { getShops, addBooking, getBookings } from '../services/localStorageService';
import { validateBookingForm } from '../utils/validation';
import { generateBookingId } from '../services/bookingService';
import PaymentModal from '../components/PaymentModal';

const JEWELLERY_TYPES = [
  'Gold Ring', 'Gold Chain', 'Necklace', 'Bracelet', 'Earring',
  'Diamond Ring', 'Diamond Necklace', 'Bangles', 'Pendant', 'Anklet', 'Other',
];
const REPAIR_SERVICES = [
  'Gold Ring Repair', 'Gold Chain Repair', 'Necklace Repair', 'Bracelet Repair',
  'Earring Repair', 'Diamond Jewellery Repair', 'Jewellery Polishing',
  'Stone Replacement', 'Jewellery Cleaning', 'Custom Jewellery Repair',
];
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
];

const INITIAL_FORM = {
  customerName: '', mobile: '', email: '',
  jewelleryType: '', repairService: '', shopId: '',
  description: '', image: '',
  appointmentDate: '', appointmentTime: '', budget: '',
  instructions: '',
};

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    shopId: location.state?.shopId || '',
    repairService: location.state?.service || '',
  });
  const [errors, setErrors] = useState({});
  const [shops, setShops] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    setShops(getShops().filter((s) => s.status === 'active'));
  }, []);

  const minDate = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrors((err) => ({ ...err, image: 'Image must be smaller than 2MB' }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm((f) => ({ ...f, image: reader.result }));
      setErrors((err) => ({ ...err, image: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBookingForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorEl = document.querySelector('[data-error]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const shop = shops.find((s) => s.id === form.shopId);
      const bookingId = generateBookingId();
      const booking = {
        id: `b-${Date.now()}`,
        bookingId,
        ...form,
        shopName: shop?.name || 'Unknown Shop',
        status: 'Pending',
        paymentStatus: 'Pending',
        paidAmount: 0,
        paymentMethod: '',
        transactionId: '',
        adminRemarks: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addBooking(booking);
      setConfirmed(booking);
      setSubmitting(false);
      // Auto-open payment options for user convenience
      setShowPaymentModal(true);
    }, 1200);
  };

  if (confirmed) {
    const isPaid = confirmed.paymentStatus === 'Paid';
    const isCounter = confirmed.paymentStatus === 'Pay at Counter';

    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 max-w-xl w-full p-6 sm:p-8 text-center animate-fade-in-up">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Booking Confirmed!
          </h2>
          <p className="text-stone-500 text-sm mb-6">Your repair request has been reserved with our verified shop.</p>

          {/* Details Card */}
          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 mb-6 text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
              <span className="text-stone-500 font-medium">Booking ID</span>
              <span className="font-bold text-amber-800 font-mono text-sm sm:text-base">{confirmed.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Customer</span>
              <span className="font-semibold text-stone-800">{confirmed.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Shop</span>
              <span className="font-semibold text-stone-800">{confirmed.shopName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Service</span>
              <span className="font-semibold text-stone-800">{confirmed.repairService}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Appointment</span>
              <span className="font-semibold text-stone-800">{confirmed.appointmentDate} at {confirmed.appointmentTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Est. Budget</span>
              <span className="font-semibold text-stone-800">₹{confirmed.budget || '1,500'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-amber-200/60">
              <span className="text-stone-500 font-medium">Repair Status</span>
              <span className="badge-pending px-2.5 py-0.5 rounded-full text-xs font-semibold">Pending</span>
            </div>
          </div>

          {/* Payment Status / Action Box */}
          <div className="mb-6 text-left">
            {isPaid ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Payment Received
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    ₹{confirmed.paidAmount} via {confirmed.paymentMethod}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 mt-0.5">
                    Txn: {confirmed.transactionId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 flex items-center gap-1 shadow-sm"
                >
                  <Receipt className="w-3.5 h-3.5" /> View Receipt
                </button>
              </div>
            ) : isCounter ? (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold text-sm">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Pay at Shop Selected
                  </div>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Pay ₹{confirmed.budget || '1,500'} during your shop visit (Cash / Card POS).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-800 font-semibold text-xs hover:bg-blue-100 shadow-sm"
                >
                  Pay Online
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-sm">
                      <CreditCard className="w-4 h-4 text-amber-700" /> Payment & Advance Option
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Secure your workshop slot with an advance token or full amount (UPI, Cards, NetBanking), or choose to pay at the store counter.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(true)}
                    className="btn-gold shrink-0 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md"
                  >
                    Pay / Options
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-stone-500 mb-6">
            Keep your Booking ID <strong className="text-amber-800">{confirmed.bookingId}</strong> handy to track real-time repair progress.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/track')}
              className="btn-gold flex-1 py-3 rounded-xl text-white font-semibold text-sm shadow-md"
            >
              Track Booking
            </button>
            <button
              onClick={() => { setConfirmed(null); setForm(INITIAL_FORM); setImagePreview(''); }}
              className="btn-gold-outline flex-1 py-3 rounded-xl font-semibold text-sm"
            >
              New Booking
            </button>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <PaymentModal
              booking={confirmed}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={(updated) => {
                setConfirmed(updated);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  const InputError = ({ field }) =>
    errors[field] ? (
      <p data-error className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" /> {errors[field]}
      </p>
    ) : null;

  const Label = ({ children, required }) => (
    <label className="block text-sm font-semibold text-stone-700 mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm input-gold ${errors[field] ? 'border-red-400' : ''}`;

  return (
    <div className="pt-20 bg-stone-50 min-h-screen">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }} className="py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gem className="w-6 h-6 text-amber-400" />
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Book a Repair</p>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Schedule Your Jewellery Repair
          </h1>
          <p className="text-stone-400">Fill in the details below and we'll confirm your appointment shortly.</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">1</span>
              Personal Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Full Name</Label>
                <input name="customerName" value={form.customerName} onChange={handleChange}
                  placeholder="Your full name" className={inputCls('customerName')} />
                <InputError field="customerName" />
              </div>
              <div>
                <Label required>Mobile Number</Label>
                <input name="mobile" value={form.mobile} onChange={handleChange}
                  placeholder="10-digit mobile number" maxLength={10} className={inputCls('mobile')} />
                <InputError field="mobile" />
              </div>
              <div className="sm:col-span-2">
                <Label>Email Address</Label>
                <input name="email" value={form.email} onChange={handleChange}
                  type="email" placeholder="your@email.com" className={inputCls('email')} />
                <InputError field="email" />
              </div>
            </div>
          </div>

          {/* Jewellery Info */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">2</span>
              Jewellery & Service Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Jewellery Type</Label>
                <select name="jewelleryType" value={form.jewelleryType} onChange={handleChange}
                  className={inputCls('jewelleryType')}>
                  <option value="">-- Select Type --</option>
                  {JEWELLERY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <InputError field="jewelleryType" />
              </div>
              <div>
                <Label required>Repair Service</Label>
                <select name="repairService" value={form.repairService} onChange={handleChange}
                  className={inputCls('repairService')}>
                  <option value="">-- Select Service --</option>
                  {REPAIR_SERVICES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <InputError field="repairService" />
              </div>
              <div className="sm:col-span-2">
                <Label required>Select Jewellery Shop</Label>
                <select name="shopId" value={form.shopId} onChange={handleChange}
                  className={inputCls('shopId')}>
                  <option value="">-- Select a Shop --</option>
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} – {s.city}</option>
                  ))}
                </select>
                <InputError field="shopId" />
              </div>
              <div className="sm:col-span-2">
                <Label required>Jewellery Description</Label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={3} placeholder="Describe your jewellery and the issue (e.g., 22K gold ring, bent band, needs reshaping)..."
                  className={inputCls('description')} />
                <InputError field="description" />
              </div>
              <div className="sm:col-span-2">
                <Label>Upload Jewellery Image</Label>
                <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 hover:border-amber-400 transition-colors">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-32 rounded-lg object-cover" />
                      <button type="button" onClick={() => { setImagePreview(''); setForm((f) => ({ ...f, image: '' })); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="w-8 h-8 text-amber-400" />
                      <span className="text-sm text-stone-500">Click to upload photo (max 2MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <InputError field="image" />
              </div>
            </div>
          </div>

          {/* Appointment */}
          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-5 flex items-center gap-2"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">3</span>
              Appointment Preferences
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label required>Preferred Date</Label>
                <input type="date" name="appointmentDate" value={form.appointmentDate}
                  onChange={handleChange} min={minDate} className={inputCls('appointmentDate')} />
                <InputError field="appointmentDate" />
              </div>
              <div>
                <Label required>Preferred Time</Label>
                <select name="appointmentTime" value={form.appointmentTime} onChange={handleChange}
                  className={inputCls('appointmentTime')}>
                  <option value="">-- Select Time --</option>
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
                <InputError field="appointmentTime" />
              </div>
              <div>
                <Label>Estimated Budget (₹)</Label>
                <input name="budget" value={form.budget} onChange={handleChange}
                  type="number" placeholder="Approximate budget in ₹" className={inputCls('budget')} />
              </div>
              <div className="sm:col-span-2">
                <Label>Additional Instructions</Label>
                <textarea name="instructions" value={form.instructions} onChange={handleChange}
                  rows={2} placeholder="Any special care instructions or additional notes..."
                  className={inputCls('instructions')} />
              </div>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-600 text-sm">Please fix the errors above before submitting.</p>
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="btn-gold w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Booking...
              </>
            ) : (
              <>
                <Gem className="w-5 h-5" />
                Confirm Booking & Proceed to Payment
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
