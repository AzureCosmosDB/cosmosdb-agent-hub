const { getContainer, executeQuery } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ProductService {
  constructor() {
    this.container = null;
  }
  
  getProductsContainer() {
    if (!this.container) {
      this.container = getContainer('products');
    }
    return this.container;
  }
  
  /**
   * Get all products with pagination and filtering
   */
  async getProducts(options = {}) {
    const {
      category,
      searchTerm,
      minPrice,
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = options;
    
    let query = 'SELECT * FROM c WHERE c.type = "product"';
    const parameters = [];
    
    // Add filters
    if (category) {
      query += ' AND c.category = @category';
      parameters.push({ name: '@category', value: category });
    }
    
    if (searchTerm) {
      query += ' AND (CONTAINS(UPPER(c.name), UPPER(@searchTerm)) OR CONTAINS(UPPER(c.description), UPPER(@searchTerm)))';
      parameters.push({ name: '@searchTerm', value: searchTerm });
    }
    
    if (minPrice) {
      query += ' AND c.price >= @minPrice';
      parameters.push({ name: '@minPrice', value: parseFloat(minPrice) });
    }
    
    if (maxPrice) {
      query += ' AND c.price <= @maxPrice';
      parameters.push({ name: '@maxPrice', value: parseFloat(maxPrice) });
    }
    
    // Add sorting
    const validSortFields = ['name', 'price', 'rating', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY c.${sortField} ${order}`;
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += ` OFFSET ${offset} LIMIT ${limit}`;
    
    return executeQuery(this.getProductsContainer(), query, parameters);
  }
  
  /**
   * Get product by ID
   */
  async getProductById(id) {
    const query = 'SELECT * FROM c WHERE c.id = @id AND c.type = "product"';
    const parameters = [{ name: '@id', value: id }];
    
    const results = await executeQuery(this.getProductsContainer(), query, parameters);
    return results.length > 0 ? results[0] : null;
  }
  
  /**
   * Get products by category (optimized with partition key)
   */
  async getProductsByCategory(category, options = {}) {
    const { sortBy = 'name', sortOrder = 'asc', limit = 20 } = options;
    
    let query = 'SELECT * FROM c WHERE c.category = @category AND c.type = "product"';
    const parameters = [{ name: '@category', value: category }];
    
    // Add sorting
    const validSortFields = ['name', 'price', 'rating'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY c.${sortField} ${order}`;
    
    if (limit) {
      query += ` OFFSET 0 LIMIT ${limit}`;
    }
    
    return executeQuery(this.getProductsContainer(), query, parameters);
  }
  
  /**
   * Create a new product
   */
  async createProduct(productData) {
    const product = {
      id: `product-${uuidv4()}`,
      type: 'product',
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { resource } = await this.getProductsContainer().items.create(product);
    return resource;
  }
  
  /**
   * Update product
   */
  async updateProduct(id, updateData) {
    const existingProduct = await this.getProductById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = {
      ...existingProduct,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    const { resource } = await this.getProductsContainer()
      .item(id, existingProduct.category)
      .replace(updatedProduct);
    
    return resource;
  }
  
  /**
   * Update product inventory
   */
  async updateInventory(id, quantity) {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    const newInventory = Math.max(0, product.inventory + quantity);
    return this.updateProduct(id, { inventory: newInventory });
  }
  
  /**
   * Delete product
   */
  async deleteProduct(id) {
    const product = await this.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    
    await this.getProductsContainer().item(id, product.category).delete();
    return true;
  }
  
  /**
   * Search products with advanced options
   */
  async searchProducts(searchTerm, options = {}) {
    const {
      categories = [],
      priceRange = {},
      tags = [],
      sortBy = 'relevance',
      limit = 20
    } = options;
    
    let query = `
      SELECT *, 
        (CONTAINS(UPPER(c.name), UPPER(@searchTerm)) ? 3 : 0) +
        (CONTAINS(UPPER(c.description), UPPER(@searchTerm)) ? 1 : 0) +
        (ARRAY_LENGTH(ARRAY_FILTER(c.tags, tag => CONTAINS(UPPER(tag), UPPER(@searchTerm)))) * 2) as relevanceScore
      FROM c 
      WHERE c.type = "product"
      AND (
        CONTAINS(UPPER(c.name), UPPER(@searchTerm)) OR 
        CONTAINS(UPPER(c.description), UPPER(@searchTerm)) OR
        EXISTS(SELECT VALUE tag FROM tag IN c.tags WHERE CONTAINS(UPPER(tag), UPPER(@searchTerm)))
      )
    `;
    
    const parameters = [{ name: '@searchTerm', value: searchTerm }];
    
    // Add category filter
    if (categories.length > 0) {
      query += ` AND c.category IN (${categories.map((_, i) => `@category${i}`).join(', ')})`;
      categories.forEach((category, i) => {
        parameters.push({ name: `@category${i}`, value: category });
      });
    }
    
    // Add price range filter
    if (priceRange.min !== undefined) {
      query += ' AND c.price >= @minPrice';
      parameters.push({ name: '@minPrice', value: priceRange.min });
    }
    
    if (priceRange.max !== undefined) {
      query += ' AND c.price <= @maxPrice';
      parameters.push({ name: '@maxPrice', value: priceRange.max });
    }
    
    // Add sorting
    if (sortBy === 'relevance') {
      query += ' ORDER BY relevanceScore DESC, c.rating DESC';
    } else if (sortBy === 'price_asc') {
      query += ' ORDER BY c.price ASC';
    } else if (sortBy === 'price_desc') {
      query += ' ORDER BY c.price DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY c.rating DESC';
    } else {
      query += ' ORDER BY c.name ASC';
    }
    
    if (limit) {
      query += ` OFFSET 0 LIMIT ${limit}`;
    }
    
    return executeQuery(this.getProductsContainer(), query, parameters);
  }
  
  /**
   * Get product categories
   */
  async getCategories() {
    const query = 'SELECT DISTINCT VALUE c.category FROM c WHERE c.type = "product"';
    return executeQuery(this.getProductsContainer(), query);
  }
  
  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 8) {
    const query = `
      SELECT * FROM c 
      WHERE c.type = "product" 
      AND c.rating >= 4.0 
      ORDER BY c.rating DESC, c.reviewCount DESC 
      OFFSET 0 LIMIT ${limit}
    `;
    
    return executeQuery(this.getProductsContainer(), query);
  }
}

module.exports = new ProductService();