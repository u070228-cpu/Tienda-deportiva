import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { Product } from '../constants';
import { useApp } from '../AppContext';
import { getOptimizedImageUrl } from '../lib/imageUtils';

interface ProductCardProps {
  product: Product;
  index: number;
  key?: string | number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const favored = isFavorite(product.id);
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-pitch-dark flex flex-col h-full border border-line-white transition-colors hover:bg-white/5"
    >
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        {/* Skeleton Shimmer */}
        {imageState === 'loading' && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        )}

        {(() => {
          const { displayUrl, originalUrl } = getOptimizedImageUrl(product.image);
          
          return (
            <img
              src={displayUrl}
              alt={product.name}
              className={`w-full h-full object-contain p-4 transition-all duration-700 group-hover:scale-105 ${
                imageState === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
              onLoad={() => setImageState('loaded')}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('placehold.co')) {
                  setImageState('error');
                  return;
                }

                // Si falla la URL optimizada, probamos la original pura
                if (!target.dataset.triedOriginal) {
                  target.dataset.triedOriginal = 'true';
                  target.src = originalUrl;
                } else {
                  setImageState('error');
                  target.src = `https://placehold.co/800x800/1a1a1a/666?text=ERROR+CARGA\n\nSubir+Archivo`;
                }
              }}
            />
          );
        })()}
        <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={() => toggleFavorite(product)}
            className={`w-12 h-12 rounded-full bg-pitch-dark border border-white/20 flex items-center justify-center transition-all ${
              favored ? 'text-red-500 border-red-500/50' : 'text-white hover:bg-soccer-green hover:text-pitch-dark'
            }`}
          >
            <Heart className={`w-5 h-5 ${favored ? 'fill-red-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow border-t border-line-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display font-black text-2xl uppercase leading-none tracking-tight flex-1">
            {product.name}
          </h3>
          <span className="font-serif italic text-lg opacity-60 ml-4 group-hover:text-soccer-green group-hover:opacity-100 transition-colors">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-white/50 text-[10px] uppercase tracking-[3px] mb-4">
          / {product.category}
        </p>

        <p className="text-white/70 text-sm mb-8 line-clamp-2">
          {product.description}
        </p>

        <button 
          onClick={() => addToCart(product)}
          className="mt-auto w-full py-4 border border-white/30 text-[12px] font-bold uppercase tracking-[2px] hover:bg-soccer-green hover:text-pitch-dark hover:border-soccer-green transition-all duration-300"
        >
          Añadir al Carrito
        </button>
      </div>
    </motion.div>
  );
}
