import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SITE } from '../../config';
import { isLoggedIn, login } from '../../admin/auth';

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.username, form.password);
      nav('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-100';

  return (
    <div className="flex min-h-screen items-center justify-center bg-deep px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={SITE.logo} alt={SITE.name} className="h-14 w-auto" />
          <h1 className="mt-3 font-display text-xl font-bold text-deep">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Crystal Boat Tours dashboard</p>
        </div>
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input
            className={input}
            placeholder="Username"
            autoFocus
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
          <input
            className={input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
          <button disabled={busy} className="btn-primary w-full text-base">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-xs text-slate-400 hover:text-ocean-600">
          ← Back to website
        </a>
      </div>
    </div>
  );
}
