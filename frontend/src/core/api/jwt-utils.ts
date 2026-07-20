export interface JwtClaims {
  sub: string;
  role: 'ADMIN' | 'DATA_COLLECTOR';
  exp?: number;
  iat?: number;
}

export function decodeJwtPayload(token: string): JwtClaims {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid token format');
  }
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  return {
    sub: payload.sub as string,
    role: payload.role as JwtClaims['role'],
    exp: payload.exp as number | undefined,
    iat: payload.iat as number | undefined,
  };
}
