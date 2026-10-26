import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Gem, LogOut, ExternalLink } from 'lucide-react';
import { clearAdminSession } from '../services/localStorageService';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAdminSession();
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden flex-col md:flex-row">
      {/* Mobile Top App Bar (Visible only on mobile) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1c0a00] text-white border-b border-amber-900/40 z-30 shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 -ml-1 text-amber-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}
            >
              <Gem className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-amber-300 text-lg tracking-wide leading-none"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              GoldCare
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-amber-900/40"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-white/5"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Sidebar: Responsive Drawer on mobile, Sticky sidebar on desktop */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content: Full width on mobile */}
      <main className="flex-1 overflow-y-auto w-full min-w-0 bg-stone-50">
        <Outlet />
      </main>
    </div>
  );
}
