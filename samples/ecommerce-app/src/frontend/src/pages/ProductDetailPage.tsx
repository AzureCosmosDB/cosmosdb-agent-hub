import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { productApi, cartApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productApi.getProduct(id!),
    {
      enabled: !!id,
    }
  );

  const addToCartMutation = useMutation(
    ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cartCount');
        queryClient.invalidateQueries('cart');
        alert('Product added to cart!');
      },
      onError: (error: any) => {
        alert(error.response?.data?.error || 'Failed to add item to cart');
      }
    }
  );

  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate({ productId: product.id, quantity });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  const isOutOfStock = product.inventory === 0;
  const maxQuantity = Math.min(product.inventory, 10);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        to="/products"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  className="w-full h-96 object-cover"
                  src={product.images[0]}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              {/* Category */}
              <p className="text-sm text-primary-600 mb-4 capitalize">
                {product.category}
              </p>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? '' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isOutOfStock 
                    ? 'bg-red-100 text-red-800' 
                    : product.inventory < 10
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isOutOfStock 
                    ? 'Out of Stock' 
                    : product.inventory < 10 
                    ? `Only ${product.inventory} left`
                    : 'In Stock'
                  }
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Specifications</h3>
                  <dl className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <dt className="font-medium text-gray-900 capitalize w-24">
                          {key}:
                        </dt>
                        <dd className="text-gray-600">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              {!isOutOfStock && (
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <label htmlFor="quantity" className="font-medium text-gray-900">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {[...Array(maxQuantity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isLoading}
                    className="w-full btn-primary flex items-center justify-center py-3 text-lg"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    {addToCartMutation.isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;