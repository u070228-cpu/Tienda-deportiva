import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { favorites } = useApp();

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <header className="max-w-[1400px] mx-auto px-10 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-baseline gap-6 mb-4">
            <span className="font-serif italic text-2xl opacity-30">/FAV</span>
            <h1 className="text-huge">
              Favoritos
            </h1>
          </div>
          <div className="h-1 w-24 bg-soccer-green" />
          <p className="text-white/60 mt-10 max-w-xl text-lg leading-relaxed uppercase tracking-tight">
            Tu selección personal de los mejores artículos. Guarda lo que más te gusta y encuéntralo aquí en cualquier momento.
          </p>
        </motion.div>
      </header>

      <div className="max-w-[1400px] mx-auto px-10">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-line-white border border-line-white">
            {favorites.map((product, i) => (
              <div key={product.id} className="bg-pitch-dark">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-line-white bg-white/[0.02]">
            <Heart className="w-16 h-16 text-white/10 mx-auto mb-8" />
            <h2 className="text-3xl font-black uppercase italic text-white/20 tracking-tighter mb-8">Aún no tienes favoritos</h2>
            <Link 
              to="/jerseys" 
              className="px-10 py-5 border border-white/20 hover:bg-soccer-green hover:text-pitch-dark hover:border-soccer-green transition-all uppercase font-bold text-sm tracking-widest inline-block"
            >
              Explorar Catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
