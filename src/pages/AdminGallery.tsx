import { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { updateProductImage, uploadProductImage, loginWithGoogle, logout, createProduct, forceSyncDatabase } from '../lib/dbService';
import { Save, ExternalLink, Image as ImageIcon, Upload, Lock, LogOut, Plus, X, Check, Camera, Search, Filter, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/imageUtils';

export default function AdminGallery() {
  const { products, isLoading, user, isAdmin, refreshProducts } = useApp();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [tempUrls, setTempUrls] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  // New Product State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'jerseys',
    description: '',
    image: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUrlChange = (id: string, url: string) => {
    setTempUrls(prev => ({ ...prev, [id]: url }));
  };

  const handleUpdate = async (id: string) => {
    let newUrl = tempUrls[id];
    if (!newUrl) return;

    setUpdatingId(id);
    try {
      // Primero limpiamos el error previo si existe en el elemento img
      const img = document.querySelector(`img[data-product-id="${id}"]`) as HTMLImageElement;
      if (img) delete img.dataset.triedOriginal;

      await updateProductImage(id, newUrl);
      
      // Limpiamos el temporal y forzamos refresco visual
      setTempUrls(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      
      alert('¡Link actualizado! Si no cambia de inmediato, la imagen original podría estar bloqueada. Intenta subir el archivo.');
    } catch (error) {
      console.error(error);
      alert('Error: El link no es válido o está bloqueado por el servidor original.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFileUpload = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('¡Atención! La imagen es muy grande (más de 10MB). Se comprimirá, pero la subida podría ser lenta dependiendo de tu conexión.');
    }

    setUpdatingId(id);
    setUploadProgress(0);
    try {
      const downloadURL = await uploadProductImage(id, file, (progress) => {
        setUploadProgress(progress);
      });
      setTempUrls(prev => ({ ...prev, [id]: downloadURL }));
      alert('¡Imagen subida y comprimida con éxito!');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error al subir: El archivo es demasiado grande o no es compatible.');
    } finally {
      setUpdatingId(null);
      setUploadProgress(0);
    }
  };

  const handleNewProductUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Selecciona una imagen válida.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('¡Atención! La imagen es muy grande (más de 10MB). La subida podría tardar unos minutos.');
    }

    setIsCreating(true);
    setUploadProgress(0);
    try {
      const url = await uploadProductImage('temp', file, (progress) => {
        setUploadProgress(progress);
      });
      setNewProduct(prev => ({ ...prev, image: url }));
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Error al subir la imagen');
    } finally {
      setIsCreating(false);
      setUploadProgress(0);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.image || newProduct.price <= 0) {
      alert('Por favor completa todos los campos obligatorios (Nombre, Precio e Imagen)');
      return;
    }

    setIsCreating(true);
    try {
      await createProduct(newProduct);
      alert('¡Producto creado con éxito!');
      setShowAddForm(false);
      setNewProduct({ name: '', price: 0, category: 'jerseys', description: '', image: '' });
      await refreshProducts();
    } catch (error) {
      console.error(error);
      alert('Error al crear el producto');
    } finally {
      setIsCreating(false);
    }
  };

  const handleForceSync = async () => {
    if (!confirm('Esto sobreescribirá los nombres, categorías e imágenes de los productos base con los valores de constants.ts. ¿Continuar?')) {
      return;
    }
    setIsSyncing(true);
    try {
      await forceSyncDatabase();
      await refreshProducts();
      alert('¡Sincronización forzada completada!');
    } catch (error) {
      console.error(error);
      alert('Error durante la sincronización forzada');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auth Guard Screen
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#111] border border-white/10 p-12 text-center"
        >
          <div className="w-16 h-16 bg-soccer-green/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="text-soccer-green" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Acceso Restringido</h2>
          <p className="text-white/40 uppercase tracking-widest text-[10px] mb-10 leading-relaxed font-bold">
            Debes iniciar sesión como administrador para gestionar la galería de productos.
          </p>

          {!user ? (
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[2px] h-16 hover:bg-soccer-green transition-all flex items-center justify-center disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Iniciar Sesión con Google"
              )}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                El correo <span className="underline">{user.email}</span> no tiene permisos de administrador.
              </div>
              <button
                onClick={() => logout()}
                className="w-full py-5 border border-white/20 text-white font-black uppercase text-xs tracking-[2px] hover:bg-white hover:text-black transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-40 text-center">
        <div className="inline-block w-8 h-8 border-4 border-soccer-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white/50 uppercase tracking-widest text-xs">Cargando base de datos...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen px-10">
      <header className="max-w-[1400px] mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-huge mb-6">GESTOR DE<br/><span className="text-soccer-green">IMÁGENES</span></h1>
          <div className="h-1 w-24 bg-soccer-green mb-8" />
          <p className="text-white/60 max-w-2xl text-[12px] leading-tight uppercase font-bold tracking-widest">
            PANEL DE CONTROL / ACTUALIZACIÓN DE CATÁLOGO DIGITAL
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 bg-soccer-green text-pitch-dark px-6 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-xl shadow-soccer-green/10"
          >
            <Plus size={16} />
            Crear Producto
          </button>

          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-4 font-black uppercase text-[11px] tracking-widest hover:border-soccer-green transition-all"
            title="Reiniciar imágenes y datos base desde el código"
          >
            {isSyncing ? (
              <RefreshCw size={16} className="animate-spin text-soccer-green" />
            ) : (
              <RefreshCw size={16} />
            )}
            Reiniciar Base
          </button>
          
          <button 
            onClick={() => logout()}
            className="px-6 py-4 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center gap-3 font-black uppercase text-[11px] tracking-widest lg:hidden"
          >
            <LogOut size={16} /> Salir
          </button>

          <div className="text-right hidden lg:block border-l border-white/10 pl-6 h-12 flex flex-col justify-center">
            <p className="text-[9px] font-black text-soccer-green uppercase tracking-widest mb-1">Admin Logged</p>
            <p className="text-[10px] font-bold text-white/30 truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>
      </header>

      {/* Control Bar: Search & Filter */}
      <div className="max-w-[1400px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-soccer-green transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="BUSCAR POR NOMBRE O ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-white/10 py-5 pl-16 pr-6 text-[12px] font-black uppercase tracking-widest outline-none focus:border-soccer-green transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'jerseys', 'balones', 'tacos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest border transition-all ${
                filterCategory === cat 
                ? 'bg-soccer-green border-soccer-green text-pitch-dark shadow-lg shadow-soccer-green/10' 
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {cat === 'all' ? 'Ver Todo' : cat}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center justify-end gap-3 text-white/20 font-black uppercase text-[10px] tracking-widest">
          <Filter size={14} /> {filteredProducts.length} Productos Encontrados
        </div>
      </div>

      {/* Unified Add/Update View */}
      <div className="max-w-[1400px] mx-auto">
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-20 overflow-hidden"
            >
              <div className="bg-[#111] border-2 border-soccer-green/30 p-10 relative">
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-6 right-6 text-white/30 hover:text-white"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-10">Nuevo Lanzamiento</h2>
                
                <div className="grid lg:grid-cols-[1fr,2fr] gap-16">
                  {/* Image Preview / Upload Area */}
                  <div className="aspect-square bg-black border border-white/5 relative flex items-center justify-center p-10">
                    {newProduct.image ? (
                      <img 
                        src={getOptimizedImageUrl(newProduct.image).displayUrl} 
                        className="w-full h-full object-contain" 
                        alt="Preview" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const { originalUrl } = getOptimizedImageUrl(newProduct.image);
                          if (target.src !== originalUrl && !target.dataset.triedOriginal) {
                            target.dataset.triedOriginal = 'true';
                            target.src = originalUrl;
                          }
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto text-white/10 mb-4" size={48} />
                        <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Sin imagen cargada</p>
                      </div>
                    )}
                    
                    <div className="absolute inset-x-10 bottom-10">
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={newFileInputRef} 
                        onChange={handleNewProductUpload}
                      />
                      <button 
                        onClick={() => newFileInputRef.current?.click()}
                        className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-all flex flex-col items-center justify-center gap-1"
                      >
                        {isCreating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-soccer-green border-t-transparent rounded-full animate-spin mb-2" />
                            <span className="text-[10px] text-soccer-green font-black">
                              {uploadProgress > 0 ? `${uploadProgress}% SUBIENDO` : 'PREPARANDO...'}
                            </span>
                          </>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Upload size={16} />
                            Subir Imagen del Producto
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Nombre del Equipo / Producto</label>
                      <input 
                        type="text" 
                        value={newProduct.name}
                        onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-black border border-white/10 p-5 text-white outline-none focus:border-soccer-green transition-colors"
                        placeholder="ej. Real Madrid Local"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Precio (ARS)</label>
                      <input 
                        type="number" 
                        value={newProduct.price}
                        onChange={e => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="bg-black border border-white/10 p-5 text-white outline-none focus:border-soccer-green transition-colors"
                        placeholder="1500"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Categoría</label>
                      <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-black border border-white/10 p-5 text-white outline-none focus:border-soccer-green transition-colors uppercase font-bold text-xs"
                      >
                        <option value="jerseys">Jerseys</option>
                        <option value="balones">Balones</option>
                        <option value="tacos">Tacos</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Descripción corta</label>
                      <input 
                        type="text" 
                        value={newProduct.description}
                        onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="bg-black border border-white/10 p-5 text-white outline-none focus:border-soccer-green transition-colors"
                        placeholder="ej. Diseño clásico temporada 24/25"
                      />
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <button 
                        onClick={handleCreateProduct}
                        disabled={isCreating}
                        className="w-full py-6 bg-soccer-green text-pitch-dark font-black uppercase text-[14px] tracking-widest flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50"
                      >
                        {isCreating ? (
                          <div className="w-5 h-5 border-2 border-pitch-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check size={20} />
                            GUARDAR Y PUBLICAR EN TIENDA
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/5 p-8 flex flex-col gap-8 group hover:border-soccer-green/50 transition-all duration-500"
          >
            {/* Image Preview */}
            <div className="aspect-square bg-black border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:border-soccer-green/30 transition-colors">
              {(() => {
                const rawUrl = tempUrls[product.id] || product.image;
                const { displayUrl, originalUrl } = getOptimizedImageUrl(rawUrl);
                  
                return (
                  <img
                    data-product-id={product.id}
                    src={displayUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('placehold.co')) return;
                      
                      if (!target.dataset.triedOriginal) {
                        target.dataset.triedOriginal = 'true';
                        target.src = originalUrl;
                      } else {
                        target.src = `https://placehold.co/600x600/111/666?text=FALLO+LINK\n\nSubir+Archivo`;
                      }
                    }}
                  />
                );
              })()}
              {updatingId === product.id && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-soccer-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-black text-soccer-green uppercase tracking-widest text-center px-4">
                    {uploadProgress > 0 
                      ? `${uploadProgress}% ENVIANDO...` 
                      : 'PROCESANDO IMAGEN...'}
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-soccer-green text-pitch-dark text-[10px] font-black px-2 py-1 uppercase italic translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                {product.category}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-lg leading-tight mb-1">{product.name}</h3>
                  <p className="font-mono text-white/20 text-[9px] tracking-widest uppercase">{product.id}</p>
                </div>
                <div className="text-soccer-green font-black text-sm italic">
                  ${product.price}
                </div>
              </div>

              <div className="space-y-4">
                {/* File Upload Option */}
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={el => fileInputRefs.current[product.id] = el}
                    onChange={(e) => handleFileUpload(product.id, e)}
                  />
                  <button
                    onClick={() => fileInputRefs.current[product.id]?.click()}
                    className="w-full bg-white/5 border border-white/10 py-3 flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all group/btn"
                  >
                    <Upload size={14} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Subir Archivo</span>
                  </button>
                </div>

                {/* URL Input Option */}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                      <ImageIcon size={12} />
                    </span>
                    <input
                      type="text"
                      defaultValue={product.image}
                      onChange={(e) => handleUrlChange(product.id, e.target.value)}
                      placeholder="URL..."
                      className="w-full bg-black border border-white/10 py-3 pl-10 pr-4 text-[11px] font-medium focus:border-soccer-green outline-none transition-colors placeholder:text-white/10"
                    />
                  </div>

                  <button
                    onClick={() => handleUpdate(product.id)}
                    disabled={updatingId === product.id || !tempUrls[product.id]}
                    className="w-full py-3 bg-white/10 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-soccer-green hover:text-pitch-dark transition-all disabled:opacity-10 disabled:grayscale"
                  >
                    <Save size={14} />
                    Sincronizar
                  </button>
                </div>
              </div>

              {/* External Links Helper */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(product.name + ' kit image 2024')}&tbm=isch`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold text-white/20 hover:text-soccer-green flex items-center gap-2 transition-colors uppercase tracking-widest justify-center"
                >
                  <ExternalLink size={10} /> Buscar Referencia
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
  );
}
