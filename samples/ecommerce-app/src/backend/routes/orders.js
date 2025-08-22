const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Simplified order routes for demo purposes
// In a real application, this would include order creation,
// payment processing, order tracking, etc.

/**
 * GET /api/orders
 * Get user orders
 */
router.get('/', asyncHandler(async (req, res) => {
  const userId = req.headers['x-user-id'] || 'demo-user-001';
  
  // Mock order data
  const orders = [
    {
      id: 'order-001',
      userId,
      status: 'delivered',
      items: [
        {
          productId: 'product-001',
          name: 'Wireless Bluetooth Headphones',
          quantity: 1,
          price: 129.99
        }
      ],
      total: 129.99,
      shippingAddress: {
        street: '123 Demo Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101'
      },
      createdAt: '2024-01-15T10:30:00Z',
      deliveredAt: '2024-01-18T14:20:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: orders
  });
}));

/**
 * GET /api/orders/:id
 * Get specific order
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.headers['x-user-id'] || 'demo-user-001';
  
  // Mock order data
  const order = {
    id,
    userId,
    status: 'processing',
    items: [
      {
        productId: 'product-001',
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 129.99,
        image: 'https://example.com/images/headphones-1.jpg'
      }
    ],
    subtotal: 129.99,
    tax: 10.40,
    shipping: 9.99,
    total: 150.38,
    shippingAddress: {
      street: '123 Demo Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '1234'
    },
    tracking: {
      number: 'TRK123456789',
      carrier: 'UPS',
      estimatedDelivery: '2024-01-20T17:00:00Z'
    },
    createdAt: '2024-01-16T09:15:00Z'
  };
  
  res.json({
    success: true,
    data: order
  });
}));

module.exports = router;