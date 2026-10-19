import React, { useState, useEffect } from 'react';
import {
  User,
  Crown,
  Sparkles,
  Award,
  BookOpen,
  Code2,
  FileText,
  Clock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  Check,
  LogOut,
  ExternalLink,
  Mail,
  Phone,
  Lock,
  KeyRound,
  Smartphone,
  Laptop,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
  RotateCw,
  RefreshCw,
  Camera,
  Calendar,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { UserProfile, PowerId, UserSession, SecurityAuditLog, ProviderStatus } from '../../types';
import { authApi } from '../../services/authApi';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenUpgrade: () => void;
  onLogout?: () => void;
  onSelectPower: (power: PowerId) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onOpenUpgrade,
  onLogout,
  onSelectPower
}) => {
  // Active modal controls
  const [activeModal, setActiveModal] = useState<
    'none' | 'edit_profile' | 'change_photo' | 'change_email' | 'change_phone' | 'change_password' | 'security_settings' | 'delete_account'
  >('none');

  // Local user copy synced with backend
  const [currentUser, setCurrentUser] = useState<UserProfile>(user);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser.fullName || currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username || 'user_' + currentUser.id.slice(-4));
  const [usernameStatus, setUsernameStatus] = useState<{ checked: boolean; available: boolean; message?: string }>({ checked: true, available: true });
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [editBio, setEditBio] = useState(currentUser.bio || 'Lifelong learner, engineering builder, and researcher using Astra 7.');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar || '');

  // Photo change state
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Change Email Form State
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');

  // Change Mobile Number Form State
  const [newPhone, setNewPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+91');
  const [phoneCurrentPassword, setPhoneCurrentPassword] = useState('');
  const [phoneStep, setPhoneStep] = useState<'request' | 'verify'>('request');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [phoneOtpCooldown, setPhoneOtpCooldown] = useState(0);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Delete Account Form State
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Security Settings Data
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [loadingSecurity, setLoadingSecurity] = useState(false);

  // General feedback states
  const [loading, setLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  // Sync prop changes
  useEffect(() => {
    setCurrentUser(user);
    setEditName(user.fullName || user.name);
    if (user.username) setEditUsername(user.username);
    if (user.bio) setEditBio(user.bio);
    if (user.avatar) setEditAvatar(user.avatar);
  }, [user]);

  // Load fresh profile from backend on mount
  useEffect(() => {
    authApi.getMe()
      .then((res) => {
        if (res.user) {
          setCurrentUser(res.user);
          onUpdateUser(res.user);
        }
      })
      .catch(() => {});

    authApi.getProvidersStatus()
      .then(setProviderStatus)
      .catch(() => {});
  }, []);

  // Cooldown countdown for phone OTP
  useEffect(() => {
    let interval: any;
    if (phoneOtpCooldown > 0) {
      interval = setInterval(() => setPhoneOtpCooldown(p => Math.max(0, p - 1)), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpCooldown]);

  // Debounced username check for edit profile
  useEffect(() => {
    if (activeModal !== 'edit_profile' || !editUsername.trim()) return;

    if (editUsername === currentUser.username) {
      setUsernameStatus({ checked: true, available: true });
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        const res = await authApi.checkUsername(editUsername);
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
  }, [editUsername, activeModal, currentUser.username]);

  // Load security data when security settings modal opens
  const openSecuritySettings = async () => {
    setActiveModal('security_settings');
    setModalError('');
    setModalSuccess('');
    setLoadingSecurity(true);
    try {
      const [sessRes, logsRes, provRes] = await Promise.all([
        authApi.getSessions().catch(() => ({ sessions: [] })),
        authApi.getSecurityAudit().catch(() => ({ logs: [] })),
        authApi.getProvidersStatus().catch(() => null)
      ]);
      setSessions(sessRes.sessions);
      setAuditLogs(logsRes.logs);
      if (provRes) setProviderStatus(provRes);
    } catch {
      setModalError('Failed to load security sessions.');
    } finally {
      setLoadingSecurity(false);
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for Modals
  // --------------------------------------------------------------------------

  // 1. Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!editName.trim()) {
      setModalError('Full name is required.');
      return;
    }
    if (!usernameStatus.available) {
      setModalError('Please choose an available username.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.updateProfile({
        fullName: editName.trim(),
        username: editUsername.trim(),
        bio: editBio.trim(),
        avatarUrl: editAvatar
      });

      setCurrentUser(res.user);
      onUpdateUser(res.user);
      setModalSuccess('Profile updated successfully!');
      setTimeout(() => setActiveModal('none'), 700);
    } catch (err: any) {
      setModalError(err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Change Profile Photo
  const handleSaveAvatar = async (avatarUrl: string) => {
    setLoading(true);
    setModalError('');
    try {
      const res = await authApi.updateProfile({
        avatarUrl
      });
      setCurrentUser(res.user);
      onUpdateUser(res.user);
      setModalSuccess('Avatar updated successfully!');
      setTimeout(() => setActiveModal('none'), 600);
    } catch (err: any) {
      setModalError(err.message || 'Avatar update failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Request Change Email
  const handleRequestChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setModalError('Please enter a valid new email address.');
      return;
    }
    if (!emailCurrentPassword) {
      setModalError('Current password is required to verify your identity.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.requestChangeEmail({
        newEmail: newEmail.trim(),
        currentPassword: emailCurrentPassword
      });
      setModalSuccess(res.message);
    } catch (err: any) {
      setModalError(err.message || 'Failed to request email change.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Request Change Mobile (Step 1: Send OTP)
  const handleSendChangePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    const fullPhone = newPhone.trim().startsWith('+') ? newPhone.trim() : `${phoneCountryCode}${newPhone.trim().replace(/^0+/, '')}`;
    if (!newPhone.trim() || fullPhone.length < 9) {
      setModalError('Please enter a valid mobile number with country code.');
      return;
    }
    if (!phoneCurrentPassword) {
      setModalError('Current password is required for account security.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.sendPhoneOtp({
        phoneNumber: fullPhone,
        purpose: 'change_phone'
      });
      setMaskedPhone(res.maskedPhone);
      setPhoneOtpCooldown(res.resendInSeconds || 60);
      setPhoneStep('verify');
      setModalSuccess(`OTP sent to ${res.maskedPhone}`);
    } catch (err: any) {
      setModalError(err.message || 'Unable to send SMS OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Change Mobile (Step 2: Verify OTP)
  const handleVerifyChangePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    const fullPhone = newPhone.trim().startsWith('+') ? newPhone.trim() : `${phoneCountryCode}${newPhone.trim().replace(/^0+/, '')}`;
    if (phoneOtp.trim().length !== 6) {
      setModalError('Please enter the 6-digit SMS verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyPhoneOtp({
        phoneNumber: fullPhone,
        otp: phoneOtp.trim(),
        purpose: 'change_phone'
      });
      if (res.user) {
        setCurrentUser(res.user);
        onUpdateUser(res.user);
      }
      setModalSuccess('Mobile number verified and updated successfully!');
      setTimeout(() => {
        setActiveModal('none');
        setPhoneStep('request');
        setPhoneOtp('');
        setNewPhone('');
      }, 800);
    } catch (err: any) {
      setModalError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!currentPassword) {
      setModalError('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setModalError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setModalError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      setModalSuccess(res.message);
      setTimeout(() => {
        setActiveModal('none');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }, 1000);
    } catch (err: any) {
      setModalError(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Revoke Session
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authApi.revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err: any) {
      setModalError(err.message || 'Failed to revoke session.');
    }
  };

  // 7. Revoke Other Sessions
  const handleRevokeOthers = async () => {
    try {
      const res = await authApi.revokeOtherSessions();
      setSessions(prev => prev.filter(s => s.current));
      setModalSuccess(`Revoked ${res.count} other session(s).`);
    } catch (err: any) {
      setModalError(err.message || 'Failed to revoke other sessions.');
    }
  };

  // 8. Delete Account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (deleteConfirmText !== 'DELETE') {
      setModalError('Please type DELETE to confirm.');
      return;
    }
    if (!deletePassword) {
      setModalError('Password is required to permanently delete your account.');
      return;
    }

    setLoading(true);
    try {
      await authApi.deleteAccount(deletePassword);
      if (onLogout) onLogout();
    } catch (err: any) {
      setModalError(err.message || 'Account deletion failed.');
      setLoading(false);
    }
  };

  // Format creation date
  const accountCreatedFormatted = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'January 2025';

  const isPro = currentUser.plan === 'pro' || currentUser.tier === 'pro';

  // Avatar presets
  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ------------------------------------------------------------ */}
        {/* Profile Card Header with Colorful Gradient Accent */}
        {/* ------------------------------------------------------------ */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
          {/* Top Rainbow/Cosmic Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 dark:opacity-30" />

          <div className="relative pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/20 border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl">
                  {currentUser.avatar && currentUser.avatar.startsWith('http') ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{(currentUser.fullName || currentUser.name || 'A7').slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                {/* Change Photo Overlay Button */}
                <button
                  onClick={() => {
                    setActiveModal('change_photo');
                    setModalError('');
                    setModalSuccess('');
                  }}
                  className="absolute bottom-0 right-0 p-2 rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-transform active:scale-95"
                  title="Change Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {currentUser.fullName || currentUser.name}
                  </h1>
                  
                  {/* Pro Badge */}
                  {isPro ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                      <Crown className="w-3 h-3" />
                      Pro Tier
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Free Member
                    </span>
                  )}

                  {/* Active Account Status Pill */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3 h-3" />
                    {currentUser.accountStatus === 'active' ? 'Active' : 'Verified'}
                  </span>
                </div>

                {/* Username & Role */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    @{currentUser.username || 'astra_member'}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{currentUser.role || 'Developer'}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {accountCreatedFormatted}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed pt-1">
                  {currentUser.bio || 'Lifelong learner, engineering builder, and researcher using Astra 7.'}
                </p>
              </div>
            </div>

            {/* Quick Edit Profile Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  setActiveModal('edit_profile');
                  setModalError('');
                  setModalSuccess('');
                }}
                className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Identity, Verification & Security Status Dashboard */}
        {/* ------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Verified Contact Methods */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Verified Identity Methods
            </h3>

            {/* Email Row */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-slate-500">Primary Email</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentUser.emailVerified !== false ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    Unverified
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveModal('change_email');
                    setModalError('');
                    setModalSuccess('');
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Change Email"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Phone Row */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-bold text-slate-500">Verified Mobile (SMS)</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                    {currentUser.phoneNumber ? currentUser.phoneNumber.replace(/(\+\d{1,3})(\d{2,4})\d+(\d{4})/, '$1 $2 **** $3') : 'Not configured'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentUser.phoneVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500">
                    Optional
                  </span>
                )}
                <button
                  onClick={() => {
                    setActiveModal('change_phone');
                    setPhoneStep('request');
                    setModalError('');
                    setModalSuccess('');
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Change Mobile Number"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Connected Auth Methods */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-semibold">Auth Methods:</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                  Email & Password
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                  Phone OTP
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Password Shield */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  Security & Protection
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Status: Strong
                </span>
              </div>

              {/* Password Status Row */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500">Account Password</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      ••••••••••••••••
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveModal('change_password');
                    setModalError('');
                    setModalSuccess('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                >
                  Change Password
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                PBKDF2 military-grade cryptographic password protection with salt, rate-limiting brute force defenses, and multi-device session revocation.
              </p>
            </div>

            {/* Security Settings Launcher */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Active Devices & Logs</span>
              <button
                onClick={openSecuritySettings}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>Open Security Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* Membership & Subscription Banner */}
        {/* ------------------------------------------------------------ */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Astra 7 {isPro ? 'Pro Active' : 'Membership'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isPro ? 'You Have Full Pro Access' : 'Supercharge Your Learning & Research'}
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {isPro
                ? 'Enjoy priority AI model reasoning, multi-device sync, unlimited document analyses, and advanced coding tools.'
                : 'Unlock unlimited grounded research, verified citation downloads, interactive quizzes, and resume exports.'}
            </p>
          </div>

          <div>
            {isPro ? (
              <div className="px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-xs border border-white/30 text-center">
                Active Pro Subscription
              </div>
            ) : (
              <button
                onClick={onOpenUpgrade}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Upgrade to Pro ($9.99/mo)
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Management Actions & Account Controls */}
        {/* ------------------------------------------------------------ */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
            Account Management Actions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setActiveModal('edit_profile');
                setModalError('');
                setModalSuccess('');
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-indigo-200 text-left transition-all group"
            >
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Edit Profile</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Name, username & bio</div>
            </button>

            <button
              onClick={() => {
                setActiveModal('change_photo');
                setModalError('');
                setModalSuccess('');
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-purple-200 text-left transition-all group"
            >
              <Camera className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Change avatar or image</div>
            </button>

            <button
              onClick={() => {
                setActiveModal('change_email');
                setModalError('');
                setModalSuccess('');
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-pink-200 text-left transition-all group"
            >
              <Mail className="w-4 h-4 text-pink-600 dark:text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Change Email</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Update verified address</div>
            </button>

            <button
              onClick={() => {
                setActiveModal('change_phone');
                setPhoneStep('request');
                setModalError('');
                setModalSuccess('');
              }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-slate-200/60 dark:border-slate-800 hover:border-cyan-200 text-left transition-all group"
            >
              <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">Change Mobile</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Real SMS OTP verify</div>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={openSecuritySettings}
                className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Security Settings</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal('change_password');
                  setModalError('');
                  setModalSuccess('');
                }}
                className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-purple-500" />
                <span>Change Password</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onLogout && (
                <button
                  onClick={async () => {
                    await authApi.logout();
                    onLogout();
                  }}
                  className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>Logout</span>
                </button>
              )}

              <button
                onClick={() => {
                  setActiveModal('delete_account');
                  setModalError('');
                  setModalSuccess('');
                  setDeleteConfirmText('');
                  setDeletePassword('');
                }}
                className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: EDIT PROFILE */}
      {/* ============================================================ */}
      {activeModal === 'edit_profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-500" />
                Edit Profile Information
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-500">Username</label>
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
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Bio / Research Focus</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: CHANGE PROFILE PHOTO */}
      {/* ============================================================ */}
      {activeModal === 'change_photo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-500" />
                Change Profile Avatar
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 text-xs text-emerald-600">
                  {modalSuccess}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2">Select from Presets</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSaveAvatar(preset)}
                      className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 transition-all hover:scale-105 mx-auto"
                    >
                      <img src={preset} alt="preset" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Or Enter Custom Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => setCustomAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    disabled={!customAvatarUrl.trim()}
                    onClick={() => handleSaveAvatar(customAvatarUrl.trim())}
                    className="px-4 py-2 bg-purple-600 text-white rounded-2xl text-xs font-bold hover:bg-purple-500 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CHANGE EMAIL */}
      {/* ============================================================ */}
      {activeModal === 'change_email' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 to-rose-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                Change Verified Email
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestChangeEmail} className="p-6 space-y-3.5">
              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600">
                  {modalSuccess}
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
                Current email: <strong>{currentUser.email}</strong>. For security, your current email remains active until you click the confirmation link sent to the new email.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="newaddress@domain.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Password (Identity Verification)</label>
                <input
                  type="password"
                  value={emailCurrentPassword}
                  onChange={(e) => setEmailCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>Send Verification Link to New Email</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: CHANGE MOBILE NUMBER (WITH REAL SMS OTP) */}
      {/* ============================================================ */}
      {activeModal === 'change_phone' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500" />
                Change Verified Mobile Number
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600">
                  {modalSuccess}
                </div>
              )}

              {phoneStep === 'request' ? (
                <form onSubmit={handleSendChangePhoneOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">New Mobile Number</label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+61">+61 (AU)</option>
                        <option value="+65">+65 (SG)</option>
                      </select>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Password (Security Check)</label>
                    <input
                      type="password"
                      value={phoneCurrentPassword}
                      onChange={(e) => setPhoneCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Phone className="w-3.5 h-3.5" />}
                    <span>Dispatch Real SMS OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyChangePhoneOtp} className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Enter the 6-digit code delivered to <strong className="font-mono">{maskedPhone}</strong>
                    </p>
                  </div>

                  <input
                    type="text"
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full py-2.5 text-center tracking-[0.5em] font-mono text-xl font-black bg-slate-50 dark:bg-slate-800 border-2 border-cyan-300 dark:border-cyan-800 rounded-2xl"
                    autoFocus
                    required
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => setPhoneStep('request')}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      disabled={phoneOtpCooldown > 0}
                      onClick={handleSendChangePhoneOtp}
                      className="text-cyan-600 font-bold disabled:text-slate-400"
                    >
                      {phoneOtpCooldown > 0 ? `Resend (${phoneOtpCooldown}s)` : 'Resend SMS'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneOtp.length !== 6}
                    className="w-full py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Verify & Save Mobile</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: CHANGE PASSWORD */}
      {/* ============================================================ */}
      {activeModal === 'change_password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-500" />
                Change Account Password
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-3.5">
              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600">
                  {modalError}
                </div>
              )}
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600">
                  {modalSuccess}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New strong password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: SECURITY SETTINGS & AUDIT CENTER */}
      {/* ============================================================ */}
      {activeModal === 'security_settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[88vh]">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  Account Security Center
                </h2>
                <p className="text-[11px] text-slate-500">
                  Active sessions, devices, real-time audit logs and gateway health
                </p>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {modalSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-600">
                  {modalSuccess}
                </div>
              )}

              {/* Active Sessions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5" />
                    Active Device Sessions ({sessions.length})
                  </h3>
                  {sessions.length > 1 && (
                    <button
                      onClick={handleRevokeOthers}
                      className="text-[11px] font-bold text-rose-500 hover:underline"
                    >
                      Revoke Other Sessions
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                        sess.current
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs">
                          {sess.device.includes('iPhone') || sess.device.includes('Android') ? (
                            <Smartphone className="w-4 h-4" />
                          ) : (
                            <Laptop className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {sess.device}
                            {sess.current && (
                              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-500 text-white">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            IP: {sess.ip} • Logged in: {new Date(sess.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {!sess.current && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Audit Log */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Security Audit Logs
                </h3>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                  {auditLogs.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No security audit events recorded.</div>
                  ) : (
                    auditLogs.slice(0, 8).map((log) => (
                      <div key={log.id} className="p-3 flex items-center justify-between text-xs bg-white dark:bg-slate-900">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                            {log.action.replace('_', ' ')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {log.details}
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 text-right shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <div className="font-mono">{log.ip}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Gateway Status */}
              {providerStatus && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                  <div className="font-bold text-slate-700 dark:text-slate-300">Live Services Diagnostic:</div>
                  <div className="flex flex-wrap gap-3 text-[11px]">
                    <div>
                      Twilio SMS: <strong className={providerStatus.smsProvider.configured ? 'text-emerald-500' : 'text-amber-500'}>
                        {providerStatus.smsProvider.configured ? 'Online & Authorized' : 'Not Configured (Add TWILIO_ACCOUNT_SID)'}
                      </strong>
                    </div>
                    <div>
                      Transactional Email: <strong className={providerStatus.emailProvider.configured ? 'text-emerald-500' : 'text-amber-500'}>
                        {providerStatus.emailProvider.configured ? 'Online (Resend/SMTP)' : 'Not Configured (Add RESEND_API_KEY)'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 7: DELETE ACCOUNT CONFIRMATION */}
      {/* ============================================================ */}
      {activeModal === 'delete_account' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-rose-200 dark:border-rose-900/50 overflow-hidden">
            <div className="h-1.5 w-full bg-rose-500" />
            <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-black text-rose-600 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Astra 7 Account
              </h2>
              <button onClick={() => setActiveModal('none')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-600">
                  {modalError}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                <strong>Warning:</strong> This action cannot be undone. All your saved AI workspaces, flashcard decks, quizzes, and profile settings will be permanently erased.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Enter Password to Authorize
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your account password"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal('none')}
                  className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || deleteConfirmText !== 'DELETE'}
                  className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Permanently Delete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
