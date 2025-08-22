# Order Processing Workflow Prompts

## Order Management System
Create a comprehensive order management system that:
- Handles the complete order lifecycle from creation to fulfillment
- Integrates with payment processing services
- Manages inventory allocation and reservation
- Implements order status tracking and notifications
- Uses Azure Cosmos DB for transactional consistency

Parameters:
- Payment provider: {{ payment_provider }} (stripe/paypal/adyen)
- Order status workflow: {{ status_workflow }} (simple/complex/custom)
- Inventory allocation: {{ allocation_strategy }} (immediate/payment/shipment)

## Payment Processing Integration
Generate payment processing functionality that:
- Securely handles multiple payment methods
- Implements 3D Secure authentication
- Manages payment retries and failures
- Stores payment audit trails safely
- Complies with PCI DSS requirements

Parameters:
- Supported payment methods: {{ payment_methods }}
- Retry policy: {{ retry_policy }} (immediate/delayed/manual)
- Fraud detection: {{ fraud_detection }} (basic/advanced/ml)

## Order Status Tracking
Design an order tracking system that:
- Provides real-time order status updates
- Integrates with shipping carriers
- Sends automated customer notifications
- Implements estimated delivery calculations
- Uses Azure Cosmos DB change feed for status updates

Parameters:
- Shipping carriers: {{ carriers }} (fedex/ups/usps/dhl)
- Notification channels: {{ notifications }} (email/sms/push)
- Tracking granularity: {{ granularity }} (order/item/shipment)

## Return and Refund Management
Create a return management system that:
- Handles return authorization requests
- Automates refund processing
- Manages return inventory and restocking
- Implements return policy validation
- Tracks return analytics and trends

Parameters:
- Return window: {{ return_days }} days
- Refund processing: {{ refund_speed }} (immediate/processed/manual)
- Restocking policy: {{ restocking }} (automatic/inspect/manual)

## Order Analytics and Reporting
Generate order analytics functionality that:
- Tracks key order metrics and KPIs
- Provides sales performance insights
- Implements cohort analysis for customers
- Uses Azure Cosmos DB analytical workloads
- Creates executive dashboards and reports

Parameters:
- Analytics retention: {{ retention_period }} months
- Report frequency: {{ report_schedule }} (real-time/daily/weekly)
- Dashboard complexity: {{ dashboard_type }} (basic/advanced/executive)