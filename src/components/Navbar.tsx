import { Search, ShoppingBag, Menu, X, Trash2, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { cart, totalItems, totalPrice, removeFromCart, favorites, isAdmin } = useApp();

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Jerseys', path: '/jerseys' },
    { name: 'Balones', path: '/balones' },
    { name: 'Tacos', path: '/tacos' },
    { name: 'Favoritos', path: '/favoritos' },
  ];

  if (isAdmin) {
    links.push({ name: 'Gestión', path: '/admin/galeria' });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-pitch-dark border-b border-line-white">
        <div className="max-w-[1400px] mx-auto px-10 h-24 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-3xl tracking-tighter uppercase">
            Goal<span className="text-soccer-green">Store</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[12px] font-bold uppercase tracking-[2px] transition-colors hover:text-soccer-green ${
                  location.pathname === link.path ? 'text-soccer-green' : 'text-white/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <Link 
              to="/favoritos"
              className="hidden lg:flex items-center gap-2 group transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'text-red-500 fill-red-500' : 'text-white/60 group-hover:text-white'}`} />
              <span className="text-[12px] font-bold tracking-[2px] uppercase text-white/60 group-hover:text-white">({favorites.length})</span>
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-[12px] font-bold tracking-[2px] uppercase text-white/60 hover:text-white transition-colors"
            >
              [ CARRITO ({totalItems}) ]
            </button>
            <button 
              className="md:hidden text-white/70 hover:text-soccer-green"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-0 w-full bg-pitch-dark border-b border-white/10 md:hidden p-6"
            >
              <div className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-2xl uppercase italic font-bold hover:text-soccer-green transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-pitch-dark/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-pitch-dark border-l border-line-white z-[70] p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-display font-black text-3xl uppercase tracking-tighter italic">Tu Carrito</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-16 h-16 text-white/10 mb-6" />
                  <p className="text-white/40 uppercase tracking-[2px] font-bold text-sm">Tu carrito está vacío</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-8 text-soccer-green font-bold uppercase tracking-[1px] hover:underline"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 items-center group">
                        <div className="w-24 h-24 bg-white/5 border border-line-white overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display font-black uppercase text-sm leading-tight mb-1">{item.name}</h3>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">/ Cant: {item.quantity}</p>
                          <p className="text-soccer-green font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 border-t border-line-white mt-10">
                    <div className="flex justify-between items-baseline mb-8">
                      <span className="text-white/40 uppercase tracking-[2px] font-bold text-xs text-left">Total de la orden</span>
                      <span className="text-3xl font-black text-white italic">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button className="w-full py-5 bg-soccer-green text-pitch-dark font-black uppercase tracking-[2px] text-sm hover:bg-white transition-colors">
                      Finalizar Compra
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
