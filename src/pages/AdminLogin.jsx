import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { setAdminSession } from '../services/localStorageService';
import { validateLoginForm } from '../utils/validation';

const ADMIN_CREDENTIALS = { username: 'admin', password: 'Admin@123' };

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
    setAuthError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (
        form.username === ADMIN_CREDENTIALS.username &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        setAdminSession({ loggedIn: true, username: form.username, loginTime: new Date().toISOString() });
        navigate('/admin/dashboard');
      } else {
        setAuthError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1c0a00 0%, #2d1a00 50%, #1c0a00 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #d97706, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #1c0a00, #2d1a00)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
              <Gem className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              GoldCare Admin
            </h1>
            <p className="text-amber-600 text-sm mt-1">Jewellery Repair Management Panel</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Demo credentials notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-center">
              <p className="text-xs text-amber-700 font-medium">Demo Credentials</p>
              <p className="text-xs text-stone-600 mt-0.5">
                Username: <strong>admin</strong> | Password: <strong>Admin@123</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border input-gold text-sm ${errors.username ? 'border-red-400' : ''}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border input-gold text-sm ${errors.password ? 'border-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                  </p>
                )}
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-red-600 text-sm">{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Admin Panel'
                )}
              </button>
            </form>

            <div className="mt-6 bg-stone-50 rounded-xl p-3 border border-stone-200">
              <p className="text-xs text-stone-500 text-center leading-relaxed">
                ⚠️ <strong>Security Notice:</strong> This is a frontend-only demo. Credentials are 
                stored in code and are not secure for production use. Real applications must use 
                server-side authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
