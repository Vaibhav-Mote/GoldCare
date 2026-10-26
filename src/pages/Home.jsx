import { Link } from 'react-router-dom';
import {
  Gem, Star, Shield, Clock, Award, ChevronRight, Phone,
  CheckCircle, Sparkles, Search, ArrowRight, MapPin, Users, Wrench
} from 'lucide-react';
import { getShops } from '../services/localStorageService';

const SERVICES = [
  { icon: '💍', name: 'Gold Ring Repair', desc: 'Resize, reshape & restore your precious rings' },
  { icon: '⛓️', name: 'Gold Chain Repair', desc: 'Fix broken links, clasps, and solder repairs' },
  { icon: '📿', name: 'Necklace Repair', desc: 'Expert necklace restoration & reconnection' },
  { icon: '🪙', name: 'Diamond Jewellery', desc: 'Professional diamond setting & prong repair' },
  { icon: '✨', name: 'Jewellery Polishing', desc: 'Restore the original lustre and brilliance' },
  { icon: '💎', name: 'Stone Replacement', desc: 'Replace lost gemstones with perfect matches' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Book Online', desc: 'Fill in a simple form with your repair requirements and preferred appointment time.', icon: Search },
  { step: '02', title: 'Visit the Shop', desc: 'Bring your jewellery to the chosen shop at your scheduled appointment.', icon: MapPin },
  { step: '03', title: 'Expert Repair', desc: 'Our master craftsmen carefully repair and restore your precious jewellery.', icon: Wrench },
  { step: '04', title: 'Collect & Shine', desc: 'Receive your beautifully repaired jewellery, looking as good as new.', icon: Sparkles },
];

const TESTIMONIALS = [
  { name: 'Priya Kapoor', location: 'Mumbai', rating: 5, text: 'GoldCare found me the perfect jeweller to fix my grandmother\'s antique necklace. The repair was flawless and they were incredibly careful.' },
  { name: 'Rahul Mehta', location: 'Delhi', rating: 5, text: 'Absolutely seamless experience! Booked a ring repair online, got a confirmation within hours, and the result was perfect. Highly recommend!' },
  { name: 'Ananya Singh', location: 'Bangalore', rating: 5, text: 'Finally a platform that connects you to trusted jewellery repairers. The diamond setting repair was done brilliantly. Will use again!' },
];

const WHY_CHOOSE = [
  { icon: Shield, title: 'Trusted Craftsmen', desc: 'All shops are verified and rated by real customers' },
  { icon: Award, title: 'Quality Guaranteed', desc: 'Work guaranteed with transparent pricing' },
  { icon: Clock, title: 'Timely Delivery', desc: 'Committed repair timelines, no delays' },
  { icon: Star, title: 'Premium Experience', desc: 'End-to-end booking and tracking convenience' },
];

export default function Home() {
  const shops = getShops().filter((s) => s.status === 'active').slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center hero-pattern"
        style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #2d1a00 40%, #3d2a00 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
          <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #d97706, transparent)' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-700 bg-amber-950/50 mb-6">
                <Gem className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">India's Trusted Jewellery Repair Platform</span>
              </div>

              <h1
                className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Jewellery Deserves{' '}
                <span className="text-gold-gradient">Expert Care.</span>
              </h1>

              <p className="text-lg text-stone-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with India's finest jewellery craftsmen. Book expert repair services for gold, 
                diamond, and precious jewellery — from the comfort of your home.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/booking"
                  className="btn-gold px-8 py-4 rounded-full text-white font-semibold text-base inline-flex items-center gap-2 justify-center"
                >
                  Book a Repair
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/track"
                  className="btn-gold-outline px-8 py-4 rounded-full font-semibold text-base inline-flex items-center gap-2 justify-center"
                >
                  Track My Booking
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 justify-center lg:justify-start">
                {[
                  { val: '500+', label: 'Happy Customers' },
                  { val: '50+', label: 'Expert Shops' },
                  { val: '4.8★', label: 'Average Rating' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-amber-400">{val}</div>
                    <div className="text-xs text-stone-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full border-2 border-amber-700/30 flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.15), transparent)' }}>
                  <div className="w-60 h-60 rounded-full border border-amber-600/40 flex items-center justify-center"
                    style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1), transparent)' }}>
                    <div className="text-8xl animate-pulse-gold">💎</div>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -left-8 top-10 bg-white/10 backdrop-blur border border-amber-700/30 rounded-2xl p-3 animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-white text-xs">Booking Confirmed!</span>
                  </div>
                </div>
                <div className="absolute -right-8 bottom-16 bg-white/10 backdrop-blur border border-amber-700/30 rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-stone-800 section-title section-title-center mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Our Repair Services
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto mt-6">
              From simple repairs to intricate restoration, our expert craftsmen handle all types of fine jewellery.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="card-hover bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 text-center">
                <div className="text-4xl mb-4">{svc.icon}</div>
                <h3 className="text-stone-800 font-bold text-lg mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {svc.name}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-gold-outline px-8 py-3 rounded-full inline-flex items-center gap-2 font-semibold">
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              How It Works
            </h2>
            <p className="text-stone-400 max-w-xl mx-auto mt-4">
              Get your jewellery repaired in four simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-amber-700 text-4xl font-bold mb-3 opacity-30">{step.step}</div>
                <h3 className="text-white font-bold text-xl mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  {step.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-4 top-6 text-amber-700 w-8 h-8 opacity-50" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/booking"
              className="btn-gold px-10 py-4 rounded-full text-white font-semibold inline-flex items-center gap-2">
              Book Your Repair Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-3">Why GoldCare</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-stone-800 mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                We Take Care of What Matters Most to You
              </h2>
              <p className="text-stone-600 leading-relaxed mb-8">
                Your jewellery holds memories, emotions, and immense value. GoldCare connects you with 
                verified expert craftsmen who treat every piece with the reverence it deserves.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">{title}</h4>
                      <p className="text-stone-500 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '💍', label: 'Rings', count: '1200+ repaired' },
                { emoji: '⛓️', label: 'Chains', count: '800+ repaired' },
                { emoji: '💎', label: 'Diamonds', count: '450+ serviced' },
                { emoji: '🪙', label: 'Heirlooms', count: '200+ restored' },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-amber-100 card-hover">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <div className="font-bold text-stone-800 text-lg">{item.label}</div>
                  <div className="text-amber-700 text-xs font-medium mt-1">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SHOPS */}
      {shops.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-amber-700 font-semibold text-sm uppercase tracking-wider mb-3">Trusted Partners</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-stone-800 section-title section-title-center mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Featured Jewellery Shops
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div key={shop.id} className="card-hover bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
                  <div className="h-36 flex items-center justify-center text-6xl"
                    style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                    🏪
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-stone-800 text-xl mb-1">{shop.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(shop.rating || 4) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`} />
                      ))}
                      <span className="text-xs text-stone-500 ml-1">{shop.rating || 4.5}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {shop.city}, {shop.state}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(shop.services || []).slice(0, 2).map((svc) => (
                        <span key={svc} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                          {svc}
                        </span>
                      ))}
                    </div>
                    <Link to="/booking" className="btn-gold block text-center py-2.5 rounded-xl text-white text-sm font-semibold">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/shops" className="btn-gold-outline px-8 py-3 rounded-full inline-flex items-center gap-2 font-semibold">
                View All Shops <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-stone-900 to-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">What Customers Say</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Stories of Trust & Care
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-amber-900/30 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-stone-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-amber-600 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ready to Restore Your Jewellery?
          </h2>
          <p className="text-amber-100 text-lg mb-8">
            Book your appointment today and let our experts bring back the shine.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/booking"
              className="bg-white text-amber-800 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-colors inline-flex items-center gap-2 shadow-xl">
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:+918800123456"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
              <Phone className="w-5 h-5" /> Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
