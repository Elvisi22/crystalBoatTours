import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type Tour } from '../api';
import BookingWidget from '../components/BookingWidget';
import { CheckIcon, ClockIcon, UsersIcon } from '../components/icons';

export default function TourDetail() {
  const { slug = '' } = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTour(null);
    setError(false);
    api.getTour(slug).then(setTour).catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-2xl font-bold text-deep">Experience not found</h1>
        <Link to="/activities" className="btn-primary mt-6">Back to activities</Link>
      </div>
    );
  }

  if (!tour) {
    return <div className="container-page py-32"><div className="h-96 animate-pulse rounded-3xl bg-slate-100" /></div>;
  }

  return (
    <>
      <section className="relative h-[42vh] min-h-[320px]">
        <img src={tour.image} alt={tour.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-deep/20" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-8 text-white">
          <Link to="/activities" className="text-sm text-white/80 hover:text-white">← All activities</Link>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{tour.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-5 text-sm">
            <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {tour.duration}</span>
            <span className="flex items-center gap-1.5"><UsersIcon className="h-4 w-4" /> {tour.capacity}</span>
            <span className="rounded-full bg-teal-sea px-3 py-1 font-semibold">€{tour.price} {tour.unit}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="text-lg leading-relaxed text-slate-600">{tour.description}</p>
            <h3 className="mt-10 font-display text-xl font-bold text-deep">What's included</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-2xl bg-ocean-50 p-4 text-sm text-slate-700">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-sea" /> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <h3 className="mb-4 font-display text-2xl font-bold text-deep">Book this experience</h3>
              <BookingWidget tour={tour} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
