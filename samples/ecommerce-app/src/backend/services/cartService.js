const { getContainer, executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class CartService {
  constructor() {
    this.container = null;
  }
  
  getCartContainer() {
    if (!this.container) {
      this.container = getContainer('cart');
    }
    return this.container;
  }
  
  /**
   * Get user's cart
   */
  async getCart(userId) {
    const query = 'SELECT * FROM c WHERE c.userId = @userId AND c.type = "cart"';
    const parameters = [{ name: '@userId', value: userId }];
    
    const results = await executeQuery(this.getCartContainer(), query, parameters);
    
    if (results.length === 0) {
      // Create empty cart if none exists
      return this.createCart(userId);
    }
    
    return results[0];
  }
  
  /**
   * Create a new cart for user
   */
  async createCart(userId) {
    const cart = {
      id: `cart-${uuidv4()}`,
      type: 'cart',
      userId,
      items: [],
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { resource } = await this.getCartContainer().items.create(cart);
    return resource;
  }
  
  /**
   * Add item to cart
   */
  async addItem(userId, productId, quantity = 1, productDetails = {}) {
    const cart = await this.getCart(userId);
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        productId,
        quantity,
        name: productDetails.name || '',
        price: productDetails.price || 0,
        image: productDetails.image || '',
        addedAt: new Date().toISOString()
      });
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    const { resource } = await this.getCartContainer()
      .item(cart.id, cart.userId)
      .replace(cart);
    
    return resource;
  }
  
  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(userId, productId, quantity) {
    const cart = await this.getCart(userId);
    
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    const { resource } = await this.getCartContainer()
      .item(cart.id, cart.userId)
      .replace(cart);
    
    return resource;
  }
  
  /**
   * Remove item from cart
   */
  async removeItem(userId, productId) {
    const cart = await this.getCart(userId);
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    const { resource } = await this.getCartContainer()
      .item(cart.id, cart.userId)
      .replace(cart);
    
    return resource;
  }
  
  /**
   * Clear cart
   */
  async clearCart(userId) {
    const cart = await this.getCart(userId);
    
    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date().toISOString();
    
    const { resource } = await this.getCartContainer()
      .item(cart.id, cart.userId)
      .replace(cart);
    
    return resource;
  }
  
  /**
   * Get cart item count
   */
  async getCartItemCount(userId) {
    const cart = await this.getCart(userId);
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

module.exports = new CartService();