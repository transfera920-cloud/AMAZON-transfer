import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

// Stored securely server-side. NEVER exposed to frontend.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'amazon8888';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

interface Session {
  id: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, Session>();
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function createSession(): string {
  const token = generateSessionToken();
  const now = Date.now();
  activeSessions.set(token, {
    id: token,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  });
  return token;
}

export function isValidSession(token?: string): boolean {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  return true;
}

export function destroySession(token?: string): void {
  if (token) {
    activeSessions.delete(token);
  }
}

export function verifyAdminPassword(input: string): boolean {
  if (!input) return false;
  // Constant time comparison
  try {
    const inputBuffer = Buffer.from(input);
    const targetBuffer = Buffer.from(ADMIN_PASSWORD);
    if (inputBuffer.length !== targetBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(inputBuffer, targetBuffer);
  } catch {
    return false;
  }
}

export function extractToken(req: Request): string | undefined {
  // Check cookie first
  if (req.cookies && req.cookies.admin_session) {
    return req.cookies.admin_session;
  }
  // Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return undefined;
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token || !isValidSession(token)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: '請先登入後台管理系統以進行操作',
    });
    return;
  }
  next();
}
