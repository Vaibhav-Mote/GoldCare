import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Clock, Star, Filter, Store } from 'lucide-react';
import { getShops } from '../services/localStorageService';

const ALL_CITIES = ['All Cities'];
const ALL_SERVICES_FILTER = ['All Services',
  'Gold Ring Repair', 'Gold Chain Repair', 'Necklace Repair', 'Bracelet Repair',
  'Earring Repair', 'Diamond Jewellery Repair', 'Jewellery Polishing',
  'Stone Replacement', 'Jewellery Cleaning', 'Custom Jewellery Repair',
];

export default function Shops() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [serviceFilter, setServiceFilter] = useState('All Services');

  const allShops = getShops().filter((s) => s.status === 'active');
  const cities = ['All Cities', ...new Set(allShops.map((s) => s.city))];

  const filtered = allShops.filter((shop) => {
    const matchSearch =
      !search ||
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.city.toLowerCase().includes(search.toLowerCase()) ||
      shop.address.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === 'All Cities' || shop.city === cityFilter;
    const matchService =
      serviceFilter === 'All Services' ||
      (shop.services || []).includes(serviceFilter);
    return matchSearch && matchCity && matchService;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }} className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3">Our Network</p>
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Find Jewellery Repair Shops
          </h1>
          <p className="text-stone-400 text-lg mb-8">
            Discover trusted jewellery repair specialists near you
          </p>
          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by shop name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-amber-700/30 text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 backdrop-blur"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-amber-100 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-stone-600">Filter:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-sm border border-amber-200 rounded-lg px-3 py-1.5 bg-amber-50 text-stone-700 focus:outline-none focus:border-amber-500"
          >
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="text-sm border border-amber-200 rounded-lg px-3 py-1.5 bg-amber-50 text-stone-700 focus:outline-none focus:border-amber-500"
          >
            {ALL_SERVICES_FILTER.map((s) => <option key={s}>{s}</option>)}
          </select>
          {(search || cityFilter !== 'All Cities' || serviceFilter !== 'All Services') && (
            <button
              onClick={() => { setSearch(''); setCityFilter('All Cities'); setServiceFilter('All Services'); }}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Clear Filters
            </button>
          )}
          <span className="ml-auto text-sm text-stone-500">{filtered.length} shop{filtered.length !== 1 ? 's' : ''} found</span>
        </div>
      </section>

      {/* Shops Grid */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-16 h-16 text-amber-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-700 mb-2">No Shops Found</h3>
              <p className="text-stone-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((shop) => (
                <div key={shop.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden card-hover flex flex-col">
                  {/* Image */}
                  <div className="h-40 flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                    {shop.image ? (
                      <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>🏪</span>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2 py-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-stone-700">{shop.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-stone-800 mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {shop.name}
                    </h3>
                    <p className="text-stone-400 text-xs mb-3">Owner: {shop.owner}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm text-stone-600">
                        <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{shop.address}, {shop.city}, {shop.state} – {shop.pincode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Phone className="w-4 h-4 text-amber-600" />
                        <a href={`tel:${shop.contact}`} className="hover:text-amber-700">{shop.contact}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{shop.openTime} – {shop.closeTime} (Closed: {shop.closingDay})</span>
                      </div>
                    </div>

                    {shop.description && (
                      <p className="text-stone-500 text-sm leading-relaxed mb-4 line-clamp-2">{shop.description}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(shop.services || []).slice(0, 3).map((svc) => (
                        <span key={svc} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                          {svc}
                        </span>
                      ))}
                      {(shop.services || []).length > 3 && (
                        <span className="text-xs text-stone-400">+{shop.services.length - 3} more</span>
                      )}
                    </div>

                    <Link
                      to="/booking"
                      state={{ shopId: shop.id }}
                      className="btn-gold block text-center py-2.5 rounded-xl text-white text-sm font-semibold mt-auto"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
