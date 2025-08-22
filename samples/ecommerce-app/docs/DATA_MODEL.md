# Data Model Documentation

## Overview

This e-commerce application uses Azure Cosmos DB with a multi-container approach optimized for different access patterns and query requirements.

## Container Design

### Products Container
**Partition Key:** `/category`

**Purpose:** Store product catalog information with efficient category-based querying.

**Schema:**
```json
{
  "id": "product-{uuid}",
  "type": "product",
  "name": "Product Name",
  "description": "Detailed product description",
  "category": "electronics",
  "price": 99.99,
  "inventory": 50,
  "tags": ["wireless", "bluetooth", "audio"],
  "specifications": {
    "brand": "TechBrand",
    "model": "Model-123",
    "color": "black",
    "features": ["feature1", "feature2"]
  },
  "images": ["url1", "url2"],
  "rating": 4.5,
  "reviewCount": 128,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Indexing Strategy:**
- Composite indexes: `[category, price]`, `[category, name]`, `[category, rating]`
- Excluded paths: `/description/*`, `/specifications/*` (large text fields)
- Spatial indexes: None required

### Users Container
**Partition Key:** `/id`

**Purpose:** Store user accounts and profiles with user-specific data isolation.

**Schema:**
```json
{
  "id": "user-{uuid}",
  "type": "user",
  "email": "user@example.com",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01"
  },
  "addresses": [
    {
      "id": "addr-{uuid}",
      "type": "shipping",
      "isDefault": true,
      "street": "123 Main St",
      "city": "Seattle",
      "state": "WA",
      "zipCode": "98101",
      "country": "US"
    }
  ],
  "preferences": {
    "newsletter": true,
    "notifications": true,
    "currency": "USD",
    "language": "en"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLoginAt": "2024-01-01T00:00:00Z"
}
```

### Orders Container
**Partition Key:** `/userId`

**Purpose:** Store order information with efficient user-specific querying.

**Schema:**
```json
{
  "id": "order-{uuid}",
  "type": "order",
  "userId": "user-{uuid}",
  "status": "processing",
  "items": [
    {
      "productId": "product-{uuid}",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 2,
      "productSnapshot": {
        "category": "electronics",
        "image": "url"
      }
    }
  ],
  "pricing": {
    "subtotal": 199.98,
    "tax": 16.00,
    "shipping": 9.99,
    "discount": 0.00,
    "total": 225.97
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Seattle",
    "state": "WA",
    "zipCode": "98101",
    "country": "US"
  },
  "paymentMethod": {
    "type": "credit_card",
    "last4": "1234",
    "provider": "stripe"
  },
  "tracking": {
    "number": "TRK123456789",
    "carrier": "UPS",
    "estimatedDelivery": "2024-01-05T17:00:00Z"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "completedAt": null
}
```

### Cart Container
**Partition Key:** `/userId`

**Purpose:** Store shopping cart sessions with real-time updates.

**Schema:**
```json
{
  "id": "cart-{uuid}",
  "type": "cart",
  "userId": "user-{uuid}",
  "items": [
    {
      "productId": "product-{uuid}",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 1,
      "image": "url",
      "addedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 99.99,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "ttl": 2592000
}
```

## Query Patterns

### Product Queries

#### Browse by Category (Efficient - Uses Partition Key)
```sql
SELECT * FROM c 
WHERE c.category = "electronics" 
AND c.type = "product"
ORDER BY c.price ASC
```

#### Product Search (Cross-Partition)
```sql
SELECT *, 
  (CONTAINS(UPPER(c.name), UPPER(@searchTerm)) ? 3 : 0) +
  (CONTAINS(UPPER(c.description), UPPER(@searchTerm)) ? 1 : 0) as relevance
FROM c 
WHERE c.type = "product"
AND (CONTAINS(UPPER(c.name), UPPER(@searchTerm)) OR 
     CONTAINS(UPPER(c.description), UPPER(@searchTerm)))
ORDER BY relevance DESC, c.rating DESC
```

#### Point Read for Product Details
```sql
-- Most efficient when you know both ID and category
SELECT * FROM c WHERE c.id = @productId AND c.category = @category
```

### User-Specific Queries

#### User's Order History (Efficient - Uses Partition Key)
```sql
SELECT * FROM c 
WHERE c.userId = @userId 
AND c.type = "order"
ORDER BY c.createdAt DESC
```

#### User's Current Cart (Point Read)
```sql
SELECT * FROM c 
WHERE c.userId = @userId 
AND c.type = "cart"
```

## Performance Considerations

### Request Unit (RU) Optimization
- Point reads: ~1 RU
- Single-partition queries: 2-10 RUs
- Cross-partition queries: 10+ RUs
- Writes: 5-15 RUs depending on document size

### Indexing Best Practices
- Use composite indexes for multi-field sorting
- Exclude large text fields from automatic indexing
- Create covering indexes for frequently projected fields

### Partition Strategy Benefits
- **Products by category**: Enables efficient browsing and filtering
- **Orders/Cart by userId**: Provides data isolation and query efficiency
- **Even distribution**: Categories and users provide good distribution

## Data Consistency

### Eventual Consistency Scenarios
- Product inventory updates across regions
- User profile synchronization
- Order status updates

### Strong Consistency Requirements
- Cart operations within a session
- Order creation and payment processing
- Inventory allocation during checkout

## Scaling Considerations

### Throughput Allocation
- **Products**: High read throughput for browsing
- **Users**: Moderate throughput for authentication
- **Orders**: Moderate write throughput for checkout
- **Cart**: High write throughput for frequent updates

### Global Distribution
- **Products**: Replicate globally for fast browsing
- **Users**: Replicate to user's home region
- **Orders**: Store in processing region for compliance
- **Cart**: Replicate to active session regions