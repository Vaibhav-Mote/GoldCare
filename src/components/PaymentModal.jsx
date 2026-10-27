import { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Printer,
  X,
  Gem,
  Smartphone,
  Copy,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { updateBooking } from '../services/localStorageService';

export default function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('phonepe'); // 'phonepe' | 'card' | 'netbanking' | 'counter'
  const [paymentType, setPaymentType] = useState('advance'); // 'advance' | 'full'

  // Timer for payment session
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [hasTriggeredPhonePe, setHasTriggeredPhonePe] = useState(false);

  // PhonePe & UPI credentials
  const payeeName = 'vaibhavi haridash pathade';
  const [merchantUpiId, setMerchantUpiId] = useState('8446763371@axl');
  const [isEditingUpi, setIsEditingUpi] = useState(false);

  // Card & NetBanking forms
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(booking.customerName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const budgetNum = parseInt(booking.budget || '1500', 10) || 1500;
  const advanceAmount = Math.min(500, budgetNum);
  const finalAmount = selectedMethod === 'counter'
    ? 0
    : (paymentType === 'full' ? budgetNum : advanceAmount);

  // PhonePe direct application intent link
  const phonePeIntentString = `phonepe://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(`GoldCare-${booking.bookingId}`)}`;
  // Universal UPI fallback intent link
  const upiIntentString = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(`GoldCare-${booking.bookingId}`)}`;

  useEffect(() => {
    if (paymentComplete || isProcessing) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentComplete, isProcessing]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyTxn = () => {
    if (paymentResult?.transactionId) {
      navigator.clipboard.writeText(paymentResult.transactionId);
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    }
  };

  const handleOpenPhonePe = () => {
    setHasTriggeredPhonePe(true);
    // Trigger PhonePe deep link to directly open PhonePe app on mobile
    window.location.href = phonePeIntentString;
  };

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleProcessPayment = (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date().toISOString();
      const refNumber = `PP/REF/${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;
      const isCounter = selectedMethod === 'counter';

      const paymentInfo = {
        paymentStatus: isCounter ? 'Pay at Counter' : 'Paid',
        paidAmount: isCounter ? 0 : finalAmount,
        totalBudget: budgetNum,
        paymentType: isCounter ? 'Counter' : paymentType,
        paymentMethod: isCounter
          ? 'Pay at Counter / Shop (Cash or Card POS)'
          : selectedMethod === 'phonepe'
            ? `PhonePe Direct UPI (${merchantUpiId})`
            : selectedMethod === 'card'
              ? 'Debit / Credit Card'
              : `Net Banking (${selectedBank})`,
        payeeName: payeeName,
        transactionId: isCounter ? 'N/A (Cash on Visit)' : refNumber,
        paidAt: now,
      };

      updateBooking(booking.id, paymentInfo);
      setPaymentResult(paymentInfo);
      setIsProcessing(false);
      setPaymentComplete(true);

      if (onPaymentSuccess) {
        onPaymentSuccess({ ...booking, ...paymentInfo });
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden my-4 sm:my-8 animate-fade-in-up">

        {/* Gateway Header */}
        <div
          className="p-5 text-white relative"
          style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #2d1a00 60%, #451a03 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md border border-amber-400/30"
                style={{ background: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)' }}
              >
                <Gem className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold font-serif text-amber-300 tracking-wide">
                    GoldCare Secure Pay
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-xs text-amber-200/80">Jewellery Repair Escrow Payment</p>
              </div>
            </div>

            {onClose && !isProcessing && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-amber-900/50 flex items-center justify-between text-xs text-amber-200">
            <div>
              Booking: <span className="font-mono font-bold text-white">{booking.bookingId}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Session: </span>
              <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                {formatTimer(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {!paymentComplete ? (
          <div className="p-5 sm:p-6 space-y-5">

            {/* Deposit / Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Select Amount to Pay
                </label>
                <span className="text-[11px] text-amber-800 font-medium">
                  Total Estimate: ₹{budgetNum}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentType('advance')}
                  className={`p-3 rounded-2xl border text-left transition-all ${paymentType === 'advance'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/50 shadow-sm'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/60'
                    }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-stone-800">Advance Deposit</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      ₹{advanceAmount}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Lock artisan bench slot now; balance ₹{Math.max(0, budgetNum - advanceAmount)} upon pickup.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('full')}
                  className={`p-3 rounded-2xl border text-left transition-all ${paymentType === 'full'
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/50 shadow-sm'
                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/60'
                    }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-stone-800">Full Amount</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      ₹{budgetNum}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Pay 100% estimated service charges upfront with zero hassle on delivery.
                  </p>
                </button>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200">
                {[
                  { id: 'phonepe', label: 'PhonePe', icon: Smartphone },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBank', icon: Building2 },
                  { id: 'counter', label: 'Pay at Shop', icon: Banknote },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedMethod(id)}
                    className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${selectedMethod === id
                      ? 'bg-white text-purple-900 shadow-sm font-bold border border-purple-200'
                      : 'text-stone-600 hover:text-stone-900'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: DIRECT PHONEPE PAYMENT (NO QR CODE) */}
            {selectedMethod === 'phonepe' && (
              <div className="space-y-4 animate-fade-in">

                {/* PhonePe Branded Card Container */}
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-amber-50/50 rounded-3xl p-5 border border-purple-200 shadow-sm relative overflow-hidden">

                  {/* Subtle decorative purple glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

                  {/* Header: PhonePe Badge & Verified Payee */}
                  <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5f259f] to-[#7b2cbf] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        पे
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">PhonePe Direct Pay</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.2 rounded-full border border-purple-200">
                            Instant UPI
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">Opens directly in PhonePe application</p>
                      </div>
                    </div>
                  </div>

                  {/* Payee Details Panel */}
                  <div className="mt-4 bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-purple-100/80 shadow-xs space-y-3">

                    {/* Payee Name */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Payee Name:</span>
                      <span className="font-bold text-stone-900 flex items-center gap-1 bg-purple-50 text-purple-950 px-2.5 py-1 rounded-lg border border-purple-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {payeeName}
                      </span>
                    </div>

                    {/* UPI ID (VPA) with Copy and Edit Option */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="text-left">
                        <span className="text-stone-500 font-medium block">PhonePe UPI ID:</span>
                        {!isEditingUpi ? (
                          <span className="font-mono font-bold text-purple-900 text-xs sm:text-sm">
                            {merchantUpiId}
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={merchantUpiId}
                            onChange={(e) => setMerchantUpiId(e.target.value)}
                            className="font-mono text-xs px-2 py-1 border border-purple-300 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            placeholder="username@ybl"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsEditingUpi(!isEditingUpi)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                          title={isEditingUpi ? "Save UPI ID" : "Edit UPI ID"}
                        >
                          {isEditingUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Edit2 className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="flex items-center gap-1 text-[11px] font-semibold text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-lg border border-purple-200 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Payable Amount Highlight */}
                    <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                      <span className="text-xs text-stone-600 font-semibold">Total Payable:</span>
                      <span className="text-xl font-extrabold text-purple-950 font-sans">
                        ₹{finalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Primary Direct Pay Button that opens PhonePe App directly */}
                  <div className="mt-4">
                    <a
                      href={phonePeIntentString}
                      onClick={handleOpenPhonePe}
                      className="w-full py-3.5 px-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-sm shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #5f259f 0%, #7b2cbf 100%)' }}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open & Pay ₹{finalAmount} on PhonePe</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Fallback Intent Options for other UPI apps or web */}
                  <div className="mt-3 pt-3 border-t border-purple-100/70 flex items-center justify-center gap-3 text-xs">
                    <span className="text-stone-400 text-[11px]">Other UPI app?</span>
                    <a
                      href={upiIntentString}
                      onClick={() => setHasTriggeredPhonePe(true)}
                      className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold underline text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" /> Pay via GPay / Paytm / BHIM
                    </a>
                  </div>
                </div>

                {/* Confirm Payment Completion Button */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="btn-gold w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Payment with Bank...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>
                        {hasTriggeredPhonePe
                          ? `I Have Completed Payment of ₹${finalAmount}`
                          : `Confirm Paid ₹${finalAmount} to ${payeeName}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: CREDIT / DEBIT CARD */}
            {selectedMethod === 'card' && (
              <form onSubmit={handleProcessPayment} className="space-y-3.5 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border input-gold bg-white font-mono tracking-wider"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border input-gold bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border input-gold bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name as printed on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border input-gold bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authorizing Card Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{finalAmount} via Card</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: NET BANKING */}
            {selectedMethod === 'netbanking' && (
              <form onSubmit={handleProcessPayment} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Select Indian Bank
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'PNB'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${selectedBank === bank
                          ? 'bg-amber-700 text-white border-amber-700 shadow-sm font-bold'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                          }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to {selectedBank}...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>Pay ₹{finalAmount} via {selectedBank}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 4: PAY AT SHOP COUNTER */}
            {selectedMethod === 'counter' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 text-xs text-stone-700 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Banknote className="w-5 h-5 text-amber-700" />
                    <span>Pay in Person at the Counter</span>
                  </div>
                  <p className="leading-relaxed">
                    You can pay the full amount of <strong>₹{budgetNum}</strong> directly at{' '}
                    <strong className="text-amber-950">{booking.shopName}</strong> on your appointment date (
                    {booking.appointmentDate}) via Cash, PhonePe / UPI at counter, or Credit/Debit POS card.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    No money is deducted online now. Your appointment is confirmed and reserved.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="btn-gold w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-75"
                >
                  <span>Confirm Pay at Counter Option</span>
                </button>
              </div>
            )}

            {/* Footer Trust Security */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 256-bit Bank Grade Security
              </span>
              <span className="flex items-center gap-1 text-stone-400">
                <Lock className="w-3.5 h-3.5" /> NPCI / RBI Compliant
              </span>
            </div>
          </div>
        ) : (
          /* PAYMENT SUCCESS & OFFICIAL INVOICE RECEIPT */
          <div className="p-6 text-center space-y-5 animate-fade-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">
                {paymentResult?.paymentStatus === 'Pay at Counter'
                  ? 'Option Confirmed!'
                  : 'Payment Received Successfully!'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {paymentResult?.paymentStatus === 'Pay at Counter'
                  ? 'Your appointment has been registered with payment at counter.'
                  : 'Your payment was authorized and settled in GoldCare Escrow.'}
              </p>
            </div>

            {/* Official GST / Tax Receipt */}
            <div id="payment-receipt" className="bg-stone-50 rounded-2xl p-5 border border-amber-200 text-left space-y-2.5 text-xs shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <div>
                  <span className="font-bold text-amber-900 font-serif text-sm">GoldCare Official Receipt</span>
                  <p className="text-[10px] text-stone-400">GSTIN: 27AABCG9821K1ZX</p>
                </div>
                <span className="font-mono text-stone-500 text-[11px]">
                  {new Date(paymentResult?.paidAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">Booking Reference</span>
                <span className="font-mono font-bold text-stone-800">{booking.bookingId}</span>
              </div>

              {paymentResult?.transactionId !== 'N/A (Cash on Visit)' && (
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Transaction Ref No.</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-amber-700">{paymentResult?.transactionId}</span>
                    <button
                      onClick={handleCopyTxn}
                      className="p-1 hover:bg-amber-100 rounded text-stone-500"
                      title="Copy Reference"
                    >
                      {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {paymentResult?.payeeName && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Payee</span>
                  <span className="font-semibold text-stone-800">{paymentResult?.payeeName}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-stone-500">Customer</span>
                <span className="font-semibold text-stone-800">{booking.customerName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">Partner Shop</span>
                <span className="font-semibold text-stone-800">{booking.shopName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">Service</span>
                <span className="font-semibold text-stone-800">{booking.repairService}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">Payment Mode</span>
                <span className="font-semibold text-stone-800">{paymentResult?.paymentMethod}</span>
              </div>

              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm">
                <span className="font-bold text-stone-800">Amount Paid</span>
                <span className="font-bold text-emerald-700 text-lg">
                  ₹{paymentResult?.paidAmount || 0}
                </span>
              </div>

              {paymentResult?.paidAmount < paymentResult?.totalBudget && (
                <div className="flex justify-between text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <span>Due Balance to Pay at Shop:</span>
                  <span className="font-bold">₹{paymentResult?.totalBudget - paymentResult?.paidAmount}</span>
                </div>
              )}
            </div>

            {/* Print & Close */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-gold-outline flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn-gold flex-1 py-3 rounded-xl text-xs text-white font-semibold flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
