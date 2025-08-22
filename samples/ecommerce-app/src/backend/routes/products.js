const express = require('express');
const Joi = require('joi');
const productService = require('../services/productService');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const productQuerySchema = Joi.object({
  category: Joi.string().optional(),
  searchTerm: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('name', 'price', 'rating', 'createdAt').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const searchQuerySchema = Joi.object({
  q: Joi.string().required(),
  categories: Joi.string().optional(), // comma-separated
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('relevance', 'price_asc', 'price_desc', 'rating', 'name').default('relevance'),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const productCreateSchema = Joi.object({
  name: Joi.string().required().min(1).max(200),
  description: Joi.string().required().min(10).max(2000),
  category: Joi.string().required().min(1).max(50),
  price: Joi.number().required().min(0),
  inventory: Joi.number().integer().min(0).default(0),
  tags: Joi.array().items(Joi.string().max(50)).optional(),
  specifications: Joi.object().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

/**
 * GET /api/products
 * Get products with filtering, sorting, and pagination
 */
router.get('/', asyncHandler(async (req, res) => {
  const { error, value } = productQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  const products = await productService.getProducts(value);
  
  res.json({
    success: true,
    data: products,
    pagination: {
      page: value.page,
      limit: value.limit,
      hasMore: products.length === value.limit
    }
  });
}));

/**
 * GET /api/products/search
 * Search products with advanced filtering
 */
router.get('/search', asyncHandler(async (req, res) => {
  const { error, value } = searchQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  const options = {
    categories: value.categories ? value.categories.split(',') : [],
    priceRange: {
      min: value.minPrice,
      max: value.maxPrice
    },
    sortBy: value.sortBy,
    limit: value.limit
  };
  
  const products = await productService.searchProducts(value.q, options);
  
  res.json({
    success: true,
    data: products,
    searchTerm: value.q,
    resultCount: products.length
  });
}));

/**
 * GET /api/products/categories
 * Get all product categories
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  
  res.json({
    success: true,
    data: categories
  });
}));

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await productService.getFeaturedProducts(limit);
  
  res.json({
    success: true,
    data: products
  });
}));

/**
 * GET /api/products/category/:category
 * Get products by category (optimized query)
 */
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const options = {
    sortBy: req.query.sortBy || 'name',
    sortOrder: req.query.sortOrder || 'asc',
    limit: parseInt(req.query.limit) || 20
  };
  
  const products = await productService.getProductsByCategory(category, options);
  
  res.json({
    success: true,
    data: products,
    category
  });
}));

/**
 * GET /api/products/:id
 * Get product by ID
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  const product = await productService.getProductById(id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json({
    success: true,
    data: product
  });
}));

/**
 * POST /api/products
 * Create a new product
 */
router.post('/', asyncHandler(async (req, res) => {
  const { error, value } = productCreateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  const product = await productService.createProduct(value);
  
  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully'
  });
}));

/**
 * PUT /api/products/:id
 * Update product
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Create update schema (all fields optional)
  const updateSchema = productCreateSchema.fork(['name', 'description', 'category', 'price'], (schema) => 
    schema.optional()
  );
  
  const { error, value } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  const product = await productService.updateProduct(id, value);
  
  res.json({
    success: true,
    data: product,
    message: 'Product updated successfully'
  });
}));

/**
 * PATCH /api/products/:id/inventory
 * Update product inventory
 */
router.patch('/:id/inventory', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  if (typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Quantity must be a number' });
  }
  
  const product = await productService.updateInventory(id, quantity);
  
  res.json({
    success: true,
    data: product,
    message: 'Inventory updated successfully'
  });
}));

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await productService.deleteProduct(id);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

module.exports = router;