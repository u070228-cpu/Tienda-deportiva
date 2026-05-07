import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { products, isLoading } = useApp();
  
  const filteredProducts = products
    .filter(p => p.category === category)
    .reverse();
  
  const titles: Record<string, string> = {
    jerseys: 'Jerseys',
    balones: 'Balones',
    tacos: 'Tacos',
  };

  const currentTitle = category ? titles[category] || 'Colección' : 'Colección';

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <header className="max-w-[1400px] mx-auto px-10 mb-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="flex items-baseline gap-6 mb-4">
              <span className="font-serif italic text-2xl opacity-30">/0{category === 'jerseys' ? 1 : category === 'balones' ? 2 : 3}</span>
              <h1 className="text-huge">
                {currentTitle}
              </h1>
            </div>
            <div className="h-1 w-24 bg-soccer-green" />
            <p className="text-white/60 mt-10 max-w-xl text-lg leading-relaxed uppercase tracking-tight">
              Selección exclusiva de alto rendimiento. Diseñada para los que ven el fútbol como una forma de vida.
            </p>
          </motion.div>

          {category === 'jerseys' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block flex-1 max-w-xl"
            >
              <img 
                src="https://images.weserv.nl/?url=assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9972322a36b24f57a3e6af2600ba45a7_9366/Jersey_Local_Real_Madrid_23-24_Blanco_HR3796_01_laydown.jpg" 
                alt="Featured Jersey" 
                className="w-full h-auto object-contain brightness-90 grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-10">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-line-white border border-line-white">
            {filteredProducts.map((product, i) => (
              <div key={product.id} className="bg-pitch-dark">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/5 border border-line-white">
            <h2 className="text-3xl font-black uppercase italic text-white/20 tracking-tighter">PRÓXIMAMENTE</h2>
          </div>
        )}
      </div>
    </div>
  );
}
