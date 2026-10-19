/**
 * Astra 7 — Authentication API Client
 * Connects client frontend to secure backend auth services.
 */

import { UserProfile, UserSession, SecurityAuditLog, ProviderStatus } from '../types';

const TOKEN_KEY = 'astra7_auth_token';

class AuthApiClient {
  private token: string | null = null;

  constructor() {
    try {
      this.token = localStorage.getItem(TOKEN_KEY);
    } catch {
      this.token = null;
    }
  }

  public getToken(): string | null {
    if (!this.token) {
      try {
        this.token = localStorage.getItem(TOKEN_KEY);
      } catch {}
    }
    return this.token;
  }

  public setToken(token: string | null): void {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {}
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`/api/auth${path}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {})
      }
    });

    const data = await res.json().catch(() => ({ error: 'Failed to parse response' }));

    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }

    return data as T;
  }

  public async getProvidersStatus(): Promise<ProviderStatus> {
    return this.request<ProviderStatus>('/providers-status');
  }

  public async checkUsername(username: string): Promise<{ available: boolean; reason?: string }> {
    return this.request<{ available: boolean; reason?: string }>(`/check-username?username=${encodeURIComponent(username)}`);
  }

  public async register(params: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; user: UserProfile; token: string; emailVerificationSent?: boolean }> {
    const res = await this.request<any>('/register', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async login(params: {
    identifier: string;
    password: string;
  }): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const res = await this.request<any>('/login', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async sendPhoneOtp(params: {
    phoneNumber: string;
    purpose?: 'signup' | 'login' | 'change_phone' | 'reset_password';
  }): Promise<{ success: boolean; maskedPhone: string; resendInSeconds: number; message: string }> {
    return this.request('/send-phone-otp', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  public async verifyPhoneOtp(params: {
    phoneNumber: string;
    otp: string;
    purpose?: 'signup' | 'login' | 'change_phone' | 'reset_password';
  }): Promise<{ success: boolean; user?: UserProfile; token?: string; message: string }> {
    const res = await this.request<any>('/verify-phone-otp', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async getMe(): Promise<{ authenticated: boolean; user: UserProfile }> {
    return this.request('/me');
  }

  public async updateProfile(params: {
    fullName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    role?: string;
  }): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(params)
    });
  }

  public async changePassword(params: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/change-password', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  public async sendEmailVerification(): Promise<{ success: boolean; message: string }> {
    return this.request('/send-email-verification', {
      method: 'POST'
    });
  }

  public async verifyEmail(token: string): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return this.request('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  public async requestChangeEmail(params: {
    newEmail: string;
    currentPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/change-email/request', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  public async confirmChangeEmail(token: string): Promise<{ success: boolean; user: UserProfile; message: string }> {
    return this.request('/change-email/confirm', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  public async forgotPassword(identifier: string): Promise<{ success: boolean; message: string }> {
    return this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
  }

  public async resetPassword(params: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  public async getSessions(): Promise<{ sessions: UserSession[] }> {
    return this.request('/sessions');
  }

  public async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    return this.request('/sessions/revoke', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  }

  public async revokeOtherSessions(): Promise<{ success: boolean; count: number }> {
    return this.request('/sessions/revoke-others', {
      method: 'POST'
    });
  }

  public async getSecurityAudit(): Promise<{ logs: SecurityAuditLog[] }> {
    return this.request('/security-audit');
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch {}
    this.setToken(null);
  }

  public async deleteAccount(currentPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await this.request<any>('/delete-account', {
      method: 'POST',
      body: JSON.stringify({ currentPassword })
    });
    this.setToken(null);
    return res;
  }
}

export const authApi = new AuthApiClient();
