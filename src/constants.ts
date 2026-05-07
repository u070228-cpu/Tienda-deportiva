export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'jerseys' | 'balones' | 'tacos';
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  // Jerseys
  {
    id: 'j1',
    name: 'Real Madrid',
    price: 1899.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80&w=800',
    description: 'La leyenda blanca. Versión 23/24 con los icónicos detalles en dorado y azul marino.'
  },
  {
    id: 'j2',
    name: 'Manchester City',
    price: 1450.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1599427303058-f06cb9e98114?auto=format&fit=crop&q=80&w=800',
    description: 'Edición especial. Diseño exclusivo inspirado en la energía de Manchester.'
  },
  {
    id: 'j3',
    name: 'Seleccion de Argentina',
    price: 1999.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1556942061-0130937a075d?auto=format&fit=crop&q=80&w=800',
    description: 'Kit oficial Copa América 2024. Los Campeones del Mundo de local.'
  },
  {
    id: 'j4',
    name: 'FC Barcelona',
    price: 1750.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=800',
    description: 'Colores clásicos Blaugrana. El diseño más icónico del club catalán.'
  },
  {
    id: 'j5',
    name: 'Seleccion de Mexico',
    price: 1350.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1510051646601-9860a3161272?auto=format&fit=crop&q=80&w=800',
    description: 'Orgullo nacional. Versión jugador con patrón plumaje de pavo real.'
  },
  {
    id: 'j6',
    name: 'AC Milan',
    price: 1550.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1543351611-58f7a810b48b?auto=format&fit=crop&q=80&w=800',
    description: 'Estilo Rossonero clásico. El kit 23/24 con las icónicas rayas reinterpretadas para dominar San Siro.'
  },
  {
    id: 'j7',
    name: 'Seleccion de Brasil',
    price: 1800.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?auto=format&fit=crop&q=80&w=800',
    description: 'La Canarinha. Versión jugador diseñada para la Copa América 2024.'
  },
  {
    id: 'j8',
    name: 'PSG',
    price: 1650.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    description: 'Hechter style. El diseño clásico parisino para la nueva temporada.'
  },
  {
    id: 'j9',
    name: 'Liverpool',
    price: 1550.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    description: 'You\'ll Never Walk Alone. Kit 24/25 inspirado en los años 80.'
  },
  {
    id: 'j10',
    name: 'Manchester United',
    price: 1600.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800',
    description: 'The Red Devils. El nuevo kit 24/25 con un degradado dinámico.'
  },
  {
    id: 'j11',
    name: 'Seleccion de Francia',
    price: 1850.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6eda1eedfa?auto=format&fit=crop&q=80&w=800',
    description: 'Les Bleus. Kit oficial Eurocopa 2024 con el gallo dorado gigante.'
  },
  {
    id: 'j12',
    name: 'Bayern de Munich',
    price: 1580.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800',
    description: 'Mia San Mia. El nuevo diseño rojo profundo para la temporada 24/25.'
  },
  {
    id: 'j13',
    name: 'Chelsea',
    price: 1490.00,
    category: 'jerseys',
    image: 'https://images.unsplash.com/photo-1529900245048-52c7104278ba?auto=format&fit=crop&q=80&w=800',
    description: 'The Blues. Diseño moderno con detalles en relieve para la nueva campaña.'
  },
  
  // Balones
  {
    id: 'b1',
    name: 'UCL Pro Match Ball',
    price: 649.99,
    category: 'balones',
    image: 'https://images.unsplash.com/photo-1614632537190-23e414d403ef?auto=format&fit=crop&q=80&w=800',
    description: 'Balón oficial de la Champions League. Certificación FIFA Quality Pro.'
  },
  {
    id: 'b2',
    name: 'Premier League Flight',
    price: 589.00,
    category: 'balones',
    image: 'https://images.unsplash.com/photo-1517748975545-36196674407b?auto=format&fit=crop&q=80&w=800',
    description: 'Aerodinámica perfeccionada para una trayectoria estable y precisa.'
  },
  {
    id: 'b3',
    name: 'World Cup Official Ball',
    price: 599.00,
    category: 'balones',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    description: 'Balón oficial del torneo más grande del mundo. Tecnología de sensor integrada.'
  },
  {
    id: 'b4',
    name: 'Balon Senda Street Freestyle',
    price: 420.00,
    category: 'balones',
    image: 'https://sendaathletics.com/cdn/shop/products/Street_Soccer_Ball_side_view.jpg',
    description: 'Específicamente diseñado para durabilidad en superficies duras y asfalto. El balón oficial de los maestros del freestyle.'
  },
  {
    id: 'b5',
    name: 'La Liga Orbita Pro',
    price: 550.00,
    category: 'balones',
    image: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&q=80&w=800',
    description: 'Balón oficial de La Liga EA Sports. Diseño de alta visibilidad.'
  },
  
  // Tacos
  {
    id: 't1',
    name: 'Phantom Venom Elite FG',
    price: 1549.99,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1549476464-37392f719918?auto=format&fit=crop&q=80&w=800',
    description: 'Velocidad de élite. Diseñados para potenciar el golpeo y la tracción en césped.'
  },
  {
    id: 't2',
    name: 'Predator Edge Pro',
    price: 1399.00,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Control absoluto del balón con relieve de alta adherencia para efectos.'
  },
  {
    id: 't3',
    name: 'Vapor Elite 15',
    price: 1499.50,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    description: 'Siente la velocidad con la unidad Zoom Air específica para fútbol.'
  },
  {
    id: 't4',
    name: 'Copa Pure II Edition',
    price: 1100.00,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1589190282059-44243b6cc741?auto=format&fit=crop&q=80&w=800',
    description: 'Toque supremo con cuero de alta calidad. Comodidad legendaria en cada paso.'
  },
  {
    id: 't5',
    name: 'Mercurial Superfly Pro',
    price: 1599.00,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1579952318536-4993175306ea?auto=format&fit=crop&q=80&w=800',
    description: 'Ajuste de calcetín Flyknit para una conexión perfecta entre pie y zapato.'
  },
  {
    id: 't6',
    name: 'Legend 10 Professional',
    price: 1250.00,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    description: 'Diseñados para los maestros del pase. Cuero técnico ultraligero.'
  }
];
