import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, PRODUCTS as STATIC_PRODUCTS } from './constants';
import { getProductsFromDB, seedDatabase, onAuthChange, updateProductImage, cleanupDuplicates, updateProductData } from './lib/dbService';
import { User } from 'firebase/auth';

interface CartItem extends Product {
  quantity: number;
}

const ADMIN_EMAIL = 'isaacvh27@gmail.com';

interface AppContextType {
  products: Product[];
  isLoading: boolean;
  user: User | null;
  isAdmin: boolean;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  totalItems: number;
  totalPrice: number;
  refreshProducts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthChange((newUser) => {
      setUser(newUser);
    });
    return () => unsubscribe();
  }, []);

  // Initialize and load products from Firebase
  useEffect(() => {
    async function init() {
      try {
        // Load products first to show something immediately
        const dbProducts = (await getProductsFromDB()) as Product[];
        if (dbProducts.length > 0) {
          setProducts(dbProducts);
          setIsLoading(false);
          // Run sync in background
          seedDatabase().then(() => cleanupDuplicates());
        } else {
          // If empty, we MUST wait for seed to see anything
          await seedDatabase();
          const firstProducts = (await getProductsFromDB()) as Product[];
          setProducts(firstProducts);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('CRITICAL ERROR initializing app:', error);
        // Fallback to static products if DB fails entirely
        setProducts(STATIC_PRODUCTS);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Load from localStorage if available
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedFavorites = localStorage.getItem('favorites');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === product.id);
      if (exists) {
        return prev.filter((fav) => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: string) => favorites.some((fav) => fav.id === productId);

  async function refreshProducts() {
    setIsLoading(true);
    try {
      const dbProducts = (await getProductsFromDB()) as Product[];
      setProducts(dbProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AppContext.Provider 
      value={{ 
        products,
        isLoading,
        user,
        isAdmin,
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        totalItems, 
        totalPrice,
        refreshProducts
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
