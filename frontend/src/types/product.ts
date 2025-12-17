export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  videos?: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: string;
  total: number;
  orderId: string;
  timestamp: string;
}
