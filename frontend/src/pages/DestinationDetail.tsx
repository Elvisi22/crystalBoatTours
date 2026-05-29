import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type Destination, type Tour } from '../api';
import TourCard from '../components/TourCard';

export default function DestinationDetail() {
  const { slug = '' } = useParams();
  const [dest, setDest] = useState<Destination | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDest(null);
    setError(false);
    api.getDestination(slug).then(setDest).catch(() => setError(true));
    api.getTours().then(setTours).catch(() => {});
  }, [slug]);

  if (error) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="font-display text-2xl font-bold text-deep">Destination not found</h1>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    );
  }
  if (!dest) {
    return <div className="container-page py-32"><div className="h-96 animate-pulse rounded-3xl bg-slate-100" /></div>;
  }

  return (
    <>
      <section className="relative h-[55vh] min-h-[380px]">
        <img src={dest.image} alt={dest.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/40 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-10 text-white">
          <p className="eyebrow text-teal-sea">Destination</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-6xl">{dest.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-slate-100/90">{dest.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-600">{dest.description}</p>
        </div>
      </section>

      <section className="section bg-ocean-50">
        <div className="container-page">
          <div className="mb-10 text-center">
            <p className="eyebrow">Things to do</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-deep">Activities here</h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        </div>
      </section>
    </>
  );
}
