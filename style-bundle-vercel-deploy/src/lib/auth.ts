// Simple shared-password authentication for internal tool
// In production, use Supabase Auth or similar

const SHARED_PASSWORD = 'stylebundle2024';
const ADMIN_PASSWORD = 'stylebundleadmin';

export interface AuthSession {
  isAuthenticated: boolean;
  role: 'admin' | 'viewer';
  displayName: string;
}

export function validatePassword(password: string): AuthSession | null {
  if (password === ADMIN_PASSWORD) {
    return {
      isAuthenticated: true,
      role: 'admin',
      displayName: 'Admin User',
    };
  }
  if (password === SHARED_PASSWORD) {
    return {
      isAuthenticated: true,
      role: 'viewer',
      displayName: 'Team Member',
    };
  }
  return null;
}

export function getSessionFromCookie(cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = Buffer.from(cookieValue, 'base64').toString('utf-8');
    const session = JSON.parse(decoded);
    if (session.isAuthenticated && (session.role === 'admin' || session.role === 'viewer')) {
      return session as AuthSession;
    }
  } catch {
    return null;
  }
  return null;
}

export function createSessionCookie(session: AuthSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}
