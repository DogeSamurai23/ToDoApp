import * as jwtModule from 'jsonwebtoken';

const jwt: any = (jwtModule as any).default || jwtModule;

/**
 * Payload embedded in both access and refresh JWTs.
 */
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Signs a short-lived access token (default 15 minutes).
 */
export const signAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'taskly_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Signs a long-lived refresh token (default 7 days).
 */
export const signRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'taskly_super_secret_refresh_key_2026';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies an access token and returns its payload.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'taskly_super_secret_jwt_key_2026';
  return jwt.verify(token, secret) as TokenPayload;
};

/**
 * Verifies a refresh token and returns its payload.
 */
export const verifyRefreshToken = (token: string): TokenPayload & jwtModule.JwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'taskly_super_secret_refresh_key_2026';
  return jwt.verify(token, secret) as TokenPayload & jwtModule.JwtPayload;
};
