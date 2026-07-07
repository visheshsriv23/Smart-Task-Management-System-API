import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
  };
}

interface JwtPayload {
  id: string;
  role: 'admin' | 'user';
}

// Middleware to authenticate requests using JWT
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. Malformed token.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

//Aythorize middleware to check user roles
export const authorize = (...allowedRoles: ('admin' | 'user')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden. You do not have permission to perform this action.' });
      return;
    }

    next();
  };
};