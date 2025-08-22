import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { data: featuredProducts, isLoading, error } = useQuery(
    'featuredProducts',
    () => productApi.getFeaturedProducts(8)
  );

  const { data: categories } = useQuery(
    'categories',
    productApi.getCategories
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to CosmosStore
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products powered by Azure Cosmos DB
        </p>
        <Link 
          to="/products"
          className="btn-primary inline-block text-lg px-8 py-3"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="card p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium text-gray-900 capitalize">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link 
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </Link>
        </div>
        
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No featured products available
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Why Choose CosmosStore?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Powered by Azure Cosmos DB for ultra-fast product searches and real-time inventory
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">🌍</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Scale</h3>
            <p className="text-gray-600">
              Distributed globally with low latency access from anywhere in the world
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with 99.999% availability SLA
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;