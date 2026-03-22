export type User = {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  address?: string;
  createdAt?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  origin: string;
  sizes: string[];
  featured: boolean;
  stock: number;
  status: 'active' | 'inactive';
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
};

export type CartActionResult = {
  ok: boolean;
  message?: string;
};

export type Order = {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  items: Array<{
    product: string;
    name: string;
    image: string;
    price: number;
    size: string;
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    zipCode?: string;
  };
  paymentMethod: 'card' | 'ewallet' | 'cod';
  paymentStatus: 'pending' | 'paid';
  status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  note?: string;
  createdAt: string;
};
