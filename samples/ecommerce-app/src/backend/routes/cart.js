const express = require('express');
const Joi = require('joi');
const cartService = require('../services/cartService');
const productService = require('../services/productService');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Validation schemas
const addItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1)
});

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(0).required()
});

// Middleware to extract userId (simplified for demo)
function getUserId(req) {
  // In a real app, this would come from authentication middleware
  return req.headers['x-user-id'] || 'demo-user-001';
}

/**
 * GET /api/cart
 * Get user's cart
 */
router.get('/', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const cart = await cartService.getCart(userId);
  
  res.json({
    success: true,
    data: cart
  });
}));

/**
 * POST /api/cart/items
 * Add item to cart
 */
router.post('/items', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { error, value } = addItemSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  // Get product details to store in cart
  const product = await productService.getProductById(value.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Check inventory
  if (product.inventory < value.quantity) {
    return res.status(400).json({ 
      error: 'Insufficient inventory',
      available: product.inventory
    });
  }
  
  const productDetails = {
    name: product.name,
    price: product.price,
    image: product.images?.[0] || ''
  };
  
  const cart = await cartService.addItem(userId, value.productId, value.quantity, productDetails);
  
  res.json({
    success: true,
    data: cart,
    message: 'Item added to cart'
  });
}));

/**
 * PUT /api/cart/items/:productId
 * Update item quantity in cart
 */
router.put('/items/:productId', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  const { error, value } = updateQuantitySchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: 'Validation error', details: error.details });
  }
  
  // If quantity > 0, check product inventory
  if (value.quantity > 0) {
    const product = await productService.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.inventory < value.quantity) {
      return res.status(400).json({ 
        error: 'Insufficient inventory',
        available: product.inventory
      });
    }
  }
  
  const cart = await cartService.updateItemQuantity(userId, productId, value.quantity);
  
  res.json({
    success: true,
    data: cart,
    message: value.quantity > 0 ? 'Item quantity updated' : 'Item removed from cart'
  });
}));

/**
 * DELETE /api/cart/items/:productId
 * Remove item from cart
 */
router.delete('/items/:productId', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { productId } = req.params;
  
  const cart = await cartService.removeItem(userId, productId);
  
  res.json({
    success: true,
    data: cart,
    message: 'Item removed from cart'
  });
}));

/**
 * DELETE /api/cart
 * Clear cart
 */
router.delete('/', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const cart = await cartService.clearCart(userId);
  
  res.json({
    success: true,
    data: cart,
    message: 'Cart cleared'
  });
}));

/**
 * GET /api/cart/count
 * Get cart item count
 */
router.get('/count', asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const count = await cartService.getCartItemCount(userId);
  
  res.json({
    success: true,
    data: { count }
  });
}));

module.exports = router;