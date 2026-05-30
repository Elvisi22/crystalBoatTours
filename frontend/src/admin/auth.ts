const KEY = 'cbt_admin_token';
const EXP = 'cbt_admin_exp';

export function getToken(): string | null {
  const token = localStorage.getItem(KEY);
  const exp = Number(localStorage.getItem(EXP) || 0);
  if (!token || !exp || Date.now() > exp) {
    return null;
  }
  return token;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(EXP);
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Login failed');
  }
  const { accessToken, expiresIn } = (await res.json()) as {
    accessToken: string;
    expiresIn: number;
  };
  localStorage.setItem(KEY, accessToken);
  localStorage.setItem(EXP, String(Date.now() + expiresIn * 1000));
}

/** GET an admin endpoint with the bearer token. Logs out on 401. */
export async function adminGet<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`/api/admin/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    logout();
    throw new Error('Session expired');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}
