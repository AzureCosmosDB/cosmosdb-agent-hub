# Shopping Cart Management Prompts

## Shopping Cart Service Implementation
Create a comprehensive shopping cart service that:
- Manages cart items with real-time price updates
- Handles concurrent cart modifications safely
- Implements cart persistence across sessions
- Provides cart abandonment recovery features
- Optimizes for Azure Cosmos DB performance

Parameters:
- Cart persistence duration: {{ persistence_days }} days
- Enable guest checkout: {{ guest_checkout }} (true/false)
- Price update strategy: {{ price_strategy }} (real-time/snapshot/hybrid)

## Cart Item Management
Generate cart item management functionality that:
- Adds, updates, and removes items efficiently
- Validates product availability before adding
- Handles product price changes gracefully
- Implements quantity limits and bulk discounts
- Uses optimistic concurrency control

Parameters:
- Maximum items per cart: {{ max_items }}
- Quantity validation: {{ quantity_limits }} (per-item/total/none)
- Bulk discount threshold: {{ bulk_threshold }}

## Cart Abandonment Recovery
Design a cart abandonment recovery system that:
- Tracks cart abandonment events
- Sends personalized recovery emails
- Implements progressive discount strategies
- Uses Azure Cosmos DB change feed for triggers
- Includes analytics and conversion tracking

Parameters:
- Recovery email delays: {{ email_schedule }} (1h,24h,7d)
- Discount progression: {{ discount_progression }} (5%,10%,15%)
- Maximum recovery attempts: {{ max_attempts }}

## Multi-Channel Cart Synchronization
Create a system for synchronizing shopping carts across:
- Web browser sessions
- Mobile applications
- In-store kiosks
- Social commerce platforms
- Uses Azure Cosmos DB global distribution

Parameters:
- Synchronization method: {{ sync_method }} (real-time/eventual/manual)
- Conflict resolution: {{ conflict_resolution }} (last-write-wins/manual/merge)
- Offline capability: {{ offline_support }} (true/false)