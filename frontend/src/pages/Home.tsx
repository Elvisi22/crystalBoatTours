import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Tour } from '../api';
import TourCard from '../components/TourCard';
import {
  AnchorIcon, PhoneIcon, ShieldIcon, SparkleIcon, StarIcon, UsersIcon,
} from '../components/icons';
import { SITE } from '../config';

const HERO_IMG = '/images/image00238.jpeg';

const reasons = [
  { icon: AnchorIcon, title: 'Local experts', text: 'Born-and-raised skippers who know every hidden cove in the bay.' },
  { icon: ShieldIcon, title: 'Safety first', text: 'Well-maintained equipment, life jackets and full briefings on every trip.' },
  { icon: SparkleIcon, title: 'Crystal water', text: 'We take you to the cleanest, most beautiful spots on the coast.' },
  { icon: UsersIcon, title: 'For everyone', text: 'From relaxed family pedalos to high-adrenaline jet skis.' },
];

const testimonials = [
  { name: 'Tom S.', text: 'Incredible day out. Our guide knew all the best beaches you can only reach by boat. Highly recommend!' },
  { name: 'Liz S.', text: 'The water was unbelievably clear and the jet ski was so much fun. Booking the deposit online was effortless.' },
  { name: 'Mike A.', text: 'Friendly team, spotless equipment and stunning scenery. Best part of our Albania trip.' },
];

export default function Home() {
  const [tours, setTours] = useState<Tour[]>([]);
  useEffect(() => { api.getTours().then(setTours).catch(() => {}); }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center">
        <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/55 to-ocean-900/30" />
        <div className="container-page relative py-24 text-white">
          <p className="eyebrow text-teal-sea">Bay of Lalzi · Albania</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">
            Discover the crystal-clear waters of the Albanian coast
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-100/90">
            Boat tours, jet skis, kayaks and more. Reserve your adventure today with a small
            online deposit — pay the rest when you arrive.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/activities" className="btn-accent text-base">Explore activities</Link>
            <a href={SITE.phoneHref} className="btn bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <PhoneIcon className="h-4 w-4" /> {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="section">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="eyebrow">Top activities</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-deep sm:text-4xl">
              Pick your adventure on the water
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-ocean-50">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="eyebrow">Why Crystal Boat Tours</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-deep sm:text-4xl">
              The most loved way to see the bay
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-3xl bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-sea/10 text-teal-sea">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-deep">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="section">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="eyebrow">Destinations</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-deep sm:text-4xl">Where we sail</h2>
          </div>
          <div className="grid gap-7">
            {[
              { slug: 'gjiri-i-lalezit', name: 'Gjiri i Lalëzit', img: '/images/932d54b6417c19507ff6a672e6730dd7-1.jpg' },
            ].map((d) => (
              <Link key={d.slug} to={`/destinations/${d.slug}`} className="group relative h-80 overflow-hidden rounded-3xl sm:h-96">
                <img src={d.img} alt={d.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-display text-2xl font-bold">{d.name}</h3>
                  <span className="text-sm text-teal-sea group-hover:underline">Discover →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-deep text-white">
        <div className="container-page">
          <div className="mb-12 text-center">
            <p className="eyebrow text-teal-sea">Guest reviews</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Loved by our guests</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className="h-4 w-4" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-200">“{t.text}”</p>
                <p className="mt-4 font-display font-semibold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-page">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-ocean-600 to-teal-sea px-8 py-14 text-center text-white sm:px-16">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready for the water?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/90">
              Secure your spot now with a 20% deposit. Quick, safe and flexible.
            </p>
            <Link to="/activities" className="btn mt-7 bg-white text-ocean-700 hover:bg-slate-100">
              Book your adventure
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
