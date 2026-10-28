import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gem,
  Star,
  ShieldCheck,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  Phone,
  Sparkles,
  Search,
  ArrowRight,
  MapPin,
  Wrench,
  Zap,
  Tag,
  Percent,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Truck,
  Shield,
  Heart,
  TrendingUp,
  BadgeCheck,
  PackageCheck
} from 'lucide-react';
import { getShops } from '../services/localStorageService';
import ringResizeImg from '../assets/deals/ring-resizing.jpg';
import chainSolderImg from '../assets/deals/chain-soldering.jpg';
import diamondSettingImg from '../assets/deals/diamond-setting.jpg';

// Flipkart/Amazon Style Top Category Bubble Icons
const QUICK_CATEGORIES = [
  { id: 'all', name: 'Top Offers', discount: 'Min 40% Off', icon: '🔥', tag: 'Hot Deals' },
  { id: 'rings', name: 'Ring Repair', discount: 'From ₹299', icon: '💍', tag: 'Fast Sizing' },
  { id: 'chains', name: 'Gold Chains', discount: 'Laser Solder ₹399', icon: '⛓️', tag: 'Same Day' },
  { id: 'necklaces', name: 'Necklaces', discount: 'Up to 35% Off', icon: '📿', tag: 'Bridal Care' },
  { id: 'diamonds', name: 'Diamonds', discount: 'Prong Fix ₹499', icon: '💎', tag: 'Certified' },
  { id: 'polishing', name: 'Deep Polish', discount: 'Free Ultrasonic', icon: '✨', tag: 'High Gloss' },
  { id: 'bangles', name: 'Bangles & Kadas', discount: 'From ₹349', icon: '🪙', tag: 'Reshaping' },
  { id: 'heirloom', name: 'Antique Care', discount: 'Master Artisan', icon: '👑', tag: 'Heirloom' },
  { id: 'stones', name: 'Stone Reset', discount: '100% Match', icon: '💠', tag: 'Ruby/Emerald' },
];

// Amazon/Flipkart Hero Big Banners
const HERO_SLIDES = [
  {
    id: 1,
    title: 'The Great Indian Jewellery Care Festival',
    badge: 'MEGA SALE • LIVE NOW',
    sub: 'Up to 50% Off on Laser Soldering, Ring Resizing & Ultrasonic Cleaning',
    promoCode: 'GOLDCARE50',
    ctaText: 'Grab Repair Deals',
    ctaLink: '/booking',
    bgGradient: 'from-amber-950 via-stone-900 to-amber-900',
    highlight: '100% Insured Transit + Free Hallmark Check',
    accentColor: '#f59e0b',
    badgeBg: 'bg-amber-500 text-stone-950',
    artIcon: '💎'
  },
  {
    id: 2,
    title: '2-Hour Express Laser Bench Service',
    badge: 'SAME-DAY DISPATCH',
    sub: 'Broken chain or loose gemstone? Get it fixed in 120 minutes with certified artisans',
    promoCode: 'EXPRESS24',
    ctaText: 'Book 2-Hour Slot',
    ctaLink: '/booking',
    bgGradient: 'from-purple-950 via-stone-900 to-indigo-950',
    highlight: 'Zero Wait Time • Micro-Laser Precision Soldering',
    accentColor: '#a855f7',
    badgeBg: 'bg-purple-500 text-white',
    artIcon: '⚡'
  },
  {
    id: 3,
    title: 'Bridal & Heirloom Antique Restoration Week',
    badge: 'PREMIUM CRAFTSMANSHIP',
    sub: 'Complete ultrasonic detox, 24K gold micron rhodium plating & prong reinforcement',
    promoCode: 'BRIDALSHINE',
    ctaText: 'Explore Packages',
    ctaLink: '/services',
    bgGradient: 'from-rose-950 via-stone-900 to-amber-950',
    highlight: 'Free Pickup & Delivery from Top Rated Partner Boutiques',
    accentColor: '#f43f5e',
    badgeBg: 'bg-rose-500 text-white',
    artIcon: '👑'
  }
];

// Lightning / Deals of the Day (Amazon Today's Deals / Flipkart Deal of the Day)
const LIGHTNING_DEALS = [
  {
    id: 'd1',
    title: 'Gold Ring Laser Resizing & Shape Correction',
    category: 'Rings',
    serviceKey: 'Gold Ring Repair',
    originalPrice: 1200,
    dealPrice: 599,
    discount: '50% OFF',
    rating: 4.9,
    reviews: '2.4k',
    claimed: 78,
    badge: 'Deal of the Day',
    isAssured: true,
    image: ringResizeImg,
    hasEmbeddedBadges: true,
    imageIcon: '💍',
    turnaround: '2 Hours'
  },
  {
    id: 'd2',
    title: 'Chain Invisible Micro-Laser Solder + Clasp Fix',
    category: 'Chains',
    serviceKey: 'Gold Chain Repair',
    originalPrice: 950,
    dealPrice: 449,
    discount: '53% OFF',
    rating: 4.8,
    reviews: '1.8k',
    claimed: 92,
    badge: 'Lightning Deal',
    isAssured: true,
    image: chainSolderImg,
    imageIcon: '⛓️',
    turnaround: 'Same Day'
  },
  {
    id: 'd3',
    title: 'Diamond 4-Prong Tightening & Setting Security',
    category: 'Diamonds',
    serviceKey: 'Diamond Jewellery',
    originalPrice: 1600,
    dealPrice: 799,
    discount: '50% OFF',
    rating: 4.9,
    reviews: '950',
    claimed: 64,
    badge: 'Best Seller',
    isAssured: true,
    image: diamondSettingImg,
    imageIcon: '💎',
    turnaround: '24 Hours'
  },
  {
    id: 'd4',
    title: 'Full 24K Mirror Polish + Ultrasonic Detox',
    category: 'Polishing',
    serviceKey: 'Jewellery Polishing',
    originalPrice: 799,
    dealPrice: 299,
    discount: '62% OFF',
    rating: 4.9,
    reviews: '3.1k',
    claimed: 86,
    badge: 'Hot Offer',
    isAssured: true,
    imageIcon: '✨',
    turnaround: '60 Mins'
  },
  {
    id: 'd5',
    title: 'Emerald/Ruby Lost Stone Matching & Resetting',
    category: 'Gemstones',
    serviceKey: 'Stone Replacement',
    originalPrice: 2200,
    dealPrice: 1199,
    discount: '45% OFF',
    rating: 4.7,
    reviews: '820',
    claimed: 55,
    badge: 'Artisan Choice',
    isAssured: true,
    imageIcon: '💠',
    turnaround: '1-2 Days'
  },
  {
    id: 'd6',
    title: 'Mangalsutra Knotting & Reinforced Wire Restringing',
    category: 'Necklace',
    serviceKey: 'Necklace Repair',
    originalPrice: 1100,
    dealPrice: 549,
    discount: '50% OFF',
    rating: 4.8,
    reviews: '1.2k',
    claimed: 80,
    badge: 'Festive Deal',
    isAssured: true,
    imageIcon: '📿',
    turnaround: '3 Hours'
  }
];

// Amazon Style 4-in-1 Quad Grids
const QUAD_CARDS = [
  {
    title: 'Keep Repairing & Save Big',
    subtitle: 'Frequently booked together',
    linkText: 'See all packages',
    linkTo: '/services',
    items: [
      { name: 'Ring Resizing', price: '₹499', icon: '💍', tag: 'Fast' },
      { name: 'Chain Solder', price: '₹399', icon: '⛓️', tag: 'Laser' },
      { name: 'Deep Polish', price: '₹299', icon: '✨', tag: 'Ultrasonic' },
      { name: 'Prong Fix', price: '₹599', icon: '💎', tag: 'Secure' },
    ]
  },
  {
    title: 'GoldCare Assured Guarantee',
    subtitle: 'Marketplace safety promise',
    linkText: 'Learn about trust & safety',
    linkTo: '/services',
    items: [
      { name: '100% Insured Transit', price: 'Zero Risk', icon: '🛡️', tag: 'Insured' },
      { name: 'Live CCTV Bench', price: 'Transparent', icon: '📹', tag: 'Live' },
      { name: 'Hallmark Verified', price: 'Govt BIS', icon: '🏆', tag: 'Certified' },
      { name: '7-Day Warranty', price: 'Free Retouch', icon: '⭐', tag: 'Guaranteed' },
    ]
  },
  {
    title: 'Shop by Budget Store',
    subtitle: 'Transparent, upfront pricing',
    linkText: 'View pricing calculator',
    linkTo: '/booking',
    items: [
      { name: 'Under ₹499', price: 'Cleaning & Clasps', icon: '🏷️', tag: 'Budget' },
      { name: 'Under ₹999', price: 'Soldering & Resizing', icon: '💳', tag: 'Popular' },
      { name: 'Under ₹1999', price: 'Plating & Stones', icon: '✨', tag: 'Value' },
      { name: 'Premium', price: 'Complete Restorations', icon: '👑', tag: 'Elite' },
    ]
  },
  {
    title: 'Verified Master Goldsmiths',
    subtitle: 'Top-rated artisan shops',
    linkText: 'Browse partner shops',
    linkTo: '/shops',
    items: [
      { name: 'Zaveri Bazaar', price: '4.9 ★', icon: '🏪', tag: 'Mumbai' },
      { name: 'Chandni Chowk', price: '4.8 ★', icon: '🏛️', tag: 'Delhi' },
      { name: 'Commercial St', price: '4.9 ★', icon: '🏬', tag: 'Bangalore' },
      { name: 'T Nagar Jewellers', price: '4.7 ★', icon: '🛕', tag: 'Chennai' },
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('all');

  // Amazon/Flipkart Lightning Deals Live Timer (Countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 19 });

  const shops = getShops().filter((s) => s.status === 'active').slice(0, 4);

  // Auto-advance banner carousel like Amazon / Flipkart
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  // Live countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/booking?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/booking');
    }
  };

  const filteredDeals = activeTab === 'all'
    ? LIGHTNING_DEALS
    : LIGHTNING_DEALS.filter((d) => d.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="bg-[#f1f3f6] min-h-screen text-stone-800 pb-16 font-sans">

      {/* 1. AMAZON / FLIPKART STYLE TOP SUB-NAV SEARCH BAR */}
      <div className="bg-gradient-to-r from-[#1a0e00] via-[#2b1704] to-[#1a0e00] pt-20 pb-4 px-4 sm:px-6 shadow-md border-b border-amber-900/40 text-white">
        <div className="max-w-7xl mx-auto space-y-3">

          <div className="flex flex-col md:flex-row items-center gap-3">

            {/* Delivery Location Pincode (Amazon 'Deliver to' style) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer border border-amber-500/20 text-xs shrink-0 transition-colors">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-200/70 block leading-tight">Deliver to</span>
                <span className="font-bold text-white tracking-wide">Mumbai 400001</span>
              </div>
            </div>

            {/* Central Big Search Bar with Category Select & Gold Search Button */}
            <form onSubmit={handleSearch} className="flex-1 w-full flex items-center shadow-lg rounded-xl overflow-hidden bg-white border-2 border-amber-400">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-3 border-r border-stone-300 focus:outline-none hidden sm:block cursor-pointer shrink-0"
              >
                <option value="All">All Categories</option>
                <option value="Rings">Rings & Bands</option>
                <option value="Chains">Gold Chains</option>
                <option value="Diamonds">Diamond Prongs</option>
                <option value="Polishing">Polishing & Rhodium</option>
                <option value="Necklace">Necklace & Heirlooms</option>
              </select>

              <input
                type="text"
                placeholder="Search for jewellery repairs, laser soldering, ring sizing, diamond settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-white font-medium"
              />

              <button
                type="submit"
                className="px-5 py-3 text-stone-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:brightness-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                <Search className="w-4 h-4 text-stone-950" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Search</span>
              </button>
            </form>

            {/* Flipkart SuperCoin / GoldCare Assured Tag */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs shrink-0">
              <BadgeCheck className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-amber-300 block text-[11px]">GoldCare Assured™</span>
                <span className="text-[10px] text-stone-300">BIS Hallmarked & Insured</span>
              </div>
            </div>
          </div>

          {/* Quick Trending Keywords */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px] text-amber-200/80 pt-1">
            <span className="text-amber-400 font-bold flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3.5 h-3.5" /> Trending:
            </span>
            {['Ring Resizing (2h)', 'Gold Chain Laser Solder', 'Ultrasonic Polish (Free)', 'Diamond Prong Tightening', 'Antique Mangalsutra Restring'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => navigate(`/booking?search=${encodeURIComponent(term)}`)}
                className="hover:text-white hover:underline bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 space-y-4">

        {/* 2. FLIPKART STYLE TOP ROUNDED CATEGORY STRIP */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-stone-200/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[760px] gap-2">
            {QUICK_CATEGORIES.map((cat) => {
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex flex-col items-center group transition-all p-2 rounded-xl text-center flex-1 ${isSelected ? 'bg-amber-50/80 ring-2 ring-amber-500/50' : 'hover:bg-stone-50'
                    }`}
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200 shadow-2xs flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-1.5">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-stone-800 whitespace-nowrap block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200/60 mt-0.5 whitespace-nowrap">
                    {cat.discount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. AMAZON / FLIPKART STYLE BIG HERO CAROUSEL */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-300/60">
          <div className="relative min-h-[340px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
            {HERO_SLIDES.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} p-6 sm:p-10 md:p-14 flex items-center justify-between transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                >
                  {/* Decorative background circle */}
                  <div className="absolute right-10 top-0 bottom-0 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

                  {/* Left Content */}
                  <div className="max-w-2xl text-white space-y-4 z-10">
                    <div className="inline-flex items-center gap-2">
                      <span className={`text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${slide.badgeBg}`}>
                        {slide.badge}
                      </span>
                      <span className="text-xs text-amber-200 font-mono font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                        Code: {slide.promoCode}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-serif text-white">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base text-stone-200 max-w-xl font-normal leading-relaxed">
                      {slide.sub}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold pt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{slide.highlight}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <Link
                        to={slide.ctaLink}
                        className="px-6 py-3.5 rounded-xl font-bold text-sm text-stone-950 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <Link
                        to="/track"
                        className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
                      >
                        Track Order / Booking
                      </Link>
                    </div>
                  </div>

                  {/* Right Animated Visual Element */}
                  <div className="hidden lg:flex items-center justify-center shrink-0 pr-8">
                    <div className="relative">
                      <div className="w-64 h-64 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-2xl">
                        <span className="text-9xl animate-pulse">{slide.artIcon}</span>
                      </div>
                      <div className="absolute -bottom-3 -right-3 bg-amber-500 text-stone-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-300">
                        ⚡ Instant Booking
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Slider Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20 shadow-md"
              title="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/20 shadow-md"
              title="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. FLIPKART / AMAZON LIGHTNING "DEALS OF THE DAY" WITH COUNTDOWN TIMER */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">

          {/* Section Header: Timer + See All Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                    Deals of the Day
                  </h2>
                  <p className="text-xs text-stone-500">Highest discounted jewellery care packages</p>
                </div>
              </div>

              {/* Live Countdown Box (Amazon Lightning Timer) */}
              <div className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 text-xs font-bold font-mono">
                <Clock className="w-3.5 h-3.5 text-red-600 animate-spin-slow" />
                <span>Ends in: </span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[11px]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <Link
              to="/services"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto transition-colors flex items-center gap-1"
            >
              <span>View All 30+ Deals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Deals Grid Cards (Amazon product cards look & feel) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-400 p-2.5 sm:p-3 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 relative"
              >
                {/* Discount Badge */}
                {!deal.hasEmbeddedBadges && (
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 pointer-events-none">
                    <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                      {deal.discount}
                    </span>
                  </div>
                )}

                {/* Turnaround Tag */}
                {!deal.hasEmbeddedBadges && (
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
                    <span className="bg-stone-900/80 text-amber-300 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {deal.turnaround}
                    </span>
                  </div>
                )}

                <div>
                  {/* Icon / Image Placeholder Box */}
                  <Link
                    to={`/booking?service=${encodeURIComponent(deal.serviceKey)}`}
                    className="h-36 sm:h-36 lg:h-32 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center justify-center text-5xl mb-2 sm:mb-2.5 group-hover:scale-105 transition-transform overflow-hidden relative block"
                  >
                    {deal.image ? (
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      deal.imageIcon
                    )}
                  </Link>

                  {/* Title & Category */}
                  <Link
                    to={`/booking?service=${encodeURIComponent(deal.serviceKey)}`}
                    className="font-bold text-stone-900 text-xs line-clamp-2 leading-snug mb-1 hover:text-amber-600 transition-colors block"
                  >
                    {deal.title}
                  </Link>

                  {/* Star Rating & Assured Badge */}
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
                    <span className="bg-emerald-700 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      {deal.rating} <Star className="w-2.5 h-2.5 fill-white" />
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-stone-400">({deal.reviews})</span>
                    {deal.isAssured && (
                      <span className="text-[8px] sm:text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded border border-amber-200">
                        Assured
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Block & Action Button */}
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-baseline gap-1.5 mb-1.5 sm:mb-2">
                    <span className="text-sm sm:text-base font-extrabold text-stone-900 font-sans">
                      ₹{deal.dealPrice}
                    </span>
                    <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                      ₹{deal.originalPrice}
                    </span>
                  </div>

                  {/* Claimed progress bar (Amazon Lightning Deal progress) */}
                  <div className="mb-2 sm:mb-2.5">
                    <div className="flex justify-between text-[8px] sm:text-[9px] text-stone-500 mb-0.5 font-medium">
                      <span>Claimed: {deal.claimed}%</span>
                      <span className="text-red-600 font-bold">Limited Slots</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${deal.claimed}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/booking?service=${encodeURIComponent(deal.serviceKey)}`}
                    className="w-full py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl text-center block transition-all shadow-xs hover:shadow"
                  >
                    Book Deal
                  </Link>
                </div>
              </div>
            ))}
    </div>
        </div >

    {/* 5. AMAZON 4-IN-1 QUAD GRID CARDS (Signature Amazon Desktop UI) */ }
    < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
    {
      QUAD_CARDS.map((quad) => (
        <div
          key={quad.title}
          className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-extrabold text-stone-900 leading-tight">
              {quad.title}
            </h3>
            <p className="text-xs text-stone-400 mb-3">{quad.subtitle}</p>

            {/* 2x2 Inner Mini Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {quad.items.map((item) => (
                <Link
                  key={item.name}
                  to={quad.linkTo}
                  className="group p-2.5 rounded-2xl bg-stone-50 hover:bg-amber-50/70 border border-stone-200/80 hover:border-amber-300 transition-all text-left flex flex-col justify-between"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-xl mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-stone-800 line-clamp-1 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold block">
                      {item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Card Link */}
          <Link
            to={quad.linkTo}
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>{quad.linkText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ))
    }
        </div >

    {/* 6. VERIFIED PARTNER SHOPS (Marketplace Sellers Grid) */ }
  {
    shops.length > 0 && (
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                Top Verified Jewellery Workshops Near You
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Live Status
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Government BIS Hallmarked and equipped with advanced laser soldering workstations
            </p>
          </div>

          <Link
            to="/shops"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Explore All Shops</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-stone-50/70 rounded-2xl border border-stone-200 hover:border-amber-300 p-4 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl shadow-2xs">
                    🏪
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Open Now
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 text-sm mb-1">{shop.name}</h3>

                <div className="flex items-center gap-1 mb-2">
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    {shop.rating || '4.8'} <Star className="w-2.5 h-2.5 fill-white" />
                  </span>
                  <span className="text-[11px] text-stone-500">
                    • Verified Artisan
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="line-clamp-1">{shop.city}, {shop.state}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {(shop.services || []).slice(0, 2).map((svc) => (
                    <span key={svc} className="text-[10px] bg-white text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/booking"
                className="w-full py-2 bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold rounded-xl text-center block transition-colors"
              >
                Select Artisan
              </Link>
            </div>
          ))}
        </div>
      </div>
    )
  }

  {/* 7. AMAZON ASSURED & TRUST BADGES FOOTER STRIP */ }
  <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-3xl p-6 text-white shadow-lg">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-amber-700/60">
      <div className="flex flex-col items-center pt-2 md:pt-0">
        <Truck className="w-8 h-8 text-amber-300 mb-2" />
        <h4 className="font-bold text-sm">Insured Doorstep Pickup</h4>
        <p className="text-[11px] text-amber-200/80 max-w-xs mt-0.5">
          Safe tamper-proof transit pouch with OTP verification
        </p>
      </div>

      <div className="flex flex-col items-center pt-2 md:pt-0">
        <ShieldCheck className="w-8 h-8 text-amber-300 mb-2" />
        <h4 className="font-bold text-sm">100% BIS Hallmarked</h4>
        <p className="text-[11px] text-amber-200/80 max-w-xs mt-0.5">
          Tested gold purity with government approved XRF scanners
        </p>
      </div>

      <div className="flex flex-col items-center pt-2 md:pt-0">
        <Clock className="w-8 h-8 text-amber-300 mb-2" />
        <h4 className="font-bold text-sm">Same-Day Express Bench</h4>
        <p className="text-[11px] text-amber-200/80 max-w-xs mt-0.5">
          90% of ring sizing & soldering completed within hours
        </p>
      </div>

      <div className="flex flex-col items-center pt-2 md:pt-0">
        <Award className="w-8 h-8 text-amber-300 mb-2" />
        <h4 className="font-bold text-sm">7-Day Free Warranty</h4>
        <p className="text-[11px] text-amber-200/80 max-w-xs mt-0.5">
          Complete peace of mind with 100% escrow protection
        </p>
      </div>
    </div>
  </div>

  {/* 8. QUICK CTA BANNER */ }
  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 text-center space-y-3">
    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
      India's #1 Jewellery Repair Marketplace
    </span>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
      Restore Your Precious Jewellery to Showroom Brilliance
    </h2>
    <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
      Book an appointment online, pay securely via PhonePe or at counter, and get lifetime guaranteed repairs.
    </p>
    <div className="pt-2 flex flex-wrap justify-center gap-3">
      <Link
        to="/booking"
        className="btn-gold px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-md flex items-center gap-2"
      >
        <span>Book Appointment Now</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
      <a
        href="tel:+918800123456"
        className="px-6 py-3.5 rounded-xl border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
      >
        <Phone className="w-4 h-4 text-amber-700" />
        <span>Expert Artisan Helpline</span>
      </a>
    </div>
  </div>

      </div >
    </div >
  );
}
