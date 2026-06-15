export const SYSTEM_ARCHITECTURE = `## System Architecture & Technical Flow

The application leverages a robust, multi-tier **Enterprise SaaS Architecture** designed for offline-first resilience, reliable mobile transactional synchronization, and real-time processing of high-volume Somali mobile payment services (EVC Plus, eDahab, Sahal).

### High-Level Topology
\`\`\`
[ Flutter Client (Android) ] <---> [ Cloudflare WAF / API Gateway ]
                                                |
                                                v
                                  [ Node.js/TypeScript App Nodes ]
                                    (Express, PM2, Docker Container)
                                          |           |
                     +--------------------+           +----------------------+
                     | (Write Operations)             | (Read-heavy Queries)  |
                     v                                v                      v
            [ Primary PostgreSQL ] <===========> [ Read Replicas ]     [ Redis Cache ]
          (Multi-AZ, SSL Encrypted)            (Horizontally Scaled)  (Session & Stock)
\`\`\`

1. **Client Tier**: A compiled Native Android App built with **Flutter (Dart)** using the **BLoC/Provider Pattern** for clean state segregation. Local transactions, customer debts, and product caching are persisted in an on-device secured SQLite database (**ObjectBox** or **Hive**) to handle low-bandwidth zones and local outages smoothly.
2. **Gateway & Load Balancing**: Fronted by a Reverse Proxy and API Gateway, handling HTTPS termination, rate-limitation (Express-rate-limit), CORS checks, and JWT authentication token decoding.
3. **Application Tier**: Horizontally auto-scaling Stateless **Web Middleware Microservices (Express/TypeScript)** executing sub-second transactional commits and emitting push alerts via **Firebase Cloud Messaging**.
4. **Database & Storage**: Powered by a **PostgreSQL Database Cluster** with automated transaction locking (isolation read-committed) to prevent racing conditions during inventory depletion checks. Memory caching is coordinated through **Redis** for hot stock keys.
5. **Mobile Money Gateway Services (Somali Payment Engine)**: Adapters translating REST callbacks to XML SOAP protocols or custom JSON gateways utilized by Hormuud (EVC Plus WebAPI), Telesom (Zaad / eDahab), and Edahab Somtel API.`;

export const POS_SCHEMA = `-- PostgreSQL Database Schema (SME Suite Somalia)
-- Target Version: PostgreSQL 15+
-- Created On: 2026-06-15

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESSES TABLE
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    sector VARCHAR(50) DEFAULT 'retail', -- pharmacy, grocery, restaurant, services
    owner_email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    currency VARCHAR(10) DEFAULT 'USD', -- Somali Shilling (SOS) and USD dual support
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE (Role-Based Access Control)
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'BUSINESS_OWNER', 'MANAGER', 'CASHIER', 'EMPLOYEE');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CASHIER',
    is_active BOOLEAN DEFAULT TRUE,
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_business_user_email UNIQUE (business_id, email)
);

-- 3. PRODUCT CATEGORIES
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS INDEXED FOR BARCODE & SKU
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    buying_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- in USD
    selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- in USD
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5, -- Low Stock Warning Level
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_business_sku UNIQUE (business_id, sku)
);

-- 5. STOCK HISTORY LOGS
CREATE TYPE stock_transaction_type AS ENUM ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'SALE_DEPLETION', 'SUPPLIER_RETURN');

CREATE TABLE stock_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    transaction_type stock_transaction_type NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SALES & MOBILE MONEY INTEGRATION
CREATE TYPE payment_gateway AS ENUM ('CASH', 'EVC_PLUS', 'EDAHAB', 'SAHAL', 'PREMIER_WALLET');
CREATE TYPE sale_status AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount NUMERIC(12, 2) NOT NULL, -- USD
    exchange_rate NUMERIC(10, 2) DEFAULT 26000.00, -- Exchange rate of USD to SOS
    payment_method payment_gateway NOT NULL DEFAULT 'CASH',
    mobile_money_number VARCHAR(30), -- E.g., +25261xxxxxxx for Hormuud EVC
    gateway_reference VARCHAR(150), -- APis/telecom operator API Ref
    status sale_status DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL, -- USD
    total_amount NUMERIC(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- 7. CUSTOMER DEBTS (SOMALI DHABA/DEBT TRADITIONS)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    total_outstanding_debt NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE debt_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES sales(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('BORROW', 'REPAY')),
    due_date DATE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EXPENSES
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- RENT, UTILITIES, SALARIES, MARKETING etc.
    amount NUMERIC(12, 2) NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SUPPLIERS
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    phone VARCHAR(30) NOT NULL,
    outstanding_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('PURCHASE', 'PAYMENT')),
    note VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SYSTEM AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_taken VARCHAR(100) NOT NULL, -- LOGIN, UPDATE_STOCK, DELETE_PRODUCT etc.
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SUBSCRIPTION & BILLING SYSTEMS
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'grace_period');

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
    status subscription_status NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_end TIMESTAMP WITH TIME ZONE NOT NULL, -- 3 Day extension grace window
    billing_interval_months INTEGER DEFAULT 1 CHECK (billing_interval_months BETWEEN 1 AND 24),
    total_amount_paid NUMERIC(12, 2) NOT NULL,
    transaction_id VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE billing_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL, -- Calculated pricing schema
    months_paid INTEGER NOT NULL,
    repayment_account VARCHAR(50) DEFAULT '38577675', -- Mandated direct checkout account
    transaction_id VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXING STRATEGY (Optimization for Android sync & superfast reports)
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_business_stock ON products(business_id, stock_quantity);
CREATE INDEX idx_sales_business_date ON sales(business_id, created_at DESC);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_debt_records_due_date ON debt_records(due_date) WHERE transaction_type = 'BORROW';
CREATE INDEX idx_stock_logs_product ON stock_logs(product_id);
CREATE INDEX idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX idx_billing_tx ON billing_history(transaction_id);
`;

export const ERD_MARKDOWN = `### Entity-Relationship Diagram (ERD) Textual Representation

\`\`\`
  [ BUSINESSES ]
       | (1)
       |
       +--- (N) ===> [ USERS (RBAC Control) ]
       |                   |
       | (1)               | (1, records action)
       |                   v
       +--- (N) ===> [ PRODUCTS ] <----- (1:N) ----- [ CATEGORIES ]
       |                   |
       |                   | (1:N)
       |                   v
       |             [ STOCK LOGS ]
       |
       +--- (N) ===> [ SUPPLIERS ] -- (1:N) --> [ SUPPLIER TRANSACTIONS ]
       |
       +--- (N) ===> [ EXPENSES ]
       |
       +--- (N) ===> [ CUSTOMERS ] -- (1:N) --> [ DEBT RECORDS (Borrow/Repay) ]
       |                                              ^ (0..1 references)
       |                                              |
       +--- (N) ===> [ SALES ] <======================+
                           |
                           | (1:N)
                           v
                     [ SALE ITEMS ]
\`\`\`

#### Relationship Cardinality:
- **Businesses (1) to Users (N)**: A business can have multiple operators with roles e.g. Super Admin, Business Owner, Manager, Cashier, Employee.
- **Businesses (1) to Products (N)**: Each SME item belongs to a specific business.
- **Categories (1) to Products (N)**: Products are classified into categories like "Supermarket", "Pharmacy", "Wholesale".
- **Sales (1) to Sale Items (N)**: Generates direct receipt items.
- **Customers (1) to Debt Records (N)**: Customer owes or pays back multiple times.
- **Sales (1) to Debt Records (0..1)**: A sale paid with debt ("Credit/Daba") generates an outstanding borrow record in debt registries.`;

export const BACKEND_SOURCE_CODE = `// ==========================================
// 1. server.ts (Express Backend Root)
// ==========================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import salesRoutes from './routes/sales.routes';
import debtRoutes from './routes/debt.routes';
import { handleErrors } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting to prevent denial of service (DoS) in Somalia's 3G network
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', limiter);

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/debts', debtRoutes);

// Centralized Error Handling Middleware
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(\`Somali SME Server running cleanly on port \${PORT}\`);
});


// ==========================================
// 2. controllers/sales.controller.ts
// ==========================================
import { Request, Response, NextFunction } from 'express';
import { db } from '../db'; // Drizzle or pg client config helper
import { sales, saleItems, products, customers, debtRecords } from '../db/schema';
import { eq } from 'drizzle-orm';

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  const client = await db.transaction(); // Execute inside transaction block
  try {
    const { cashierId, items, paymentMethod, mobileMoneyNumber, totalAmount, customerId } = req.body;

    // 1. Verify stock availability and deduct
    for (const item of items) {
      const parentProduct = await client.select().from(products).where(eq(products.id, item.productId));
      if (!parentProduct || parentProduct[0].stockQuantity < item.quantity) {
        throw new Error(\`Insufficient inventory for item: \${parentProduct[0]?.name || 'Unknown'}\`);
      }
      
      // Stock update
      await client.update(products)
        .set({ stockQuantity: parentProduct[0].stockQuantity - item.quantity, updatedAt: new Date() })
        .where(eq(products.id, item.productId));
    }

    // 2. Is this sale fully or partially credit-debt? (Somali tradition: Amaah)
    let paymentStatus = 'COMPLETED';
    if (paymentMethod === 'CASH' && customerId && totalAmount > 0) {
      // Is credit debt sale
    }

    // 3. Complete Mobile Money billing (mock push query EVC Plus/eDahab)
    let gatewayRef = 'MANUAL-' + Date.now();
    if (paymentMethod === 'EVC_PLUS' || paymentMethod === 'EDAHAB') {
      const response = await triggerSomaliTelecomPushGate(paymentMethod, mobileMoneyNumber, totalAmount);
      gatewayRef = response.transactionId;
    }

    // 4. Record main Sale
    const insertedSale = await client.insert(sales).values({
      cashierId,
      totalAmount,
      paymentMethod,
      mobileMoneyNumber,
      gatewayReference: gatewayRef,
      status: 'COMPLETED'
    }).returning();

    // 5. Populate relational items
    for (const item of items) {
      await client.insert(saleItems).values({
        saleId: insertedSale[0].id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      });
    }

    // 6. Record Customer Debt if partial or unpaid debt selected
    if (paymentMethod === 'CASH' && customerId) {
      // Add debt record and update outstanding customer balance
      await client.insert(debtRecords).values({
        customerId,
        saleId: insertedSale[0].id,
        amount: totalAmount,
        transactionType: 'BORROW',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days default
      });

      const currentCust = await client.select().from(customers).where(eq(customers.id, customerId));
      await client.update(customers)
        .set({ totalOutstandingDebt: Number(currentCust[0].totalOutstandingDebt) + Number(totalAmount) })
        .where(eq(customers.id, customerId));
    }

    await client.commit();
    res.status(201).json({ success: true, saleId: insertedSale[0].id, gatewayRef });
  } catch (err) {
    await client.rollback();
    next(err);
  }
};

// Mock Telecom push billing engine integration logic
async function triggerSomaliTelecomPushGate(gateway: string, number: string, amount: number) {
  // Production integration uses hormones/telesom SOAP or JSON gateways
  // e.g. EVC Plus expects API_URL: https://api.hormuud.com/merchant/payment
  return {
    success: true,
    transactionId: 'TXN-SOM-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    message: 'Mobile payment successfully cleared.'
  };
}


// ==========================================
// 3. controllers/billing.controller.ts (SaaS Renewal & Subscription)
// ==========================================
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { subscriptions, billingHistory } from '../db/schema';
import { eq } from 'drizzle-orm';

export const renewSubscription = async (req: Request, res: Response, next: NextFunction) => {
  const client = await db.transaction();
  try {
    const { business_id, months_to_renew, transaction_id } = req.body;

    if (!business_id || !months_to_renew || !transaction_id) {
      return res.status(400).json({ error: 'Fadlan ku dar dhammaan xogta loo baahan yahay: business_id, months_to_renew, iyo transaction_id' });
    }

    const months = parseInt(months_to_renew, 10);
    if (isNaN(months) || months < 1 || months > 24) {
      return res.status(400).json({ error: 'Ugu yaraan waa 1 bil, ugu badnaanna waa 2 sano / 24 bilood.' });
    }

    // Pricing & Discount Calculations
    // Official price: $20/month
    // For 24 months (2 years): 5% Discount
    let totalCost = 0;
    if (months === 24) {
      totalCost = (20 * 24) * 0.95; // $456 (saving $24)
    } else {
      totalCost = 20 * months;
    }

    // Verification of EVC Plus/eDahab Merchant transfer
    // Mandated merchant registration account to inspect: 38577675
    const isVerifiedTransaction = await verifyTelecomTransactionId(transaction_id, totalCost, "38577675");
    if (!isVerifiedTransaction) {
       return res.status(400).json({ error: 'KHALAD TRANS-ID: Caddeynta wareejinta lagu guulaysan waayay. Hubi inaad lacagta u dirtay teleefanka rasmiga ah oo ah: 38577675' });
    }

    // Upsert subscription
    const existingSub = await client.select().from(subscriptions).where(eq(subscriptions.business_id, business_id));
    
    let baseDate = new Date();
    if (existingSub.length > 0 && new Date(existingSub[0].endDate).getTime() > Date.now()) {
      baseDate = new Date(existingSub[0].endDate);
    }

    const newEndDate = new Date(baseDate.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    const gracePeriodEnd = new Date(newEndDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days grace window

    let targetSubscriptionId = "";
    if (existingSub.length > 0) {
      targetSubscriptionId = existingSub[0].id;
      await client.update(subscriptions)
        .set({
          status: 'active',
          endDate: newEndDate,
          gracePeriodEnd,
          billingIntervalMonths: months,
          totalAmountPaid: totalCost,
          transactionId: transaction_id,
          updatedAt: new Date()
        })
        .where(eq(subscriptions.business_id, business_id));
    } else {
      const inserted = await client.insert(subscriptions).values({
        business_id,
        status: 'active',
        endDate: newEndDate,
        gracePeriodEnd,
        billingIntervalMonths: months,
        totalAmountPaid: totalCost,
        transactionId: transaction_id
      }).returning();
      targetSubscriptionId = inserted[0].id;
    }

    // Insert billing log history
    await client.insert(billingHistory).values({
      subscriptionId: targetSubscriptionId,
      businessId: business_id,
      amount: totalCost,
      monthsPaid: months,
      repaymentAccount: '38577675', // Force account payment
      transactionId: transaction_id
    });

    await client.commit();
    res.json({
      success: true,
      message: 'App-ka waa lagu guulaystay in loo cusboonaysiiyo ' + months + ' bilood!',
      billingIntervalMonths: months,
      amountPaid: totalCost,
      expiryDate: newEndDate
    });

  } catch (err) {
    await client.rollback();
    next(err);
  }
};

async function verifyTelecomTransactionId(txId: string, expectedAmount: number, merchantAccount: string): Promise<boolean> {
  // Real gateway queries Hormuud EVC Plus API to verify actual deposit to Merchant: 38577675
  return txId && txId.trim().length > 4; // Mock validation check pass
}
`;

export const FLUTTER_SOURCE_CODE = `// ==========================================
// 1. main.dart (Somali SME App Root)
// ==========================================
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:somali_sme/providers/auth_provider.dart';
import 'package:somali_sme/providers/inventory_provider.dart';
import 'package:somali_sme/views/login_view.dart';
import 'package:somali_sme/views/dashboard_view.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => InventoryProvider()),
      ],
      child: const KaafiSMEApp(),
    ),
  );
}

class KaafiSMEApp extends StatelessWidget {
  const KaafiSMEApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kaafi Somali SME Suite',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        fontFamily: 'Inter',
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.teal,
      ),
      themeMode: ThemeMode.system, // Auto toggle Light/Dark Mode
      home: const LoginSelector(),
    );
  }
}

class LoginSelector extends StatelessWidget {
  const LoginSelector({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    return auth.isAuthenticated ? const DashboardView() : const LoginView();
  }
}


// ==========================================
// 2. models/product_model.dart
// ==========================================
class Product {
  final String id;
  final String name;
  final String sku;
  final String category;
  final double buyingPrice;
  final double sellingPrice;
  final int stockQuantity;
  final int minStockLevel;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.category,
    required this.buyingPrice,
    required this.sellingPrice,
    required this.stockQuantity,
    required this.minStockLevel,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      sku: json['sku'],
      category: json['category'],
      buyingPrice: (json['buying_price'] as num).toDouble(),
      sellingPrice: (json['selling_price'] as num).toDouble(),
      stockQuantity: json['stock_quantity'],
      minStockLevel: json['min_stock_level'] ?? 5,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'sku': sku,
    'buying_price': buyingPrice,
    'selling_price': sellingPrice,
    'stock_quantity': stockQuantity,
    'min_stock_level': minStockLevel,
  };
}


// ==========================================
// 3. widgets/merchant_pos_card.dart (Cashier POS)
// ==========================================
import 'package:flutter/material.dart';
import '../models/product_model.dart';

class PosItemRow extends StatelessWidget {
  final Product product;
  final int quantityAdded;
  final VoidCallback onAdd;
  final VoidCallback onRemove;

  const PosItemRow({
    Key? key,
    required this.product,
    required this.quantityAdded,
    required this.onAdd,
    required this.onRemove,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isLowStock = product.stockQuantity <= product.minStockLevel;
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text('Stock: \${product.stockQuantity} ', 
                        style: TextStyle(color: isLowStock ? Colors.red : Colors.grey[600]),
                      ),
                      if (isLowStock) 
                        const Icon(Icons.warning, color: Colors.red, size: 14),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Price: \$\${product.sellingPrice.toStringAsFixed(2)} / SOS \${(product.sellingPrice * 26000).toStringAsFixed(0)}',
                    style: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
            Row(
              children: [
                IconButton(
                  onPressed: onRemove,
                  icon: const Icon(Icons.remove_circle_outline, color: Colors.orange),
                ),
                Text(
                  '$quantityAdded',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                IconButton(
                  onPressed: product.stockQuantity > quantityAdded ? onAdd : null,
                  icon: const Icon(Icons.add_circle_outline, color: Colors.teal),
                ),
              ],
            )
          ],
    );
  }
}


// ==========================================
// 4. interceptors/subscription_interceptor.dart (App-Lock Handler)
// ==========================================
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../views/app_lock_billing_view.dart';
import '../main.dart'; // To access global navigator state if needed

class SubscriptionInterceptor extends Interceptor {
  final GlobalKey<NavigatorState> navigatorKey;

  SubscriptionInterceptor({required this.navigatorKey});

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (response.data != null && response.data['error'] == 'SUBSCRIPTION_EXPIRED') {
      _triggerAppLock();
    }
    super.onResponse(response, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 403 || err.response?.data?['error'] == 'SUBSCRIPTION_EXPIRED') {
      _triggerAppLock();
    }
    super.onError(err, handler);
  }

  void _triggerAppLock() {
    // Force redirect to locked billing viewport screen
    navigatorKey.currentState?.pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const AppLockBillingView()),
      (Route<dynamic> route) => false,
    );
  }
}


// ==========================================
// 5. views/app_lock_billing_view.dart (Selection UI & Slider)
// ==========================================
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

class AppLockBillingView extends StatefulWidget {
  const AppLockBillingView({Key? key}) : super(key: key);

  @override
  State<AppLockBillingView> createState() => _AppLockBillingViewState();
}

class _AppLockBillingViewState extends State<AppLockBillingView> {
  double _monthsToRenew = 1.0; // Slider range 1.0 to 24.0
  final TextEditingController _transactionController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  String? _successMessage;

  // Pricing Rule Engine variables
  final double _pricePerMonth = 20.0;
  final String _merchantAccount = "38577675"; // Mandated Direct Payment Target

  double get _calculatedTotal {
    int m = _monthsToRenew.round();
    if (m == 24) {
      return (20.0 * 24) * 0.95; // 5% Discount: $456
    }
    return 20.0 * m;
  }

  Future<void> _submitRenewal() async {
    final txId = _transactionController.text.trim();
    if (txId.isEmpty) {
      setState(() => _errorMessage = "Fadlan geli Transaction ID Wareejinta!");
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final dio = Dio();
      final response = await dio.post(
        "https://api.kaafisme.so/api/v1/billing/renew",
        data: {
          "business_id": "kaafi_shop_01",
          "months_to_renew": _monthsToRenew.round(),
          "transaction_id": txId
        },
      );

      if (response.data['success'] == true) {
        setState(() {
          _successMessage = "App-kaaga waa la furay! Taariikhda dhicitaanka cusub: \${response.data['expiryDate']}";
        });
        // Reload main app core after 2 seconds
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.of(context).pushReplacementNamed('/dashboard');
        });
      } else {
        setState(() => _errorMessage = response.data['error'] ?? "Khalad ayaa dhacay oo aan la aqoon.");
      }
    } catch (e) {
      setState(() => _errorMessage = "Xariirka server-ka waa uu katay: \${e.toString()}");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    int currentMonths = _monthsToRenew.round();
    bool isDiscountEligible = currentMonths == 24;

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Slate-900 Dark lock screen theme
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Card(
              color: const Color(0xFF1E293B), // Slate-800
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
              elevation: 8,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Icon(Icons.lock_person_rounded, size: 60, color: Colors.amber),
                    const SizedBox(height: 16),
                    const Text(
                      "KAAFI APP LOCK SYSTEM",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.extrabold, fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "Muddadii tijaabada ama rukumanka codsiga wuu ka dhacay dukaankaaga. Fadlan dib-u-cusboonaysii.",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                    ),
                    const SizedBox(height: 24),
                    
                    // Month Slider
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text("Muddada cusboonaysiinta:", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text("\$currentMonths Bilood", style: const TextStyle(color: Colors.tealAccent, fontWeight: FontWeight.bold, fontSize: 14)),
                      ],
                    ),
                    Slider(
                      value: _monthsToRenew,
                      min: 1.0,
                      max: 24.0,
                      divisions: 23,
                      activeColor: Colors.teal,
                      inactiveColor: Colors.slate-700,
                      label: "\${_monthsToRenew.round()} M",
                      onChanged: (val) {
                        setState(() => _monthsToRenew = val);
                      },
                    ),
                    
                    // Notice
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Xisaabinta Qiimaha (Pricing):",
                            style: TextStyle(color: Colors.tealAccent, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "• Qiimaha caadiga ah: \$20/bishii\\n"
                            "• Ugu yaraan waa 1 bil, ugu badnaanna waa 2 sano (24 bilood).\\n"
                            "• Haddii aad 2 sano doorato waxaad helaysaa 5% Dhimis!",
                            style: TextStyle(color: Colors.grey[400], fontSize: 10, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Dynamic Price Indicator Box
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDiscountEligible ? Colors.teal.withOpacity(0.1) : Colors.amber.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: isDiscountEligible ? Colors.teal : Colors.amber.withOpacity(0.3)),
                      ),
                      child: Column(
                        children: [
                          Text(
                            _calculatedTotal == 456.0 ? "Hada Hel 5% Dhimis Rukunka 2 Sano!" : "Qiimaha rasmiga ah ee Is-diiwaangelinta",
                            style: TextStyle(
                              color: isDiscountEligible ? Colors.tealAccent : Colors.amberAccent, 
                              fontWeight: FontWeight.bold, 
                              fontSize: 10
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "\$\${_calculatedTotal.toStringAsFixed(0)} USD",
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.black, fontSize: 24),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Mandated Merchant Instructions
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.redAccent.withOpacity(0.1),
                        border: Border.all(color: Colors.redAccent.withOpacity(0.4)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          const Text(
                            "TALAABADA QASABKA AH (EVC Plus/eDahab):",
                            style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            "U soo wareeji lacagta rasmiga ah directly Account-ka hoose:",
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white, fontSize: 10),
                          ),
                          const SizedBox(height: 4),
                          SelectableText(
                            "*712*$_merchantAccount*\${_calculatedTotal.toInt()}#",
                            style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'monospace'),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            "Account-ka rasmiga ah: 38577675",
                            style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    // Transaction ID Form
                    TextField(
                      controller: _transactionController,
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                      decoration: const InputDecoration(
                        labelText: "Transaction ID (Wareejinta EVC / eDahab)",
                        labelStyle: TextStyle(color: Colors.grey, fontSize: 12),
                        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.slate-600)),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.teal)),
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    if (_errorMessage != null)
                      Text(_errorMessage!, style: const TextStyle(color: Colors.redAccent, fontSize: 11), textAlign: TextAlign.center),
                    if (_successMessage != null)
                      Text(_successMessage!, style: const TextStyle(color: Colors.tealAccent, fontSize: 11), textAlign: TextAlign.center),
                    
                    const SizedBox(height: 12),
                    
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal,
                        padding: const EdgeInsets.all(16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _isLoading ? null : _submitRenewal,
                      child: _isLoading 
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text("Cusboonaysii App-ka", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
`;

export const REST_API_DOCUMENTATION = `## SME Automation REST API Specification
**Base URL**: \`https://api.kaafiSME.so/api/v1\`

| Endpoint | HTTP Method | Auth Required | Description |
|---|---|---|---|
| \`POST /auth/register\` | POST | None | Onboard a new business store and sets Super Admin primary role. |
| \`POST /auth/login\` | POST | None | Verify phone & password, returns JWT token. |
| \`POST /auth/otp/request\`| POST | None | Dispatch SMS OTP verification for reset credentials (EVC Gateway SMS). |
| \`POST /auth/otp/verify\` | POST | None | Complete password refresh if OTP match succeeds. |
| \`GET /products\` | GET | JWT Required | Returns cached full inventory list with search strings. |
| \`POST /products\` | POST | JWT (Admin/Mgr)| Inserts a new product with SKU automatic generator systems. |
| \`PATCH /products/:id\` | PATCH | JWT (Admin/Mgr)| Edit details, update images or critical min stock level indicators. |
| \`POST /sales\` | POST | JWT (Cashier+) | Submits items, decrements stock, triggers EVC/eDahab API. |
| \`GET /reports/profit-loss\`| GET| JWT (Owner Only)| Returns financial income statement matching target dates. |
| \`GET /debts/outstanding\`| GET | JWT (Manager+) | List customer debts matching repayment deadlines. |
| \`POST /debts/repay\` | POST | JWT (Cashier+) | Records repayment from debt ledger. |

### Sample POS Transaction payload (\`POST /sales\`):
\`\`\`json
{
  "cashierId": "3b2c6a1e-8d5f-4aef-b001-ebcc33ea0123",
  "paymentMethod": "EVC_PLUS",
  "mobileMoneyNumber": "252615432321",
  "totalAmount": 12.50,
  "items": [
    {
      "productId": "p1",
      "quantity": 2,
      "price": 6.25
    }
  ]
}
\`\`\`
### Sample Response:
\`\`\`json
{
  "success": true,
  "saleId": "88ff912a-3001-447a-8bd1-ccfe99fa12bc",
  "gatewayReference": "TXN-SOM-KAAFI-L91X6",
  "status": "COMPLETED"
}
\`\`\`
`;

export const DOCKER_CONFIGURATION = `### Multi-Stage Production Docker Setup

#### \`Dockerfile\` (Backend & Web Panel Hosting)
\`\`\`dockerfile
# Stage 1: Build the client assets
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Setup the production runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets and backend bundle
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/server.cjs ./server.cjs

EXPOSE 3000
CMD ["node", "server.cjs"]
\`\`\`

#### \`docker-compose.yml\` (Production Stack)
\`\`\`yaml
version: '3.8'

services:
  sme-suite-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      - DATABASE_URL=postgresql://kaafi_admin:SomaliaSafe2026@sme-postgres:5432/somali_sme_db?sslmode=require
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - JWT_SECRET=\${JWT_SECRET}
    depends_on:
      - sme-postgres
    restart: always

  sme-postgres:
    image: postgres:15-alpine
    container_name: sme_postgres_db
    environment:
      - POSTGRES_USER=kaafi_admin
      - POSTGRES_PASSWORD=SomaliaSafe2026
      - POSTGRES_DB=somali_sme_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
    driver: local
\`\`\`
`;

export const PRODUCTION_GUIDE = `## Production Setup & Deployment Guide

This guide details steps required to securely scale and deploy the **Kaafi Somali SME Suite** in a robust cloud environment (AWS EC2, DigitalOcean, or Azure) using standard best practices.

### 1. Prerequisite Environment Configuration
Before launching, configure your production shell or CI/CD secrets variables:
- \`GEMINI_API_KEY\`: For AI Intelligence Consultations
- \`JWT_SECRET\`: Supersecure string key to lock active merchant authentications
- \`DATABASE_URL\`: SSL-backed PostgreSQL Connection String

### 2. Manual Server Setup (Ubuntu 22.04 LTS)
Secure your virtual machine and install basic dependencies:
\`\`\`bash
# Update and upgrade security patches
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# Clone your secure codebase configuration
git clone https://github.com/somali-sme/sme-management.git
cd sme-management

# Spin up entire microservice containers
docker-compose up -d --build
\`\`\`

### 3. Nginx Reverse Proxy & Let's Encrypt SSL
Place Nginx on the host system to route connections securely via 443 with automated SSL certificate renewal.

\`\`\`nginx
# /etc/nginx/sites-available/kaafi.so
server {
    listen 80;
    server_name api.kaafi.so panel.kaafi.so;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name api.kaafi.so panel.kaafi.so;

    ssl_certificate /etc/letsencrypt/live/kaafi.so/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kaafi.so/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

Obtain certificates:
\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.kaafi.so -d panel.kaafi.so --agree-tos --email ops@kaafi.so
\`\`\`

### 4. Database Optimization & Auto-Backups
Add a nightly automated cron job on your cloud engine to sync database states into encrypted cold objects bucket (AWS S3):
\`\`\`cron
0 2 * * * pg_dump -U kaafi_admin somali_sme_db | gzip > /backups/db_\$(date +%F).sql.gz && aws s3 cp /backups s3://kaafi-db-backups/ --recursive
\`\`\`
`;
