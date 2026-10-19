import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  RotateCw,
  Info
} from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { UserProfile, ProviderStatus } from '../types';
import { authApi } from '../services/authApi';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup' | 'phone_otp' | 'forgot' | 'verify_email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'phone_otp' | 'forgot' | 'reset_password' | 'verify_email'>(initialMode);
  
  // Sign in / Sign up fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{ checked: boolean; available: boolean; message?: string }>({ checked: false, available: false });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login method toggle
  const [loginMethod, setLoginMethod] = useState<'password' | 'phone'>('password');
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [maskedTargetPhone, setMaskedTargetPhone] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(300); // 5 minutes
  const [otpPurpose, setOtpPurpose] = useState<'login' | 'signup'>('login');
  
  // Token inputs for email verify or reset password
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Status & messages
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);

  // Fetch provider status on open
  useEffect(() => {
    if (isOpen) {
      authApi.getProvidersStatus()
        .then(setProviderStatus)
        .catch(() => {});
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Cooldown timers
  useEffect(() => {
    let timer: any;
    if (otpCooldown > 0) {
      timer = setInterval(() => setOtpCooldown((prev) => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [otpCooldown]);

  useEffect(() => {
    let timer: any;
    if (mode === 'phone_otp' && otpExpiresIn > 0) {
      timer = setInterval(() => setOtpExpiresIn((prev) => Math.max(0, prev - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, otpExpiresIn]);

  // Debounced username check
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameStatus({ checked: false, available: false });
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await authApi.checkUsername(username);
        setUsernameStatus({
          checked: true,
          available: res.available,
          message: res.reason
        });
      } catch {
        setUsernameStatus({ checked: false, available: false });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, mode]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (score <= 4) return { score: 2, label: 'Good', color: 'bg-amber-500', text: 'text-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const getFullPhoneNumber = () => {
    const raw = phoneNumber.trim().replace(/^0+/, '');
    if (raw.startsWith('+')) return raw;
    return `${countryCode}${raw}`;
  };

  // --------------------------------------------------------------------------
  // Submit Handlers
  // --------------------------------------------------------------------------

  // 1. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({
        identifier: email.trim(),
        password
      });

      setSuccessMessage('Welcome back to Astra 7!');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Request Mobile OTP (for Login)
  const handleRequestLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const fullPhone = getFullPhoneNumber();
    if (!phoneNumber.trim() || fullPhone.length < 9) {
      setError('Please enter a valid mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.sendPhoneOtp({
        phoneNumber: fullPhone,
        purpose: 'login'
      });

      setMaskedTargetPhone(res.maskedPhone);
      setOtpCooldown(res.resendInSeconds || 60);
      setOtpExpiresIn(300);
      setOtpPurpose('login');
      setMode('phone_otp');
      setSuccessMessage(`OTP sent to ${res.maskedPhone}`);
    } catch (err: any) {
      setError(err.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Register Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!username.trim() || !usernameStatus.available) {
      setError('Please choose a valid and available username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const fullPhone = phoneNumber.trim() ? getFullPhoneNumber() : undefined;

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        phoneNumber: fullPhone,
        password,
        confirmPassword
      });

      // If mobile number was provided, optionally prompt OTP verification
      if (fullPhone) {
        try {
          const otpRes = await authApi.sendPhoneOtp({
            phoneNumber: fullPhone,
            purpose: 'signup'
          });
          setMaskedTargetPhone(otpRes.maskedPhone);
          setOtpCooldown(otpRes.resendInSeconds || 60);
          setOtpExpiresIn(300);
          setOtpPurpose('signup');
          setMode('phone_otp');
          setSuccessMessage('Account created! Enter the OTP sent to your phone.');
          return;
        } catch {
          // If SMS provider not yet configured, proceed to dashboard with notification
        }
      }

      setSuccessMessage('Account created successfully! Welcome to Astra 7.');
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Mobile OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    const fullPhone = getFullPhoneNumber();
    setLoading(true);
    try {
      const res = await authApi.verifyPhoneOtp({
        phoneNumber: fullPhone,
        otp: otpCode.trim(),
        purpose: otpPurpose
      });

      setSuccessMessage('Mobile number verified successfully!');
      setTimeout(() => {
        if (res.user) {
          onLoginSuccess(res.user);
        }
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Resend OTP
  const handleResendOtp = async () => {
    if (otpCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      const res = await authApi.sendPhoneOtp({
        phoneNumber: fullPhone,
        purpose: otpPurpose
      });
      setOtpCooldown(res.resendInSeconds || 60);
      setOtpExpiresIn(300);
      setSuccessMessage(`New verification code sent to ${res.maskedPhone}`);
    } catch (err: any) {
      setError(err.message || 'Unable to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your registered email or mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Reset Password with Token
  const handleResetPasswordWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!tokenInput.trim()) {
      setError('Please provide the reset token.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        token: tokenInput.trim(),
        newPassword,
        confirmNewPassword
      });
      setSuccessMessage(res.message);
      setTimeout(() => {
        setMode('signin');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // 8. Verify Email Token
  const handleVerifyEmailToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!tokenInput.trim()) {
      setError('Please enter the verification token.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyEmail(tokenInput.trim());
      setSuccessMessage('Email verified successfully!');
      setTimeout(() => {
        if (res.user) onLoginSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Email verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-[calc(100%-24px)] sm:w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <AstraLogo className="w-8 h-8" />
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                {mode === 'signin' && 'Sign in to Astra 7'}
                {mode === 'signup' && 'Join Astra 7'}
                {mode === 'phone_otp' && 'Verify Mobile OTP'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'reset_password' && 'Enter New Password'}
                {mode === 'verify_email' && 'Verify Email Token'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {mode === 'signin' && 'Access all 8 intelligence engines & persistent workspaces'}
                {mode === 'signup' && 'Create your verified account with full security'}
                {mode === 'phone_otp' && `Code expires in ${Math.floor(otpExpiresIn / 60)}:${(otpExpiresIn % 60).toString().padStart(2, '0')}`}
                {mode === 'forgot' && 'Secure account recovery with email or phone'}
                {mode === 'reset_password' && 'Choose a strong, unique password'}
                {mode === 'verify_email' && 'Confirm your email address'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs (for Sign in vs Sign up) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="px-6 pt-4 pb-1">
            <div className="flex bg-slate-100 dark:bg-slate-800/70 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Modal Body / Forms */}
        <div className="p-6 pt-3 overflow-y-auto space-y-4">
          {/* Status Alerts */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-snug">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: SIGN IN */}
          {/* -------------------------------------------------------- */}
          {mode === 'signin' && (
            <div className="space-y-4">
              {/* Method Toggle: Password vs Phone OTP */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                <span>Choose Sign In Method:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${loginMethod === 'password' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold' : 'hover:text-slate-800'}`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`px-2 py-0.5 rounded-lg transition-colors ${loginMethod === 'phone' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold' : 'hover:text-slate-800'}`}
                  >
                    Mobile OTP
                  </button>
                </div>
              </div>

              {loginMethod === 'password' ? (
                <form onSubmit={handlePasswordLogin} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com or username"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRequestLoginOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+65">+65 (SG)</option>
                        <option value="+49">+49 (DE)</option>
                        <option value="+33">+33 (FR)</option>
                        <option value="+81">+81 (JP)</option>
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      We will deliver a 6-digit OTP code to this verified number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Mobile OTP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: SIGN UP */}
          {/* -------------------------------------------------------- */}
          {mode === 'signup' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Santhosh Kangonu"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Username
                    </label>
                    {isCheckingUsername ? (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <RotateCw className="w-2.5 h-2.5 animate-spin" /> checking
                      </span>
                    ) : usernameStatus.checked ? (
                      usernameStatus.available ? (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> available
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-500">taken</span>
                      )
                    ) : null}
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="santhosh_k"
                    className={`w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      usernameStatus.checked && !usernameStatus.available
                        ? 'border-rose-400 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="santhoshkangonu702@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Mobile Number (for Real SMS OTP)
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+65">+65 (SG)</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Password
                    </label>
                    {password && (
                      <span className={`text-[10px] font-bold ${strength.text}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="flex gap-1.5 pt-0.5">
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                  <div className={`h-1 flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200 dark:bg-slate-700'}`} />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 mt-3"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Secure Profile...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Create Astra 7 Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: PHONE OTP VERIFICATION */}
          {/* -------------------------------------------------------- */}
          {mode === 'phone_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Enter 6-Digit SMS Code
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Delivered to <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{maskedTargetPhone || getFullPhoneNumber()}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full py-3 px-4 text-center tracking-[0.5em] font-mono text-xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-[11px] text-slate-400">
                  Expires in: <strong className="text-slate-700 dark:text-slate-300 font-mono">{Math.floor(otpExpiresIn / 60)}:{(otpExpiresIn % 60).toString().padStart(2, '0')}</strong>
                </span>
                <button
                  type="button"
                  disabled={otpCooldown > 0 || loading}
                  onClick={handleResendOtp}
                  className={`text-[11px] font-bold ${
                    otpCooldown > 0 ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400 hover:underline'
                  }`}
                >
                  {otpCooldown > 0 ? `Resend code (${otpCooldown}s)` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full py-1.5 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: FORGOT PASSWORD */}
          {/* -------------------------------------------------------- */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email or +919876543210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  We'll securely dispatch a password reset link to your verified address.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setMode('reset_password')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Already have a reset token?
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: ENTER NEW PASSWORD WITH TOKEN */}
          {/* -------------------------------------------------------- */}
          {mode === 'reset_password' && (
            <form onSubmit={handleResetPasswordWithToken} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Reset Token
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste the token from your reset email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Set New Password</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full py-1 text-[11px] text-slate-400 hover:text-slate-600 text-center"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: VERIFY EMAIL TOKEN */}
          {/* -------------------------------------------------------- */}
          {mode === 'verify_email' && (
            <form onSubmit={handleVerifyEmailToken} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Email Verification Token
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter token from email link"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Confirm Email Address</span>
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer: Real Provider Status & Transparency */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Auth Providers Status:
            </span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                providerStatus?.smsProvider.configured
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                SMS: {providerStatus?.smsProvider.configured ? 'Twilio Live' : 'Unconfigured'}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                providerStatus?.emailProvider.configured
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                Email: {providerStatus?.emailProvider.configured ? 'Active' : 'Unconfigured'}
              </span>
            </div>
          </div>
          {!providerStatus?.smsProvider.configured && (
            <p className="text-[10px] text-slate-400 leading-tight">
              To deliver real SMS OTPs, set <code className="font-mono text-slate-600 dark:text-slate-300">TWILIO_ACCOUNT_SID</code> and <code className="font-mono text-slate-600 dark:text-slate-300">TWILIO_AUTH_TOKEN</code> in your environment settings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
