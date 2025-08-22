export interface Product {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  price: number;
  inventory: number;
  tags: string[];
  specifications: Record<string, any>;
  images: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface Cart {
  id: string;
  type: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  addresses: Address[];
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
  createdAt: string;
}

export interface Address {
  id: string;
  type: string;
  isDefault: boolean;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total: number;
  shippingAddress: Omit<Address, 'id' | 'type' | 'isDefault'>;
  paymentMethod?: {
    type: string;
    last4: string;
  };
  tracking?: {
    number: string;
    carrier: string;
    estimatedDelivery: string;
  };
  createdAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SearchResponse<T> extends ApiResponse<T> {
  searchTerm?: string;
  resultCount?: number;
}