import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Dropdown } from '../Dropdown';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<string>('Male');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('Welcome back to Baby Step!', 'success', 'check');
      } else {
        await register(name, email, password);
        showToast('Account created! Welcome to Baby Step!', 'success', 'check');
      }
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto bg-white rounded-3xl p-5 sm:p-8 shadow-soft-lg border border-slate-100">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-10 h-10 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center mb-5 sm:mb-6 pt-1">
          <div className="inline-flex p-3 rounded-2xl bg-brand-blue-light text-brand-blue mb-2.5 sm:mb-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-peach" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-display">
            {mode === 'login' ? 'Welcome Back' : 'Join Baby Step'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to access your orders and saved favorites'
              : 'Create an account for personalized baby care recommendations'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-brand-blue shadow-sm'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Name</label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <Dropdown<string>
                  id="auth-register-gender"
                  label="Baby / Child Gender (Optional)"
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={(val) => setGender(val)}
                  size="md"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-brand-blue hover:bg-brand-blue-soft text-white font-bold py-3 rounded-xl transition-all shadow-sm hover:shadow-glow-blue disabled:opacity-50 text-sm"
          >
            {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create My Account'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Continue browsing freely as a guest →
          </button>
        </div>
      </div>
    </div>
  );
};
