# Product Catalog Management Prompts

## Create Product Schema
Create a comprehensive TypeScript interface for an e-commerce product that includes:
- Basic product information (name, description, price)
- Inventory management fields
- SEO and marketing fields
- Product variants (size, color, etc.)
- Customer review aggregation
- Optimized for Azure Cosmos DB storage

Parameters:
- Include pricing tiers: {{ pricing_model }} (simple/tiered/dynamic)
- Product type: {{ product_type }} (physical/digital/service)
- Variant complexity: {{ variant_complexity }} (simple/complex)

## Product Search Implementation
Generate an efficient product search service that:
- Searches across product name, description, and tags
- Filters by category, price range, and availability
- Implements relevance scoring
- Uses proper Azure Cosmos DB query patterns
- Includes pagination and sorting options

Parameters:
- Search index strategy: {{ index_strategy }} (basic/composite/external)
- Results per page: {{ page_size }}
- Sort options: {{ sort_fields }}

## Inventory Management System
Create an inventory management system that:
- Tracks stock levels in real-time
- Handles concurrent inventory updates safely
- Implements low stock alerts
- Manages product reservations for pending orders
- Uses Azure Cosmos DB change feed for synchronization

Parameters:
- Inventory tracking level: {{ tracking_level }} (simple/lot/serial)
- Reservation duration: {{ reservation_minutes }}
- Low stock threshold: {{ low_stock_threshold }}

## Product Recommendation Engine
Design a product recommendation system that:
- Uses customer purchase history
- Implements collaborative filtering
- Provides "frequently bought together" suggestions
- Optimizes for Azure Cosmos DB query patterns
- Includes A/B testing capabilities

Parameters:
- Recommendation algorithm: {{ algorithm }} (collaborative/content/hybrid)
- Number of recommendations: {{ recommendation_count }}
- Include cross-selling: {{ enable_cross_sell }} (true/false)