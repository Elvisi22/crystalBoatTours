import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { SITE } from '../config';
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, TikTokIcon } from './icons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const res = await api.subscribe(email);
      setMsg(res.message);
      setEmail('');
    } catch {
      setMsg('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="bg-deep text-slate-300">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={SITE.logo} alt={SITE.name} className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Unforgettable boat tours and water sports on the crystal-clear waters of the
              Bay of Lalzi, Albania.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/activities" className="hover:text-white">Activities</Link></li>
              <li><Link to="/destinations/gjiri-i-lalezit" className="hover:text-white">Gjiri i Lalëzit</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 text-teal-sea" />
                <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-4 w-4 text-teal-sea" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <PinIcon className="h-4 w-4 text-teal-sea" />
                {SITE.location}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h4>
            <p className="mt-4 text-sm text-slate-400">
              Get seasonal offers and news from the bay.
            </p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-teal-sea focus:outline-none"
              />
              <button disabled={busy} className="btn-accent shrink-0 px-5 py-2.5">
                {busy ? '…' : 'Join'}
              </button>
            </form>
            {msg && <p className="mt-2 text-xs text-teal-sea">{msg}</p>}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Made with NestJS &amp; React.</p>
        </div>
      </div>
    </footer>
  );
}
