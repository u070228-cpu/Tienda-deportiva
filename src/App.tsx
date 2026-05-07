import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import Favorites from './pages/Favorites';
import AdminGallery from './pages/AdminGallery';
import { AppProvider } from './AppContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/admin/galeria" element={<AdminGallery />} />
              <Route path="/:category" element={<CategoryPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
