import jwtPkg from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1d') as any; 

  const signToken = (jwtPkg as any).sign || jwtPkg;

  return signToken({ id: userId, role }, secret, { expiresIn });
};