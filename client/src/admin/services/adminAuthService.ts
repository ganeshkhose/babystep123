import { AdminAuthSession, AdminProfile } from '../types';

const STORAGE_KEY = 'baby_step_admin_session';
const API_BASE = import.meta.env.VITE_API_URL || '';

class AdminAuthService {
  getSession(): AdminAuthSession | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) return null;
      return JSON.parse(item) as AdminAuthSession;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    const session = this.getSession();
    return session ? session.token : null;
  }

  getProfile(): AdminProfile | null {
    const session = this.getSession();
    return session ? session.admin : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string; session?: AdminAuthSession }> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Invalid administrative credentials.',
        };
      }

      const session: AdminAuthSession = {
        token: data.token,
        admin: data.admin,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));

      return {
        success: true,
        session,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error communicating with the authentication service.',
      };
    }
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const adminAuthService = new AdminAuthService();
