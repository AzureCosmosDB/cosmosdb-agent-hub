import axios from 'axios';
import { Product, Cart, User, Order, Address, ApiResponse, PaginatedResponse, SearchResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': 'demo-user-001' // Demo user ID
  }
});

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product API
export const productApi = {
  getProducts: async (params?: Record<string, any>): Promise<Product[]> => {
    const { data } = await api.get<PaginatedResponse<Product[]>>('/products', { params });
    return data.data;
  },
  
  getProduct: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },
  
  searchProducts: async (query: string, params?: Record<string, any>): Promise<Product[]> => {
    const { data } = await api.get<SearchResponse<Product[]>>('/products/search', {
      params: { q: query, ...params }
    });
    return data.data;
  },
  
  getProductsByCategory: async (category: string, params?: Record<string, any>): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`, { params });
    return data.data;
  },
  
  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const { data } = await api.get<ApiResponse<Product[]>>('/products/featured', {
      params: { limit }
    });
    return data.data;
  },
  
  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<ApiResponse<string[]>>('/products/categories');
    return data.data;
  }
};

// Cart API
export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await api.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },
  
  addItem: async (productId: string, quantity: number = 1): Promise<Cart> => {
    const { data } = await api.post<ApiResponse<Cart>>('/cart/items', {
      productId,
      quantity
    });
    return data.data;
  },
  
  updateItemQuantity: async (productId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.put<ApiResponse<Cart>>(`/cart/items/${productId}`, {
      quantity
    });
    return data.data;
  },
  
  removeItem: async (productId: string): Promise<Cart> => {
    const { data } = await api.delete<ApiResponse<Cart>>(`/cart/items/${productId}`);
    return data.data;
  },
  
  clearCart: async (): Promise<Cart> => {
    const { data } = await api.delete<ApiResponse<Cart>>('/cart');
    return data.data;
  },
  
  getCartItemCount: async (): Promise<number> => {
    const { data } = await api.get<ApiResponse<{ count: number }>>('/cart/count');
    return data.data.count;
  }
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/users/profile');
    return data.data;
  },
  
  getAddresses: async (): Promise<Address[]> => {
    const { data } = await api.get<ApiResponse<Address[]>>('/users/addresses');
    return data.data;
  }
};

// Order API
export const orderApi = {
  getOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders');
    return data.data;
  },
  
  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  }
};

export default api;