import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import { cartApi } from '../services/api';

const Header: React.FC = () => {
  const { data: cartCount = 0 } = useQuery(
    'cartCount',
    cartApi.getCartItemCount,
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              CosmosStore
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Products
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <Link 
              to="/orders" 
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <UserIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;