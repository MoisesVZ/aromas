// src/types/index.ts

export interface Product {
  id: string; // UUID (string) en Supabase
  name: string;
  price: number;
  stock: number; // Cantidad disponible
  image_url: string; // URL pública desde Supabase Storage
  description?: string;
  active: boolean; // Si el producto está visible o no
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
  };
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentProof?: string;
}

/**
 * AdminUser ya no debe existir como login por username/password en frontend.
 * Con Supabase, el admin se define por Auth + tabla profiles(role='admin').
 * Si aún lo estás usando en UI temporalmente, bórralo cuando migres Auth.
 */
export interface AdminUser {
  username: string;
  password: string;
}
