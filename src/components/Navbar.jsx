import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Gem, Phone, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Shops', to: '/shops' },
  { label: 'Book Repair', to: '/booking' },
  { label: 'Track Booking', to: '/track' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-amber-100/50 border-b border-amber-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #b45309, #d97706, #f59e0b)' }}>
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-wide text-gold-gradient"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                GoldCare
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'text-amber-700 bg-amber-50 font-semibold'
                    : 'text-stone-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/admin/login"
              className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
            >
              Admin
            </Link>
            <Link
              to="/booking"
              className="btn-gold px-5 py-2.5 rounded-full text-sm text-white font-semibold shadow-md"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-amber-50 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 shadow-xl animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'text-amber-700 bg-amber-50 font-semibold'
                    : 'text-stone-700 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-amber-100 flex flex-col gap-2">
              <Link
                to="/admin/login"
                className="block px-4 py-3 text-sm text-stone-600 hover:text-amber-700"
              >
                Admin Login
              </Link>
              <Link
                to="/booking"
                className="btn-gold block text-center px-4 py-3 rounded-lg text-sm text-white font-semibold"
              >
                Book Repair Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
