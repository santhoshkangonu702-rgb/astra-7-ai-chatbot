/**
 * Astra 7 — Authentication & Profile API Router
 * Secure server-side routes for registration, login, phone OTP,
 * email verification, password management, and security center.
 */

import { Router, Request, Response } from 'express';
import { AstraAuthService } from './authService';

export const authRouter = Router();

// Helper to extract client token from Authorization header
function extractToken(req: Request): string {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return '';
}

// Helper to sanitize client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

// Helper to strip sensitive server-only fields before sending user profile to client
function sanitizeUserForResponse(user: any) {
  if (!user) return null;
  const { passwordHash, salt, failedLoginAttempts, lockoutUntil, ...safeUser } = user;
  return {
    ...safeUser,
    id: safeUser.userId,
    name: safeUser.fullName || safeUser.name
  };
}

// --------------------------------------------------------------------------
// 1. Providers Status & Health
// --------------------------------------------------------------------------
authRouter.get('/providers-status', async (req: Request, res: Response) => {
  try {
    const status = AstraAuthService.getProvidersStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve auth provider status' });
  }
});

// --------------------------------------------------------------------------
// 2. Check Username Availability
// --------------------------------------------------------------------------
authRouter.get('/check-username', async (req: Request, res: Response) => {
  try {
    const username = (req.query.username as string) || '';
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;
    const result = AstraAuthService.checkUsernameAvailable(username, currentUser?.userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ available: false, error: err.message });
  }
});

// --------------------------------------------------------------------------
// 3. Register
// --------------------------------------------------------------------------
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, phoneNumber, password, confirmPassword } = req.body;

    if (!password || password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.register({
      fullName,
      username,
      email,
      phoneNumber,
      password,
      ip,
      userAgent
    });

    if (!result.success || !result.user) {
      return res.status(400).json({ error: result.error || 'Registration failed.' });
    }

    // Auto login session on register
    const loginResult = await AstraAuthService.loginWithPassword({
      identifier: email,
      password,
      ip,
      userAgent
    });

    res.json({
      success: true,
      message: 'Account created successfully.',
      user: sanitizeUserForResponse(result.user),
      token: loginResult.token,
      emailVerificationSent: result.emailVerificationSent
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error during registration.' });
  }
});

// --------------------------------------------------------------------------
// 4. Login (Password)
// --------------------------------------------------------------------------
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/username and password are required.' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.loginWithPassword({
      identifier,
      password,
      ip,
      userAgent
    });

    if (!result.success || !result.user) {
      return res.status(401).json({ error: result.error || 'Invalid credentials.' });
    }

    res.json({
      success: true,
      message: 'Signed in successfully.',
      user: sanitizeUserForResponse(result.user),
      token: result.token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during sign in.' });
  }
});

// --------------------------------------------------------------------------
// 5. Send Mobile OTP
// --------------------------------------------------------------------------
authRouter.post('/send-phone-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, purpose } = req.body;
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.sendPhoneOtp({
      phoneNumber,
      purpose: purpose || 'login',
      userId: currentUser?.userId,
      ip,
      userAgent
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Unable to send OTP. Please try again.'
      });
    }

    res.json({
      success: true,
      message: `Verification code sent to ${result.maskedPhone}`,
      maskedPhone: result.maskedPhone,
      resendInSeconds: result.resendInSeconds
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'SMS service error' });
  }
});

// --------------------------------------------------------------------------
// 6. Verify Mobile OTP
// --------------------------------------------------------------------------
authRouter.post('/verify-phone-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp, purpose } = req.body;
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.verifyPhoneOtp({
      phoneNumber,
      otp,
      purpose: purpose || 'login',
      userId: currentUser?.userId,
      ip,
      userAgent
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Invalid OTP code.'
      });
    }

    res.json({
      success: true,
      message: 'Mobile number verified successfully.',
      user: result.user ? sanitizeUserForResponse(result.user) : undefined,
      token: result.token
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'OTP verification error' });
  }
});

// --------------------------------------------------------------------------
// 7. Get Current Authenticated User (Me)
// --------------------------------------------------------------------------
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'No authorization token provided' });
    }

    const user = AstraAuthService.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ authenticated: false, error: 'Session expired or invalid' });
    }

    res.json({
      authenticated: true,
      user: sanitizeUserForResponse(user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 8. Update Profile
// --------------------------------------------------------------------------
authRouter.put('/profile', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { fullName, username, bio, avatarUrl, role } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.updateProfile({
      userId: currentUser.userId,
      fullName,
      username,
      bio,
      avatarUrl,
      role,
      ip,
      userAgent
    });

    if (!result.success || !result.user) {
      return res.status(400).json({ error: result.error || 'Profile update failed' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: sanitizeUserForResponse(result.user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 9. Change Password
// --------------------------------------------------------------------------
authRouter.post('/change-password', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!newPassword || newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.changePassword({
      userId: currentUser.userId,
      currentPassword,
      newPassword,
      ip,
      userAgent
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Password update failed' });
    }

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 10. Send / Resend Email Verification
// --------------------------------------------------------------------------
authRouter.post('/send-email-verification', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AstraAuthService.sendEmailVerification(currentUser.userId);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Unable to send verification email' });
    }

    res.json({
      success: true,
      message: `Verification link sent to ${AstraAuthService.maskEmail(currentUser.email)}`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 11. Verify Email with Token
// --------------------------------------------------------------------------
authRouter.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const result = await AstraAuthService.verifyEmailToken(token);
    if (!result.success || !result.user) {
      return res.status(400).json({ error: result.error || 'Invalid verification token' });
    }

    res.json({
      success: true,
      message: 'Email verified successfully.',
      user: sanitizeUserForResponse(result.user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 12. Request Change Email
// --------------------------------------------------------------------------
authRouter.post('/change-email/request', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { newEmail, currentPassword } = req.body;
    const result = await AstraAuthService.requestChangeEmail({
      userId: currentUser.userId,
      newEmail,
      currentPassword
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Unable to initiate email change' });
    }

    res.json({
      success: true,
      message: `Confirmation email sent to ${newEmail}. Please click the link in that email to confirm the change.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 13. Confirm Change Email
// --------------------------------------------------------------------------
authRouter.post('/change-email/confirm', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await AstraAuthService.confirmChangeEmail(token);

    if (!result.success || !result.user) {
      return res.status(400).json({ error: result.error || 'Email change confirmation failed' });
    }

    res.json({
      success: true,
      message: 'Email address updated and verified successfully.',
      user: sanitizeUserForResponse(result.user)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 14. Forgot Password Request
// --------------------------------------------------------------------------
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Please enter your registered email address or mobile number.' });
    }

    const result = await AstraAuthService.requestPasswordReset(identifier);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 15. Reset Password with Token
// --------------------------------------------------------------------------
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'Unknown';

    const result = await AstraAuthService.resetPasswordWithToken({
      token,
      newPassword,
      ip,
      userAgent
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Password reset failed' });
    }

    res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 16. Security Center: Sessions & Audit
// --------------------------------------------------------------------------
authRouter.get('/sessions', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = AstraAuthService.getSessions(currentUser.userId, token);
    res.json({ sessions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/sessions/revoke', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { sessionId } = req.body;
    const ok = AstraAuthService.revokeSession(currentUser.userId, sessionId);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/sessions/revoke-others', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const revokedCount = AstraAuthService.revokeOtherSessions(currentUser.userId, token);
    res.json({ success: true, count: revokedCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.get('/security-audit', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const logs = AstraAuthService.getAuditLogs(currentUser.userId);
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------------------------
// 17. Logout & Delete Account
// --------------------------------------------------------------------------
authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    if (token) {
      AstraAuthService.logout(token);
    }
    res.json({ success: true, message: 'Signed out successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/delete-account', async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);
    const currentUser = token ? AstraAuthService.getUserByToken(token) : null;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Password confirmation is required to delete your account' });
    }

    const result = AstraAuthService.deleteAccount(currentUser.userId, currentPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Account deletion failed' });
    }

    res.json({ success: true, message: 'Account permanently deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
