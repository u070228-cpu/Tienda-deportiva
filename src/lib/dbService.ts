import { collection, addDoc, getDocs, deleteDoc, query, where, updateDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, storage, auth } from './firebase';
import { PRODUCTS } from '../constants';

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log("Inicio de sesión cancelado por el usuario.");
      return null;
    }
    console.error("Error signing in with Google", error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function seedDatabase() {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    
    if (snapshot.empty) {
      console.log('Seeding database with initial products...');
      for (const product of PRODUCTS) {
        try {
          const productRef = doc(db, 'products', product.id);
          await setDoc(productRef, product);
        } catch (e) {
          console.error(`Error seeding product ${product.id}:`, e);
        }
      }
    } else {
      console.log('Synchronizing database with constants.ts...');
      // Batch sync to constants
      for (const product of PRODUCTS) {
        const dbDoc = snapshot.docs.find(d => d.id === product.id);
        if (!dbDoc) {
          await setDoc(doc(db, 'products', product.id), product);
        } else {
          const data = dbDoc.data();
          // Solo actualizamos si hay cambios significativos y el campo NO fue editado manualmente (image)
          // Si la imagen en DB empieza por "https://firebasestorage.googleapis.com", asumimos que es una carga manual y NO la sobreescribimos con constants
          const isManualImage = data.image?.includes('firebasestorage.googleapis.com');
          
          if (data.name !== product.name || data.category !== product.category || (!isManualImage && data.image !== product.image)) {
            await updateDoc(doc(db, 'products', product.id), { 
              name: product.name,
              category: product.category,
              image: isManualImage ? data.image : product.image
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('CRITICAL Error in seedDatabase:', error);
  }
}

export async function cleanupDuplicates() {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  const seenNames = new Set<string>();
  
  // Ordenar para procesar primero los productos originales (IDs cortos como j1, b1)
  const sortedDocs = [...snapshot.docs].sort((a, b) => {
    const aIsOriginal = a.id.length < 5;
    const bIsOriginal = b.id.length < 5;
    if (aIsOriginal && !bIsOriginal) return -1;
    if (!aIsOriginal && bIsOriginal) return 1;
    return 0;
  });
  
  for (const docSnapshot of sortedDocs) {
    const data = docSnapshot.data();
    const rawName = data.name || '';
    let nameKey = rawName.trim().toLowerCase();
    
    // Normalización agresiva para el caso del Milan
    if (nameKey.includes('ac milan')) {
      nameKey = 'ac milan';
    }
    
    if (seenNames.has(nameKey)) {
      console.log(`Eliminando duplicado detectado: ${rawName} (ID: ${docSnapshot.id})`);
      await deleteDoc(doc(db, 'products', docSnapshot.id));
    } else {
      seenNames.add(nameKey);
    }
  }
}

export async function getProductsFromDB() {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export async function updateProductImage(productId: string, newImageUrl: string) {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, {
    image: newImageUrl
  });
}

export async function updateProductData(productId: string, data: Partial<any>) {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, data);
}

async function compressImage(file: File): Promise<Blob | File> {
  // Si el archivo es pequeño, no perdemos tiempo
  if (file.size < 200 * 1024) return file;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(file), 6000);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          clearTimeout(timeout);
          resolve(blob || file);
        }, 'image/jpeg', 0.6);
      };
      img.onerror = () => { clearTimeout(timeout); resolve(file); };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadProductImage(productId: string, file: File, onProgress?: (percent: number) => void) {
  console.log(`Iniciando proceso de subida para: ${productId}`);
  let dataToUpload: Blob | File = file;
  
  try {
    dataToUpload = await compressImage(file);
  } catch (e) {
    console.error('Error crítico en compresión:', e);
  }
  
  return new Promise<string>((resolve, reject) => {
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storageRef = ref(storage, `products/${productId}-${uniqueId}.jpg`);
    
    console.log('Iniciando subida a Firebase Storage...');
    const uploadTask = uploadBytesResumable(storageRef, dataToUpload);

    // Timeout de 10 minutos para dar margen en cualquier situación
    const timeout = setTimeout(() => {
      console.error('TIMEOUT: La subida excedió los 10 minutos');
      uploadTask.cancel();
      reject(new Error('La subida tardó demasiado. Prueba con un archivo más pequeño o revisa tu conexión.'));
    }, 600000);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundedProgress = Math.round(progress);
        console.log(`Progreso de subida: ${roundedProgress}%`);
        if (onProgress) onProgress(roundedProgress);
      }, 
      (error) => {
        clearTimeout(timeout);
        console.error('Error de Firebase Storage:', error);
        reject(error);
      }, 
      async () => {
        clearTimeout(timeout);
        try {
          console.log('Subida completada con éxito. Obteniendo URL...');
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('URL obtenida:', downloadURL);
          
          if (productId !== 'temp') {
            console.log('Actualizando documento en Firestore...');
            await updateProductImage(productId, downloadURL);
          }
          resolve(downloadURL);
        } catch (err) {
          console.error('Error obteniendo URL final:', err);
          reject(err);
        }
      }
    );
  });
}

export async function forceSyncDatabase() {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  
  console.log('Forcing full database sync with constants...');
  
  // Borramos los productos existentes que coinciden con IDs de constants para asegurar sobreescritura
  const constantIds = PRODUCTS.map(p => p.id);
  
  for (const docSnapshot of snapshot.docs) {
    if (constantIds.includes(docSnapshot.id)) {
      await deleteDoc(doc(db, 'products', docSnapshot.id));
    }
  }
  
  // Re-ejecutamos seed
  await seedDatabase();
}

export async function createProduct(product: any) {
  const productsCol = collection(db, 'products');
  const docRef = await addDoc(productsCol, product);
  return docRef.id;
}
