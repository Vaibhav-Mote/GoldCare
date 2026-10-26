import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  CalendarCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Gem,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { clearAdminSession } from '../services/localStorageService';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Shop Management', to: '/admin/shops', icon: Store },
  { label: 'Bookings', to: '/admin/bookings', icon: CalendarCheck },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAdminSession();
      navigate('/admin/login');
    }
  };

  const handleLinkClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-sm md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 flex flex-col h-screen transition-all duration-300 shrink-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-16' : 'w-72 md:w-64'}`}
        style={{ background: 'linear-gradient(180deg, #1c0a00 0%, #2d1a00 50%, #1c0a00 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-900/40">
          <Link
            to="/admin/dashboard"
            onClick={handleLinkClick}
            className={`flex items-center gap-2.5 ${collapsed ? 'hidden md:hidden' : 'flex'}`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}
            >
              <Gem className="w-4 h-4 text-white" />
            </div>
            <div>
              <div
                className="text-amber-400 font-bold text-lg leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                GoldCare
              </div>
              <div className="text-amber-600 text-[11px] font-medium tracking-wide">
                Admin Panel
              </div>
            </div>
          </Link>

          {/* Collapsed Logo (Desktop only) */}
          {collapsed && (
            <div
              className="w-8 h-8 rounded-full hidden md:flex items-center justify-center mx-auto"
              style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}
            >
              <Gem className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Desktop Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-amber-500 hover:text-amber-300 transition-colors p-1.5 rounded-lg hover:bg-white/5 ml-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden text-amber-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 ml-auto"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group text-sm font-medium ${
                  isActive
                    ? 'sidebar-active text-amber-400 font-semibold bg-amber-950/40 border-l-4 border-amber-500'
                    : 'text-amber-200/70 hover:text-amber-300 hover:bg-amber-900/20'
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-amber-600 group-hover:text-amber-400'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{label}</span>
                )}
                {isActive && (!collapsed || mobileOpen) && (
                  <ChevronRight className="w-4 h-4 ml-auto text-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="border-t border-amber-900/40 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all text-sm font-medium ${
              collapsed && !mobileOpen ? 'justify-center' : ''
            }`}
            title={collapsed && !mobileOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </button>

          {(!collapsed || mobileOpen) && (
            <div className="mt-3 px-2">
              <div className="text-xs text-amber-600/80 leading-relaxed">
                Logged in as <span className="text-amber-400 font-semibold">admin</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
