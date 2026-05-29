import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SITE } from '../config';
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from './icons';

const destinations = [
  { slug: 'gjiri-i-lalezit', name: 'Gjiri i Lalëzit' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-ocean-700' : 'text-slate-700 hover:text-ocean-600'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto sm:h-12" />
          <span className="hidden font-display text-lg font-bold text-deep sm:block">
            Crystal Boat Tours
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setDestOpen(true)}
            onMouseLeave={() => setDestOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-ocean-600">
              Destinations <ChevronDown className="h-4 w-4" />
            </button>
            {destOpen && (
              <div className="absolute left-0 top-full w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                {destinations.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/destinations/${d.slug}`}
                    className="block rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-ocean-50 hover:text-ocean-700"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/activities" className={linkClass}>
            Activities
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <a href={SITE.phoneHref} className="hidden items-center gap-2 text-sm font-semibold text-deep md:flex">
            <PhoneIcon className="h-4 w-4 text-ocean-600" />
            {SITE.phone}
          </a>
          <Link to="/activities" className="btn-primary hidden sm:inline-flex">
            Book Now
          </Link>
          <button
            className="rounded-lg p-2 text-deep lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <MenuIconClose /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <MobileLink to="/" label="Home" />
            <div className="px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Destinations
            </div>
            {destinations.map((d) => (
              <MobileLink key={d.slug} to={`/destinations/${d.slug}`} label={d.name} indent />
            ))}
            <MobileLink to="/activities" label="Activities" />
            <MobileLink to="/contact" label="Contact" />
            <Link to="/activities" className="btn-primary mt-3 w-full">
              Book Now
            </Link>
            <a href={SITE.phoneHref} className="btn-ghost mt-2 w-full">
              <PhoneIcon className="h-4 w-4" /> {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIconClose() {
  return <CloseIcon className="h-6 w-6" />;
}

function MobileLink({ to, label, indent }: { to: string; label: string; indent?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `rounded-xl px-3 py-2.5 text-base font-medium ${indent ? 'pl-6' : ''} ${
          isActive ? 'bg-ocean-50 text-ocean-700' : 'text-slate-700 hover:bg-slate-50'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
