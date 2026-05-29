import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Activities from './pages/Activities';
import Contact from './pages/Contact';
import DestinationDetail from './pages/DestinationDetail';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TourDetail from './pages/TourDetail';

export default function App() {
  return (
    <Routes>
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
