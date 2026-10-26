import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ALL_SERVICES = [
  {
    emoji: '💍',
    name: 'Gold Ring Repair',
    desc: 'Our skilled craftsmen repair bent bands, resize rings, fix broken shanks, and restore damaged prongs with precision. We handle all gold karats including 18K, 22K, and 24K.',
    features: ['Band reshaping & resizing', 'Prong re-tipping', 'Shank repair & replacement', 'Stone retightening'],
    duration: '1–3 days',
    price: '₹500 – ₹3,000',
  },
  {
    emoji: '⛓️',
    name: 'Gold Chain Repair',
    desc: 'Whether your chain has a broken link, snapped clasp, or needs soldering, our jewellers expertly restore it to its original strength and appearance.',
    features: ['Broken link soldering', 'Clasp replacement', 'Length adjustment', 'Strength reinforcement'],
    duration: '1–2 days',
    price: '₹400 – ₹2,500',
  },
  {
    emoji: '📿',
    name: 'Necklace Repair',
    desc: 'From simple clasp fixes to complete pendant reattachment and chain restoration, we handle all types of necklace repairs with the utmost care.',
    features: ['Clasp & hook repair', 'Pendant reattachment', 'Chain restructuring', 'Antique restoration'],
    duration: '1–4 days',
    price: '₹600 – ₹5,000',
  },
  {
    emoji: '💎',
    name: 'Bracelet Repair',
    desc: 'Whether it\'s a tennis bracelet, bangles, or charm bracelet — our experts repair all styles. We fix broken links, replace clasps, and restore broken sections.',
    features: ['Link & clasp repair', 'Bangle reshaping', 'Charm reattachment', 'Spring/box clasp replacement'],
    duration: '1–3 days',
    price: '₹500 – ₹4,000',
  },
  {
    emoji: '👂',
    name: 'Earring Repair',
    desc: 'Lost a backing, broken a hook, or a stud came loose? Our jewellers repair all styles of earrings including studs, danglers, huggies, and drops.',
    features: ['Hook & post repair', 'Back replacement', 'Setting repair', 'Drop reattachment'],
    duration: 'Same day – 2 days',
    price: '₹300 – ₹2,000',
  },
  {
    emoji: '💍',
    name: 'Diamond Jewellery Repair',
    desc: 'Expert diamond jewellery repairs including prong retipping, bezel resetting, and securing loose stones, performed by certified diamond setters.',
    features: ['Prong retipping & building', 'Stone resetting', 'Bezel repair', 'Pavé & channel settings'],
    duration: '2–5 days',
    price: '₹1,500 – ₹10,000',
  },
  {
    emoji: '✨',
    name: 'Jewellery Polishing',
    desc: 'Restore the original mirror finish and shine to your precious jewellery. We use professional polishing wheels and compounds for a flawless result.',
    features: ['Mirror finish polishing', 'Anti-tarnish treatment', 'Rhodium plating for white gold', 'Gold plating refresh'],
    duration: 'Same day – 1 day',
    price: '₹300 – ₹1,500',
  },
  {
    emoji: '🪨',
    name: 'Stone Replacement',
    desc: 'Lost a gemstone? We source and set replacement diamonds, rubies, emeralds, sapphires, and semi-precious stones that perfectly match your original.',
    features: ['Diamond sourcing & setting', 'Coloured gemstone replacement', 'Synthetic stone replacement', 'Perfect colour matching'],
    duration: '3–7 days',
    price: '₹500 – ₹20,000+',
  },
  {
    emoji: '🧼',
    name: 'Jewellery Cleaning',
    desc: 'Professional ultrasonic cleaning, steam cleaning, and hand polishing to restore your jewellery\'s original brilliance and remove built-up dirt and oils.',
    features: ['Ultrasonic deep cleaning', 'Steam cleaning', 'Safe chemical cleaning', 'Post-cleaning polish'],
    duration: 'Same day',
    price: '₹200 – ₹800',
  },
  {
    emoji: '🎨',
    name: 'Custom Jewellery Repair',
    desc: 'Have a unique repair request? Our master craftsmen handle custom repairs, modifications, and special restoration projects not covered by standard services.',
    features: ['Custom modifications', 'Antique restoration', 'Jewellery redesign', 'Special finish applications'],
    duration: '3–10 days',
    price: 'Custom quote',
  },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Our Jewellery Repair Services
          </h1>
          <p className="text-stone-400 text-lg">
            From quick polishing to intricate diamond setting repairs — our craftsmen handle every type of fine jewellery with expert care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_SERVICES.map((svc) => (
              <div key={svc.name} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden card-hover flex flex-col">
                {/* Icon header */}
                <div className="h-28 flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                  {svc.emoji}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {svc.name}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4">{svc.desc}</p>

                  <div className="space-y-1.5 mb-4">
                    {svc.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-stone-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 border-t border-amber-50 pt-3 mb-4 mt-auto">
                    <span>⏱ {svc.duration}</span>
                    <span className="text-amber-700 font-semibold">{svc.price}</span>
                  </div>

                  <Link
                    to="/booking"
                    state={{ service: svc.name }}
                    className="btn-gold block text-center py-2.5 rounded-xl text-white text-sm font-semibold"
                  >
                    Book Now <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14" style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Can't find your specific repair?
          </h2>
          <p className="text-amber-100 mb-6">
            Book a custom repair consultation and our experts will assess your jewellery's needs.
          </p>
          <Link
            to="/booking"
            className="bg-white text-amber-800 font-bold px-8 py-3.5 rounded-full hover:bg-amber-50 transition-colors inline-flex items-center gap-2"
          >
            Book Custom Repair <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
