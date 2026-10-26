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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAdminSession();
      navigate('/admin/login');
    }
  };

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, #1c0a00 0%, #2d1a00 50%, #1c0a00 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-amber-900/30">
        {!collapsed && (
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
              <Gem className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-amber-400 font-bold text-lg leading-none"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                GoldCare
              </div>
              <div className="text-amber-700 text-xs">Admin Panel</div>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
            <Gem className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-amber-600 hover:text-amber-400 transition-colors p-1 ml-auto"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 mx-2 my-0.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'sidebar-active text-amber-400'
                  : 'text-amber-700 hover:text-amber-400 hover:bg-amber-900/20'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-amber-600 group-hover:text-amber-400'}`} />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {isActive && !collapsed && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-amber-900/30 p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {!collapsed && (
          <div className="mt-3 px-2">
            <div className="text-xs text-amber-800 leading-relaxed">
              Logged in as <span className="text-amber-600 font-medium">admin</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
