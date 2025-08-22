import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { orderApi } from '../services/api';
import { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery('orders', orderApi.getOrders);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading orders</div>;

  const isEmpty = !orders || orders.length === 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Order History</h1>

      {isEmpty ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-6">
            When you place orders, they'll appear here
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            className="w-12 h-12 object-cover rounded-lg"
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Product';
                            }}
                          />
                        )}
                        <div className="flex-grow">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-600">
                        +{order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Delivery Info */}
                {order.deliveredAt && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Delivered on {formatDate(order.deliveredAt)}
                    </p>
                  </div>
                )}

                {/* Tracking Info */}
                {order.tracking && order.status !== 'delivered' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📦 Tracking: {order.tracking.number} ({order.tracking.carrier})
                    </p>
                    {order.tracking.estimatedDelivery && (
                      <p className="text-sm text-blue-600">
                        Estimated delivery: {formatDate(order.tracking.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                )}

                {/* Shipping Address */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Shipping Address:</p>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-4">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    View Details
                  </Link>
                  
                  {order.status === 'delivered' && (
                    <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      Reorder
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;