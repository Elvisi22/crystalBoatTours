import { useState } from 'react';
import { api } from '../api';
import { CheckIcon, MailIcon, PhoneIcon, PinIcon } from '../components/icons';
import { SITE } from '../config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.contact(form);
      setDone(true);
    } catch {
      setError('Could not send your message. Please try again or call us.');
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-100';

  return (
    <>
      <section className="bg-ocean-50">
        <div className="container-page py-14 text-center sm:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-deep sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Questions about a tour or want a custom trip? Send us a message — we usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <InfoRow icon={<PhoneIcon className="h-5 w-5" />} label="Call or WhatsApp">
              <a href={SITE.phoneHref} className="hover:text-ocean-600">{SITE.phone}</a>
            </InfoRow>
            <InfoRow icon={<MailIcon className="h-5 w-5" />} label="Email">
              <a href={`mailto:${SITE.email}`} className="hover:text-ocean-600">{SITE.email}</a>
            </InfoRow>
            <InfoRow icon={<PinIcon className="h-5 w-5" />} label="Where to find us">
              {SITE.location}
            </InfoRow>
            <div className="overflow-hidden rounded-3xl border border-slate-100">
              <iframe
                title="Bay of Lalzi map"
                className="h-72 w-full"
                loading="lazy"
                src="https://www.google.com/maps?q=Gjiri+i+Lalezit+Albania&output=embed"
              />
            </div>
          </div>

          <div>
            {done ? (
              <div className="rounded-3xl border border-teal-sea/30 bg-teal-sea/5 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-sea text-white">
                  <CheckIcon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-deep">Message sent!</h3>
                <p className="mt-2 text-sm text-slate-600">Thanks for reaching out. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
                {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
                <input required value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="Email" className={inputCls} />
                  <input value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" className={inputCls} />
                </div>
                <textarea required rows={5} value={form.message} onChange={set('message')} placeholder="How can we help?" className={inputCls} />
                <button disabled={busy} className="btn-primary w-full text-base">
                  {busy ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-100 text-ocean-700">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-lg font-medium text-deep">{children}</p>
      </div>
    </div>
  );
}
