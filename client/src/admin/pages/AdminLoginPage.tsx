import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuthService';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // One-click demo fill for rapid testing
  const handleQuickFill = () => {
    setEmail('admin@thebabystep.com');
    setPassword('Admin@BabyStep2026!');
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both your administrative email and password.');
      return;
    }

    setIsLoading(true);
    const result = await adminAuthService.login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F6F0EB] to-[#F1E8E2] flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-800">
      {/* Subtle background glow accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-blue-light/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-pink-light/40 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl border border-[#EDE1EA] shadow-2xl p-6 sm:p-8 text-left transition-all">
        {/* Top Header: Logo & Badges */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block mb-3 group">
            <img
              src="/logo.png"
              alt="The Baby Step"
              className="h-10 mx-auto object-contain drop-shadow-xs transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue-light/70 text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Administrator Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy font-display">
            Administrative Sign In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access live catalog control, product pricing, and inventory management.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-shake">
            <span className="font-bold">Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Fill Demo Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-brand-pink-light/40 border border-brand-pink/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-pink shrink-0" />
            <span className="text-[11px] font-medium text-brand-navy">
              Default SuperAdmin credentials ready
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-bold text-brand-pink hover:text-brand-navy hover:underline cursor-pointer shrink-0 transition-colors"
          >
            Quick Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@thebabystep.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-white border border-[#EDE1EA] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-[#EDE1EA] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-2xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-brand-blue to-brand-blue-soft border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] hover:shadow-[0_0_18px_rgba(22,137,216,0.55)] hover:brightness-105 active:scale-98 transition-all duration-150 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating Admin...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Enter Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
