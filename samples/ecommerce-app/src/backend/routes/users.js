const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Simplified user routes for demo purposes
// In a real application, this would include proper authentication, 
// user registration, profile management, etc.

/**
 * GET /api/users/profile
 * Get user profile (demo endpoint)
 */
router.get('/profile', asyncHandler(async (req, res) => {
  const userId = req.headers['x-user-id'] || 'demo-user-001';
  
  // Mock user data
  const user = {
    id: userId,
    email: 'demo@example.com',
    profile: {
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890'
    },
    addresses: [
      {
        id: 'addr-001',
        type: 'shipping',
        isDefault: true,
        street: '123 Demo Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'US'
      }
    ],
    preferences: {
      newsletter: true,
      notifications: true
    },
    createdAt: '2024-01-01T00:00:00Z'
  };
  
  res.json({
    success: true,
    data: user
  });
}));

/**
 * GET /api/users/addresses
 * Get user addresses
 */
router.get('/addresses', asyncHandler(async (req, res) => {
  const addresses = [
    {
      id: 'addr-001',
      type: 'shipping',
      isDefault: true,
      street: '123 Demo Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'US'
    }
  ];
  
  res.json({
    success: true,
    data: addresses
  });
}));

module.exports = router;