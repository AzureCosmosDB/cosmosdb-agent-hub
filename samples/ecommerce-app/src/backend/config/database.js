const { CosmosClient } = require('@azure/cosmos');
const { logger } = require('../utils/logger');

// Cosmos DB client configuration
const config = {
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY,
  databaseName: process.env.COSMOS_DB_DATABASE_NAME || 'ecommerce',
  containers: {
    products: {
      name: 'products',
      partitionKey: '/category'
    },
    users: {
      name: 'users', 
      partitionKey: '/id'
    },
    orders: {
      name: 'orders',
      partitionKey: '/userId'
    },
    cart: {
      name: 'cart',
      partitionKey: '/userId'
    }
  }
};

// Validate configuration
if (!config.endpoint || !config.key) {
  throw new Error('Azure Cosmos DB endpoint and key must be provided in environment variables');
}

// Initialize Cosmos DB client
const client = new CosmosClient({
  endpoint: config.endpoint,
  key: config.key,
  connectionPolicy: {
    requestTimeout: 10000,
    enableEndpointDiscovery: true,
    preferredLocations: [] // Will use the write region
  }
});

let database;
let containers = {};

/**
 * Initialize database and containers
 */
async function initializeDatabase() {
  try {
    logger.info('Initializing Azure Cosmos DB connection...');
    
    // Create database if it doesn't exist
    const { database: db } = await client.databases.createIfNotExists({
      id: config.databaseName,
      throughput: 400 // Shared throughput for development
    });
    
    database = db;
    logger.info(`Database '${config.databaseName}' initialized`);
    
    // Create containers if they don't exist
    for (const [key, containerConfig] of Object.entries(config.containers)) {
      const { container } = await database.containers.createIfNotExists({
        id: containerConfig.name,
        partitionKey: containerConfig.partitionKey,
        // Indexing policy optimized for e-commerce queries
        indexingPolicy: {
          indexingMode: 'consistent',
          automatic: true,
          includedPaths: [
            { path: '/*' }
          ],
          excludedPaths: [
            { path: '/description/*' },
            { path: '/specifications/*' }
          ],
          compositeIndexes: key === 'products' ? [
            [
              { path: '/category', order: 'ascending' },
              { path: '/price', order: 'ascending' }
            ],
            [
              { path: '/category', order: 'ascending' },
              { path: '/name', order: 'ascending' }
            ]
          ] : []
        }
      });
      
      containers[key] = container;
      logger.info(`Container '${containerConfig.name}' initialized`);
    }
    
    // Seed sample data if containers are empty
    await seedSampleData();
    
    logger.info('Database initialization completed successfully');
    
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Seed sample data for development
 */
async function seedSampleData() {
  try {
    // Check if products container has data
    const query = 'SELECT VALUE COUNT(1) FROM c WHERE c.type = "product"';
    const { resources } = await containers.products.items.query(query).fetchAll();
    
    if (resources[0] === 0) {
      logger.info('Seeding sample product data...');
      
      const sampleProducts = [
        {
          id: 'product-001',
          type: 'product',
          name: 'Wireless Bluetooth Headphones',
          description: 'Premium quality wireless headphones with noise cancellation',
          category: 'electronics',
          price: 129.99,
          inventory: 50,
          tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
          specifications: {
            brand: 'AudioTech',
            model: 'AT-WH1000',
            color: 'Black',
            batteryLife: '30 hours',
            features: ['Noise Cancellation', 'Quick Charge', 'Voice Assistant']
          },
          images: ['https://example.com/images/headphones-1.jpg'],
          rating: 4.5,
          reviewCount: 128,
          createdAt: new Date().toISOString()
        },
        {
          id: 'product-002',
          type: 'product',
          name: 'Organic Cotton T-Shirt',
          description: 'Comfortable organic cotton t-shirt in various colors',
          category: 'clothing',
          price: 24.99,
          inventory: 100,
          tags: ['organic', 'cotton', 'shirt', 'clothing'],
          specifications: {
            brand: 'EcoWear',
            material: '100% Organic Cotton',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['White', 'Black', 'Navy', 'Gray']
          },
          images: ['https://example.com/images/tshirt-1.jpg'],
          rating: 4.2,
          reviewCount: 89,
          createdAt: new Date().toISOString()
        },
        {
          id: 'product-003',
          type: 'product',
          name: 'Smart Fitness Watch',
          description: 'Advanced fitness tracking with heart rate monitoring',
          category: 'electronics',
          price: 199.99,
          inventory: 25,
          tags: ['fitness', 'watch', 'smart', 'health'],
          specifications: {
            brand: 'FitTech',
            model: 'FT-SW200',
            display: '1.4" AMOLED',
            batteryLife: '7 days',
            features: ['Heart Rate', 'GPS', 'Sleep Tracking', 'Waterproof']
          },
          images: ['https://example.com/images/smartwatch-1.jpg'],
          rating: 4.7,
          reviewCount: 245,
          createdAt: new Date().toISOString()
        }
      ];
      
      for (const product of sampleProducts) {
        await containers.products.items.create(product);
      }
      
      logger.info(`Seeded ${sampleProducts.length} sample products`);
    }
  } catch (error) {
    logger.warn('Failed to seed sample data:', error.message);
  }
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

/**
 * Get container instance
 */
function getContainer(containerName) {
  if (!containers[containerName]) {
    throw new Error(`Container '${containerName}' not found. Available containers: ${Object.keys(containers).join(', ')}`);
  }
  return containers[containerName];
}

/**
 * Execute a query with error handling and logging
 */
async function executeQuery(container, query, parameters = []) {
  try {
    const querySpec = {
      query,
      parameters
    };
    
    const { resources, requestCharge } = await container.items.query(querySpec).fetchAll();
    
    logger.debug(`Query executed successfully. RU consumed: ${requestCharge}`);
    return resources;
    
  } catch (error) {
    logger.error('Query execution failed:', { query, error: error.message });
    throw error;
  }
}

module.exports = {
  client,
  config,
  initializeDatabase,
  getDatabase,
  getContainer,
  executeQuery
};