import { motion } from 'motion/react';
import { ArrowRight, Trophy, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products, isLoading } = useApp();
  // Mostramos los 4 productos más recientes (los últimos agregados a la DB)
  const featured = [...products].reverse().slice(0, 4);

  if (isLoading) {
    return <div className="pt-32 text-center">Cargando productos...</div>;
  }

  return (
    <div className="pt-24 min-h-screen flex flex-col">
      {/* Hero Split Layout */}
      <section className="flex-1 min-h-[calc(100vh-6rem)] grid lg:grid-cols-[1.5fr,1fr] border-b border-line-white overflow-hidden">
        {/* Left: Content */}
        <div className="p-10 lg:p-20 flex flex-col justify-center border-r border-line-white bg-[#0a0a0a]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-soccer-green text-[14px] font-bold uppercase tracking-[4px] mb-6 block">
              Elite Performance
            </span>
            <h1 className="text-huge mb-10">
              EL JUEGO<br />NUNCA SE<br />DETIENE
            </h1>
            <p className="text-white/70 max-w-[400px] text-lg leading-relaxed mb-12">
              Equípate con lo último en tecnología deportiva. De la cancha a la calle, domina cada minuto con nuestra selección exclusiva de fútbol.
            </p>
            <Link
              to="/jerseys"
              className="px-10 py-5 bg-soccer-green text-pitch-dark font-black uppercase text-[14px] tracking-[1px] inline-block hover:bg-white transition-colors"
            >
              Explorar Todo
            </Link>
          </motion.div>
        </div>

        {/* Right: Category Sidebar Overlay style */}
        <nav className="flex flex-col">
          {[
            { id: '01', name: 'Jerseys', path: '/jerseys' },
            { id: '02', name: 'Balones', path: '/balones' },
            { id: '03', name: 'Tacos', path: '/tacos' },
          ].map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className="flex-1 group relative p-12 border-b border-line-white last:border-b-0 flex items-center justify-between hover:bg-white/5 transition-colors overflow-hidden"
            >
              <div className="flex items-center gap-10">
                <span className="font-serif italic text-[14px] opacity-40 text-white translate-y-[-10px]">
                  {cat.id}
                </span>
                <span className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                  {cat.name}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-2xl transform group-hover:bg-soccer-green group-hover:text-pitch-dark group-hover:border-soccer-green transition-all duration-300">
                →
              </div>
              {/* Accent Bar */}
              <div className="absolute bottom-0 left-0 h-1 bg-soccer-green w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
      </section>

      {/* Featured Section with clean grid */}
      <section className="py-32 px-10 bg-[#0f0f0f]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4 md:mb-0">
              Nuevos <span className="text-soccer-green">Lanzamientos</span>
            </h2>
            <Link to="/jerseys" className="text-[12px] font-bold uppercase tracking-[2px] text-white/50 hover:text-soccer-green transition-colors">
              VER CATÁLOGO COMPLETO
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-line-white border border-line-white">
            {featured.map((product, i) => (
              <div key={product.id} className="bg-pitch-dark">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
