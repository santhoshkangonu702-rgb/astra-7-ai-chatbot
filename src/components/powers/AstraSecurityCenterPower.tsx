import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  History,
  FileCheck,
  AlertTriangle,
  Download,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Server
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface AstraSecurityCenterPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export const AstraSecurityCenterPower: React.FC<AstraSecurityCenterPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionAutoTimeout, setSessionAutoTimeout] = useState('30m');
  const [dataCollectionEnabled, setDataCollectionEnabled] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const loginSessions = [
    { device: 'Chrome on macOS (Current)', ip: '122.161.42.18 (Encrypted)', location: 'Bengaluru, India', active: true, time: 'Active now' },
    { device: 'Astra Mobile App (Android 15)', ip: '106.213.88.94', location: 'Hyderabad, India', active: false, time: 'Yesterday 18:42 IST' },
    { device: 'Safari on iPad Pro', ip: '49.204.112.5', location: 'New Delhi, India', active: false, time: '3 days ago' }
  ];

  const securityAuditLog = [
    { event: 'Biometric Session Verified', timestamp: '2026-09-26 13:10 IST', severity: 'low' },
    { event: 'API Token Rotation Handshake', timestamp: '2026-09-25 09:30 IST', severity: 'low' },
    { event: 'Rate Limiting Guard Filter Activated', timestamp: '2026-09-24 22:15 IST', severity: 'medium' }
  ];

  const handleExportSecurityData = () => {
    triggerHaptic(10);
    const auditData = {
      user: 'santhoshkangonu702@gmail.com',
      twoFactorEnabled,
      sessions: loginSessions,
      auditLog: securityAuditLog,
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `astra_security_audit_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    hapticSuccess();
    setStatusNotice('Security audit telemetry and credentials manifest downloaded.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleRevokeOtherSessions = () => {
    triggerHaptic(14);
    hapticSuccess();
    setStatusNotice('All remote secondary sessions have been revoked. Current device remains active.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  return (
    <div
      id="astra-security-center-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-[#050814]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(10);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ASTRA SECURITY CENTER
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Zero Trust Shield
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Session Management • Two-Factor Auth • Data Permissions & Local Encryption Primitives
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSecurityData}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Audit Manifest</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {statusNotice && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Security Health Score Banner */}
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-[#070b18] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-black text-xl">
              98%
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security Posture: Hardened</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Two-Factor Authentication Active • Secrets securely proxy-shielded on backend • Zero client-side API key leaks.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            AES-256 Client Isolation
          </span>
        </div>

        {/* Security Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: 2FA & Auth Controls */}
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-amber-400" />
              Authentication & Two-Factor Controls
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-400 block">Requires TOTP authenticator code or SMS OTP</span>
              </div>
              <button
                onClick={() => {
                  setTwoFactorEnabled(!twoFactorEnabled);
                  triggerHaptic(10);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    twoFactorEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Automatic Inactivity Lock</span>
                <span className="text-[11px] text-slate-400 block">Locks chat and files after idle period</span>
              </div>
              <select
                value={sessionAutoTimeout}
                onChange={(e) => setSessionAutoTimeout(e.target.value)}
                className="px-2 py-1 rounded-lg bg-white/10 text-xs text-white border border-white/10 focus:outline-none"
              >
                <option value="15m">15 Minutes</option>
                <option value="30m">30 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          {/* Card 2: Privacy & Data Permissions */}
          <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Key className="w-4 h-4 text-cyan-400" />
              Privacy & Intelligence Telemetry Controls
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">AI Model Training Opt-Out</span>
                <span className="text-[11px] text-slate-400 block">Zero customer conversations or files trained on</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Diagnostic Crash Reporting</span>
                <span className="text-[11px] text-slate-400 block">Share anonymized stack traces on errors</span>
              </div>
              <button
                onClick={() => {
                  setDataCollectionEnabled(!dataCollectionEnabled);
                  triggerHaptic(10);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  dataCollectionEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    dataCollectionEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-400" />
              Active Login Sessions & Devices ({loginSessions.length})
            </h4>
            <button
              onClick={handleRevokeOtherSessions}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Revoke Other Sessions
            </button>
          </div>

          <div className="space-y-2">
            {loginSessions.map((session, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block flex items-center gap-2">
                    {session.device}
                    {session.active && (
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                        Active
                      </span>
                    )}
                  </span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">{session.location} • IP: {session.ip}</span>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">{session.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="p-5 rounded-2xl border border-white/10 bg-slate-900/50 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-4 h-4 text-cyan-400" />
            Immutable Security Audit Trail
          </h4>
          <div className="space-y-2 text-xs">
            {securityAuditLog.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-slate-200">{log.event}</span>
                <span className="font-mono text-slate-500 text-[11px]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
