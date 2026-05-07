import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-pitch-dark border-t border-line-white py-12 px-10">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] font-bold uppercase tracking-[1px] text-white/50">
        <div>
          © 2024 GOAL STORE INTERNACIONAL
        </div>
        <div className="text-white">
          ENVÍOS GRATIS EN PEDIDOS SUPERIORES A $99
        </div>
        <div className="flex gap-10">
          <Link to="/admin/galeria" className="hover:text-soccer-green transition-colors decoration-dotted underline underline-offset-4">Gestión</Link>
          <a href="#" className="hover:text-soccer-green transition-colors">Instagram</a>
          <a href="#" className="hover:text-soccer-green transition-colors">Twitter</a>
          <a href="#" className="hover:text-soccer-green transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
