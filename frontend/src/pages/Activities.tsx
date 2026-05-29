import { useEffect, useState } from 'react';
import { api, type Tour } from '../api';
import TourCard from '../components/TourCard';

export default function Activities() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTours().then(setTours).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-ocean-50">
        <div className="container-page py-14 text-center sm:py-20">
          <p className="eyebrow">Activities</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold text-deep sm:text-5xl">
            Tours &amp; water sports
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Choose an experience and reserve it online with a 20% deposit. The rest is paid on the day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          {loading ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((t) => <TourCard key={t.id} tour={t} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
