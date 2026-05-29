import { Link } from 'react-router-dom';
import type { Tour } from '../api';
import { ClockIcon, UsersIcon } from './icons';

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      to={`/tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.image}
          alt={tour.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-deep backdrop-blur">
          €{tour.price} <span className="font-normal text-slate-500">{tour.unit}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-deep">{tour.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
          {tour.shortDescription}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-ocean-500" /> {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4 text-ocean-500" /> {tour.capacity}
          </span>
        </div>
        <span className="mt-4 text-sm font-semibold text-ocean-600 group-hover:underline">
          View &amp; book →
        </span>
      </div>
    </Link>
  );
}
