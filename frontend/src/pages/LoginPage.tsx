import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Trash2, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    }
  }, [isAuthenticated, navigate]);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;

    setIsLoading(true);
    // Simulate authentication delay
    await new Promise(r => setTimeout(r, 1200));

    // Mock auth: accept any valid-format credentials
    login(email);
    navigate({ to: '/dashboard' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animated-gradient relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(96,165,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-glow animate-float">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">SmartWaste IoT</h1>
          <p className="text-blue-300/70 text-sm">Municipal Administration Portal</p>
        </div>

        {/* Card */}
        <div className="glass-card-dark p-8 rounded-2xl">
          <h2 className="font-display font-bold text-xl text-white mb-2">Admin Login</h2>
          <p className="text-sm text-blue-300/60 mb-6">Enter your credentials to access the dashboard</p>

          {loginError && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-200/80 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/60" />
                <input
                  type="text"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="admin@smartcity.gov"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-blue-300/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.email ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(96,165,250,0.2)',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-200/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm text-white placeholder-blue-300/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.password ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(96,165,250,0.2)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Demo hint */}
            <div
              className="p-3 rounded-lg text-xs"
              style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}
            >
              <p className="text-blue-300/70">
                <span className="font-semibold text-blue-300">Demo:</span> Use any valid email and password (min 6 chars)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-blue-300/40 mt-6">
          IoT Smart Waste Management System — Final Year Project
        </p>
      </div>
    </div>
  );
}
