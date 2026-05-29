import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-ocean-200">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-deep">This page drifted away</h1>
      <p className="mt-2 text-slate-500">The page you're looking for isn't here.</p>
      <Link to="/" className="btn-primary mt-6">Back to safe harbour</Link>
    </div>
  );
}
