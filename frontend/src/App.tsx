import { Navigate, Route, Routes } from 'react-router-dom';
import { isLoggedIn } from './admin/auth';
import Layout from './components/Layout';
import Activities from './pages/Activities';
import Contact from './pages/Contact';
import DestinationDetail from './pages/DestinationDetail';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TourDetail from './pages/TourDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function RequireAdmin({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Admin (no public chrome) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

      {/* Public site */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/tours/:slug" element={<TourDetail />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
