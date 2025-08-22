# E-commerce Development with Azure Cosmos DB - Instructions

## Purpose
These instructions guide GitHub Copilot to provide expert assistance for building e-commerce applications with Azure Cosmos DB, focusing on best practices, optimal data modeling, and efficient querying patterns.

## Data Modeling Guidelines

### Container Design Patterns
- **Products Container**: Partition by category for efficient browsing and filtering
  - Use `/category` as partition key
  - Include composite indexes for category + price, category + name queries
  - Exclude large text fields like descriptions from indexing
  
- **Users Container**: Partition by user ID for data isolation and personalization
  - Use `/id` as partition key (user ID)
  - Store user profile, preferences, and addresses in single document
  
- **Orders Container**: Partition by user ID for efficient user-specific queries
  - Use `/userId` as partition key
  - Include order items as nested array for atomic transactions
  
- **Cart Container**: Partition by user ID for session management
  - Use `/userId` as partition key
  - Store cart items with product references and pricing snapshot

### Schema Design Best Practices
- Always include a `type` field to distinguish document types within containers
- Use meaningful, hierarchical IDs (e.g., `product-{uuid}`, `order-{uuid}`)
- Denormalize frequently accessed data to minimize cross-partition queries
- Store pricing snapshots in orders and carts to handle price changes
- Use arrays for tags, categories, and specifications for efficient querying

## Query Optimization Patterns

### Point Reads (Most Efficient)
```javascript
// Get specific product by ID and category
const product = await container.item(productId, category).read();
```

### Parameterized Queries (Recommended)
```javascript
// Search products with parameters to prevent SQL injection
const query = {
  query: "SELECT * FROM c WHERE c.category = @category AND c.price <= @maxPrice",
  parameters: [
    { name: "@category", value: "electronics" },
    { name: "@maxPrice", value: 1000 }
  ]
};
```

### Cross-Partition Queries (Use Sparingly)
```javascript
// Only for search functionality where necessary
const searchQuery = `
  SELECT * FROM c 
  WHERE CONTAINS(UPPER(c.name), UPPER(@searchTerm))
  ORDER BY c.rating DESC
  OFFSET @offset LIMIT @limit
`;
```

## Performance Optimization

### Connection Management
- Use singleton pattern for CosmosClient instances
- Configure connection pooling and request timeouts
- Implement retry logic for transient failures

### Indexing Strategy
- Use composite indexes for multi-field sorting and filtering
- Exclude large text fields from automatic indexing
- Create spatial indexes only if using geospatial queries

### Request Unit (RU) Optimization
- Monitor and log RU consumption for all queries
- Use continuation tokens for pagination instead of OFFSET/LIMIT
- Implement caching for frequently accessed, static data

## Error Handling Patterns

### Common Cosmos DB Error Codes
- 404: Document not found - handle gracefully in application
- 409: Conflict - document already exists, use upsert if appropriate
- 429: Rate limited - implement exponential backoff retry
- 413: Request too large - break into smaller operations

### Error Handling Implementation
```javascript
try {
  const result = await container.items.create(document);
} catch (error) {
  if (error.code === 409) {
    // Handle duplicate document
  } else if (error.code === 429) {
    // Implement retry with backoff
  } else {
    // Log and handle other errors
  }
}
```

## Security Best Practices

### Connection Security
- Use Azure Key Vault for storing connection strings
- Implement proper environment variable management
- Use managed identity when deploying to Azure

### Data Security
- Validate all input parameters in queries
- Use parameterized queries to prevent injection attacks
- Implement proper authentication and authorization
- Encrypt sensitive data at rest and in transit

## Scaling Considerations

### Partition Key Strategy
- Choose partition keys with high cardinality
- Ensure even distribution of requests across partitions
- Avoid hot partitions by analyzing query patterns

### Throughput Management
- Start with shared throughput at database level for development
- Move to dedicated throughput for high-traffic containers
- Use autoscale for unpredictable workloads

## Development Workflow

### Testing Strategies
- Use Cosmos DB Emulator for local development
- Create separate containers for different environments
- Implement comprehensive error handling tests
- Test with realistic data volumes

### Monitoring and Debugging
- Enable diagnostics logging for query analysis
- Monitor Request Units consumption and throttling
- Use Azure Monitor for performance insights
- Implement health checks for database connectivity

## Common E-commerce Patterns

### Shopping Cart Management
- Store cart items with product snapshots to handle price changes
- Implement cart abandonment cleanup with TTL
- Use optimistic concurrency for cart updates

### Inventory Management
- Implement atomic inventory updates using stored procedures
- Use change feed for real-time inventory synchronization
- Handle race conditions in high-concurrency scenarios

### Order Processing
- Store complete order information for audit trails
- Use batch operations for order line items
- Implement order status tracking with timestamps

When providing code suggestions:
1. Always include error handling and validation
2. Use TypeScript interfaces for strong typing
3. Implement proper logging for debugging
4. Consider performance implications of queries
5. Follow Azure Cosmos DB best practices
6. Include relevant comments explaining complex logic