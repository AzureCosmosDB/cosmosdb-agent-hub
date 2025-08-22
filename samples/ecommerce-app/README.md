# E-commerce Sample Application with Azure Cosmos DB

A comprehensive e-commerce application demonstrating best practices for building modern web applications with Azure Cosmos DB, featuring product catalog management, shopping cart functionality, and seamless database integration.

## Features

- **Product Catalog Management**: Browse, search, and manage products with rich metadata
- **Shopping Cart**: Add, update, and remove items with real-time cart management
- **User Management**: User registration, authentication, and profile management
- **Order Processing**: Complete order workflow from cart to fulfillment
- **Inventory Management**: Real-time inventory tracking and updates
- **Performance Optimized**: Efficient queries and partition key strategies

## Architecture

This sample demonstrates:
- **Schema-free design** with Azure Cosmos DB
- **Optimal partition key strategies** for e-commerce workloads
- **Query optimization** for common e-commerce scenarios
- **Data modeling best practices** for NoSQL databases
- **Real-time inventory management** with change feed
- **Scalable architecture** patterns

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: React with TypeScript
- **Database**: Azure Cosmos DB (SQL API)
- **Authentication**: Azure AD B2C integration
- **Deployment**: Azure Container Apps

## Quick Start

1. **Prerequisites**
   - Node.js 18+
   - Azure subscription
   - Azure Cosmos DB account

2. **Setup**
   ```bash
   cd samples/ecommerce-app
   npm install
   cp .env.example .env
   # Configure your Azure Cosmos DB connection string
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```

## Data Model

### Products Container
```json
{
  "id": "product-12345",
  "type": "product",
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "category": "electronics",
  "price": 129.99,
  "inventory": 50,
  "tags": ["wireless", "audio", "bluetooth"],
  "specifications": {
    "brand": "TechBrand",
    "model": "WH-1000",
    "color": "black"
  },
  "partitionKey": "electronics"
}
```

### Users Container
```json
{
  "id": "user-67890",
  "type": "user",
  "email": "john@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "addresses": [
    {
      "type": "shipping",
      "street": "123 Main St",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101"
    }
  ],
  "partitionKey": "user-67890"
}
```

### Orders Container
```json
{
  "id": "order-54321",
  "type": "order",
  "userId": "user-67890",
  "status": "processing",
  "items": [
    {
      "productId": "product-12345",
      "quantity": 2,
      "price": 129.99
    }
  ],
  "total": 259.98,
  "createdAt": "2024-01-15T10:30:00Z",
  "partitionKey": "user-67890"
}
```

## Key Features Demonstrated

### 1. Efficient Querying
- Point reads for product details
- Cross-partition queries for search functionality
- Parameterized queries for security

### 2. Partition Strategy
- **Products**: Partitioned by category for efficient browsing
- **Users**: Partitioned by user ID for data isolation
- **Orders**: Partitioned by user ID for query efficiency

### 3. Change Feed Integration
- Real-time inventory updates
- Order status notifications
- Audit logging

### 4. Performance Optimization
- Connection pooling
- Query result caching
- Batch operations for bulk updates

## GitHub Copilot Integration

This sample includes custom instructions and prompts for GitHub Copilot to help with:
- Data modeling decisions
- Query optimization
- Error handling patterns
- Performance tuning
- Security best practices

See the `instructions/` directory for Copilot customizations specific to e-commerce development.

## Contributing

See the main [Contributing Guide](../../CONTRIBUTING.md) for information on how to contribute to this sample.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.