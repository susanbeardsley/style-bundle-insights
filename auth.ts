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

// Browser-safe base64 encoding/decoding
function btoa_safe(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(str);
  }
  return Buffer.from(str).toString('base64');
}

function atob_safe(str: string): string {
  if (typeof window !== 'undefined') {
    return window.atob(str);
  }
  return Buffer.from(str, 'base64').toString('utf-8');
}

export function getSessionFromCookie(cookieValue: string | undefined): AuthSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = atob_safe(cookieValue);
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
  return btoa_safe(JSON.stringify(session));
}
