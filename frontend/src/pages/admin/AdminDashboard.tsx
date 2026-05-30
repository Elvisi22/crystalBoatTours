import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGet, logout } from '../../admin/auth';
import { SITE } from '../../config';

interface Summary {
  bookings: number;
  paidBookings: number;
  pendingBookings: number;
  depositsCollected: number;
  expectedRevenue: number;
  contacts: number;
  subscribers: number;
}
interface Booking {
  id: string;
  tourName: string;
  optionLabel?: string;
  date: string;
  time: string;
  quantity: number;
  total: number;
  depositAmount: number;
  currency: string;
  status: string;
  customer: { name: string; email: string; phone: string; notes?: string };
  createdAt: string;
}
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

type Tab = 'bookings' | 'contacts' | 'subscribers';

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '—');

export default function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('bookings');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const signOut = () => {
    logout();
    nav('/admin/login', { replace: true });
  };

  useEffect(() => {
    (async () => {
      try {
        const [s, b, c, n] = await Promise.all([
          adminGet<Summary>('summary'),
          adminGet<Booking[]>('bookings'),
          adminGet<Contact[]>('contacts'),
          adminGet<Subscriber[]>('subscribers'),
        ]);
        setSummary(s);
        setBookings(b);
        setContacts(c);
        setSubscribers(n);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        if (msg === 'Session expired' || msg === 'Not authenticated') {
          nav('/admin/login', { replace: true });
          return;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  const exportSubscribers = () => {
    const csv = 'email,subscribed_at\n' + subscribers.map((s) => `${s.email},${s.createdAt}`).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      deposit_paid: 'bg-green-100 text-green-700',
      pending_payment: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[s] || 'bg-slate-100 text-slate-600'}`}>
        {s.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <img src={SITE.logo} alt="" className="h-9 w-auto" />
            <span className="font-display font-bold text-deep">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-slate-500 hover:text-ocean-600">View site</a>
            <button onClick={signOut} className="btn-ghost px-4 py-2 text-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Bookings" value={summary?.bookings ?? '—'} hint={`${summary?.paidBookings ?? 0} paid`} />
          <Stat label="Deposits collected" value={summary ? `€${summary.depositsCollected.toFixed(2)}` : '—'} />
          <Stat label="Expected revenue" value={summary ? `€${summary.expectedRevenue.toFixed(2)}` : '—'} hint="incl. balance on arrival" />
          <Stat label="Subscribers" value={summary?.subscribers ?? '—'} hint={`${summary?.contacts ?? 0} messages`} />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <TabBtn active={tab === 'bookings'} onClick={() => setTab('bookings')}>Bookings ({bookings.length})</TabBtn>
          <TabBtn active={tab === 'contacts'} onClick={() => setTab('contacts')}>Messages ({contacts.length})</TabBtn>
          <TabBtn active={tab === 'subscribers'} onClick={() => setTab('subscribers')}>Subscribers ({subscribers.length})</TabBtn>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {loading ? (
            <div className="p-10 text-center text-slate-400">Loading…</div>
          ) : tab === 'bookings' ? (
            <Table
              empty={!bookings.length}
              head={['Created', 'Experience', 'Date / time', 'Qty', 'Total', 'Deposit', 'Customer', 'Status']}
              rows={bookings.map((b) => [
                fmtDate(b.createdAt),
                b.tourName + (b.optionLabel ? ` (${b.optionLabel})` : ''),
                `${b.date} ${b.time}`,
                String(b.quantity),
                `€${b.total.toFixed(2)}`,
                `€${b.depositAmount.toFixed(2)}`,
                <div key="c" className="leading-tight">
                  <div className="font-medium text-deep">{b.customer.name}</div>
                  <div className="text-xs text-slate-500">{b.customer.email}</div>
                  <div className="text-xs text-slate-500">{b.customer.phone}</div>
                </div>,
                statusBadge(b.status),
              ])}
            />
          ) : tab === 'contacts' ? (
            <Table
              empty={!contacts.length}
              head={['Received', 'Name', 'Email', 'Phone', 'Message']}
              rows={contacts.map((c) => [
                fmtDate(c.createdAt),
                c.name,
                c.email,
                c.phone || '—',
                <span key="m" className="block max-w-md whitespace-pre-wrap text-slate-600">{c.message}</span>,
              ])}
            />
          ) : (
            <>
              <div className="flex justify-end border-b border-slate-100 p-3">
                <button onClick={exportSubscribers} disabled={!subscribers.length} className="btn-ghost px-4 py-2 text-sm disabled:opacity-40">
                  Export CSV
                </button>
              </div>
              <Table
                empty={!subscribers.length}
                head={['Subscribed', 'Email']}
                rows={subscribers.map((s) => [fmtDate(s.createdAt), s.email])}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-deep">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? 'bg-ocean-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: boolean }) {
  if (empty) return <div className="p-10 text-center text-slate-400">Nothing here yet.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {head.map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
              {r.map((cell, j) => <td key={j} className="px-4 py-3 align-top">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
