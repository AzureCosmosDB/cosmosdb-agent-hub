import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cartApi } from '../services/api';
import { CartItem } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: cart, isLoading, error } = useQuery('cart', cartApi.getCart);

  const updateQuantityMutation = useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItemQuantity(productId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        queryClient.invalidateQueries('cartCount');
      },
      onError: (error: any) => {
        alert(error.response?.data?.error || 'Failed to update cart');
      }
    }
  );

  const removeItemMutation = useMutation(
    (productId: string) => cartApi.removeItem(productId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        queryClient.invalidateQueries('cartCount');
      },
      onError: (error: any) => {
        alert(error.response?.data?.error || 'Failed to remove item');
      }
    }
  );

  const clearCartMutation = useMutation(
    () => cartApi.clearCart(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
        queryClient.invalidateQueries('cartCount');
      }
    }
  );

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantityMutation.mutate({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCartMutation.mutate();
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading cart</div>;

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        {!isEmpty && (
          <button
            onClick={handleClearCart}
            disabled={clearCartMutation.isLoading}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart!.items.map((item: CartItem) => (
              <div key={item.productId} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.image ? (
                      <img
                        className="w-20 h-20 object-cover rounded-lg"
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Product';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link
                      to={`/products/${item.productId}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updateQuantityMutation.isLoading}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={updateQuantityMutation.isLoading}
                      className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    disabled={removeItemMutation.isLoading}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({cart!.items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </span>
                  <span className="font-medium">
                    ${cart!.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart!.total > 50 ? 'Free' : '$9.99'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${(cart!.total * 0.08).toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${(cart!.total + (cart!.total > 50 ? 0 : 9.99) + (cart!.total * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {cart!.total < 50 && (
                <p className="text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg">
                  💡 Add ${(50 - cart!.total).toFixed(2)} more to get free shipping!
                </p>
              )}

              <button className="w-full btn-primary mt-6 py-3 text-lg">
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-primary-600 hover:text-primary-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;