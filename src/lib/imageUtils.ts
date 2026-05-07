
export function getOptimizedImageUrl(url: string | undefined): { displayUrl: string; originalUrl: string } {
  if (!url) return { displayUrl: '', originalUrl: '' };
  
  // Si es de Firebase, cargamos DIRECTO. No queremos proxy para fotos subidas manualmente.
  const isFirebase = url.includes('firebasestorage');
  const isUnsplash = url.includes('unsplash.com');
  
  // Limpiamos la URL de proxies previos si existen para tener la "original" pura
  let originalUrl = url;
  if (url.includes('weserv.nl') || url.includes('wsrv.nl')) {
    const urlMatch = url.match(/[?&]url=([^&]+)/);
    if (urlMatch && urlMatch[1]) {
      try { originalUrl = decodeURIComponent(urlMatch[1]); } catch (e) { originalUrl = urlMatch[1]; }
    }
  }

  // Lógica de Display
  if (isFirebase || isUnsplash) {
    return { displayUrl: originalUrl, originalUrl };
  }

  // Para todo lo demás que sea externo, usamos el proxy con parámetros de alto rendimiento
  if (originalUrl.startsWith('http')) {
    // wsrv.nl es más rápido y estable actualmente
    const displayUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=800&output=webp&q=80&il`;
    return { displayUrl, originalUrl };
  }

  return { displayUrl: originalUrl, originalUrl };
}
