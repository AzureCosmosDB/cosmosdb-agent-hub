import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from 'react-query';
import { Product } from '../types';
import { cartApi } from '../services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cartCount');
        queryClient.invalidateQueries('cart');
      },
      onError: (error: any) => {
        alert(error.response?.data?.error || 'Failed to add item to cart');
      }
    }
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  const isOutOfStock = product.inventory === 0;

  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              src={product.images[0]}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Product+Image';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? '' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            
            {/* Stock status */}
            <span className={`text-xs px-2 py-1 rounded-full ${
              isOutOfStock 
                ? 'bg-red-100 text-red-800' 
                : product.inventory < 10
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {isOutOfStock 
                ? 'Out of Stock' 
                : product.inventory < 10 
                ? `${product.inventory} left`
                : 'In Stock'
              }
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || addToCartMutation.isLoading}
            className={`mt-3 w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary hover:bg-primary-600'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            {addToCartMutation.isLoading 
              ? 'Adding...' 
              : isOutOfStock 
              ? 'Out of Stock' 
              : 'Add to Cart'
            }
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;