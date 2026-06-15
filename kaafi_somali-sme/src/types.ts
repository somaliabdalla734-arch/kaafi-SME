export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  BUSINESS_OWNER = "BUSINESS_OWNER",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  EMPLOYEE = "EMPLOYEE"
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  purchasePrice: number; // in USD
  sellingPrice: number;  // in USD
  stock: number;
  minStock: number;      // Low stock limit
  imageUrl?: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // in USD
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number; // in USD
  paymentMethod: "EVC_PLUS" | "EDAHAB" | "SAHAL" | "PREMIER_WALLET" | "CASH" | "SOMNET";
  mobileMoneyNumber?: string;
  timestamp: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  receivedAmount: number;
}

export interface CustomerDebt {
  id: string;
  name: string;
  phone: string;
  debtAmount: number; // in USD
  dueDate: string;
  history: {
    id: string;
    amount: number;
    type: "BORROW" | "REPAY";
    date: string;
    note: string;
  }[];
}

export interface Expense {
  id: string;
  description: string;
  category: "RENT" | "SALARIES" | "LICENSES" | "UTILITIES" | "MARKETING" | "LOGISTICS" | "OTHER";
  amount: number; // in USD
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  dueBalance: number; // in USD
  history: {
    id: string;
    amount: number;
    type: "PURCHASE" | "PAYMENT";
    date: string;
    note?: string;
  }[];
}

export interface Subscription {
  id: string;
  businessId: string;
  status: "active" | "expired" | "grace_period";
  startDate: string;
  endDate: string;
  gracePeriodEnd: string;
  billingIntervalMonths: number;
  totalAmountPaid: number;
  transactionId: string;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  businessId: string;
  amount: number;
  monthsPaid: number;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

