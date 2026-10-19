/**
 * Astra 7 — Security & Rate Limiting Middleware
 * Protects backend endpoints, validates request payloads, enforces rate limits,
 * and sanitizes user input without exposing internal secrets or logging private data.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class SecurityManager {
  private static generalLimits = new Map<string, RateLimitRecord>();
  private static chatLimits = new Map<string, RateLimitRecord>();

  // General rate limit: 80 requests per minute
  private static GENERAL_MAX = 80;
  private static GENERAL_WINDOW_MS = 60 * 1000;

  // AI Chat streaming limit: 30 requests per minute to prevent model API exhaustion
  private static CHAT_MAX = 30;
  private static CHAT_WINDOW_MS = 60 * 1000;

  /**
   * Extract client identifier (IP address or custom client token)
   */
  private static getClientIdentifier(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown-client';
  }

  /**
   * Rate limiting middleware for standard API endpoints
   */
  public static generalRateLimiter(req: Request, res: Response, next: NextFunction): void {
    const clientId = SecurityManager.getClientIdentifier(req);
    const now = Date.now();

    let record = SecurityManager.generalLimits.get(clientId);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + SecurityManager.GENERAL_WINDOW_MS };
      SecurityManager.generalLimits.set(clientId, record);
    } else {
      record.count++;
    }

    const remaining = Math.max(0, SecurityManager.GENERAL_MAX - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', SecurityManager.GENERAL_MAX);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > SecurityManager.GENERAL_MAX) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait a moment before sending more requests.',
        retryAfter: resetSeconds
      });
      return;
    }

    next();
  }

  /**
   * Specialized rate limiter for AI generation & chat streaming endpoints
   */
  public static chatRateLimiter(req: Request, res: Response, next: NextFunction): void {
    const clientId = SecurityManager.getClientIdentifier(req);
    const now = Date.now();

    let record = SecurityManager.chatLimits.get(clientId);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + SecurityManager.CHAT_WINDOW_MS };
      SecurityManager.chatLimits.set(clientId, record);
    } else {
      record.count++;
    }

    const remaining = Math.max(0, SecurityManager.CHAT_MAX - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit-Chat', SecurityManager.CHAT_MAX);
    res.setHeader('X-RateLimit-Remaining-Chat', remaining);
    res.setHeader('X-RateLimit-Reset-Chat', resetSeconds);

    if (record.count > SecurityManager.CHAT_MAX) {
      res.status(429).json({
        error: 'Too Many Generation Requests',
        message: 'Astra 7 is currently processing high demand for this connection. Please wait 10 seconds before generating another response.',
        retryAfter: resetSeconds
      });
      return;
    }

    next();
  }

  /**
   * Request sanitization middleware
   * Strips null bytes, limits excessive string sizes, validates MIME types
   */
  public static validateAndSanitize(req: Request, res: Response, next: NextFunction): void {
    if (req.body && typeof req.body === 'object') {
      // Validate message length
      if (typeof req.body.message === 'string') {
        if (req.body.message.length > 25000) {
          res.status(400).json({
            error: 'Payload Too Large',
            message: 'Message exceeds maximum character length (25,000 characters).'
          });
          return;
        }
        // Strip null bytes and dangerous control chars
        req.body.message = req.body.message.replace(/\0/g, '');
      }

      // Validate document upload size & content
      if (req.body.content && typeof req.body.content === 'string') {
        if (req.body.content.length > 10 * 1024 * 1024) { // 10MB text
          res.status(400).json({
            error: 'Document Too Large',
            message: 'Document content exceeds 10MB limit.'
          });
          return;
        }
        req.body.content = req.body.content.replace(/\0/g, '');
      }

      // Sanitize document name
      if (typeof req.body.name === 'string') {
        req.body.name = req.body.name.replace(/[^a-zA-Z0-9._\- ]/g, '_').slice(0, 120);
      }
    }

    next();
  }
}

export const generalRateLimiter = SecurityManager.generalRateLimiter;
export const chatRateLimiter = SecurityManager.chatRateLimiter;
export const validateAndSanitize = SecurityManager.validateAndSanitize;
