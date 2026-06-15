import React, { useState, useEffect } from "react";
import { 
  BarChart3, ShoppingCart, DollarSign, Package, Users, Truck, FileText, 
  Trash2, Plus, Minus, Search, Smartphone, Languages, 
  Check, Phone, CheckCircle2, RefreshCw, Layers, Sparkles, Bell, 
  Clock, CreditCard, ChevronRight, Download, FileSpreadsheet, Printer, X, Filter,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkle, FileCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole, Product, Sale, CustomerDebt, Expense, Supplier } from "./types";
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_EXPENSES, 
  PRESEEDED_SALES 
} from "./data/mockData";
import { SECTORS_CONFIG, BusinessSector } from "./data/sectorsData";
import AIAssistant from "./components/AIAssistant";
import BlueprintsHub from "./components/BlueprintsHub";
import BillingSubSec from "./components/BillingSubSec";
import AuthWall from "./components/AuthWall";
import SMESectionGuide from "./components/SMESectionGuide";

// Somali Language Dictionary mapping
const TRANSLATIONS = {
  en: {
    title: "Kaafi Somali SME Suite",
    subtitle: "Enterprise POS, Inventory, Debts, & Business Automation Client",
    todaySales: "Today's Sales",
    weeklySales: "Weekly Sales",
    monthlySales: "Monthly Gross Sales",
    expenses: "Monthly Expenses",
    profit: "Net Profit Margin",
    inventoryValue: "Inventory Asset Value",
    outstandingDebts: "Active Customer Debts",
    lowStockAlerts: "Critical Low Stock Core",
    roleSelector: "Selected Operational Role",
    lanSelector: "Language",
    currencySelector: "Currency",
    dashboardTab: "Dashboard",
    posTab: "Checkout POS",
    inventoryTab: "Inventory Hub",
    debtsTab: "Debts (Amaah)",
    expensesTab: "Expenses",
    suppliersTab: "Suppliers",
    blueprintsTab: "System Specifications",
    assistantTab: "Kaafi AI Advisor",
    billingTab: "SaaS Billing System",
    productName: "Product Name",
    sku: "SKU",
    barcode: "Barcode Support",
    category: "Category",
    stock: "Stock Quantity",
    price: "Selling Price",
    actions: "Actions",
    search: "Search product...",
    addProduct: "Add New Product",
    customerName: "Customer Name",
    dueDate: "Due Date Tracking",
    totalOutstanding: "Debt Amount",
    supplierName: "Supplier Name",
    dueBalanceSupplier: "Due to Supplier",
    exchangeRateNotice: "Exchange Rate: 1 USD = 26,000 SOS",
    currencyMode: "Dual Render Mode",
    receiptTitle: "Somali SME Official Receipt",
    receiptSub: "Bakaara Market Branch, Mogadishu",
    checkoutSuccess: "Payment approved with Telekom operator!",
    lowStockBadge: "Low Stock Alert",
    restockSuccess: "Restock recorded successfully!",
    saleConfirmMsg: "Do you confirm initiating USSD push request on the mobile system?",
    loginHeading: "Onboard or Login to SME Suite",
    loginDesc: "Log in with your existing account credentials, or register a new account to instantly receive a 2-day free trial.",
    loginTab: "Sign In",
    registerTab: "Join & Register",
    businessIdInput: "Business Shop ID (Short keyword)",
    businessNameInput: "Business / Shop Name",
    phoneInput: "Workspace Phone Number",
    passwordInput: "Secure Account Passcode",
    registerAlert: "Successful signup! You have unlocked your 2 days free access.",
  },
  so: {
    title: "Kaafi Somali SME Suite",
    subtitle: "Maareynta Bakhaarka, POS, Deymaha, iyo Caawiyaha Sirdoonka",
    todaySales: "Iibka Maanta",
    weeklySales: "Iibka Todobaadkan",
    monthlySales: "Iibka Guud ee bishan",
    expenses: "Kharashka Baxay bishan",
    profit: "Faa'iidada saafiga ah",
    inventoryValue: "Qiimaha Hantida Bakhaarka",
    outstandingDebts: "Deymaha Macaamiisha",
    lowStockAlerts: "Alaabta ka dhiman Bakhaarka",
    roleSelector: "Doorka Shaqaalaha",
    lanSelector: "Luqadda",
    currencySelector: "Lacagta",
    dashboardTab: "Warbixinta Guud",
    posTab: "Iibinta (POS)",
    inventoryTab: "Bakhaarka Alaabta",
    debtsTab: "Deymaha (Amaah)",
    expensesTab: "Kharashyada",
    suppliersTab: "Ganacsatada Na siisa",
    blueprintsTab: "Caddaymaha Nidaamka",
    assistantTab: "La-taliyaha AI Assistant",
    billingTab: "Maamulka Biilasha (SaaS)",
    productName: "Magaca Alaabta",
    sku: "Sumadda Alaabta",
    barcode: "Sumadda Barcode",
    category: "Qaybta",
    stock: "Tirada Bakhaarka",
    price: "Qiimaha Iibka",
    actions: "Ficilada",
    search: "Raadi alaab...",
    addProduct: "Ku dar Alaab Cusub",
    customerName: "Magaca Macamiilka",
    dueDate: "Taariikhda Bixinta",
    totalOutstanding: "Lacagta deynta ah",
    supplierName: "Magaca Shirkadda",
    dueBalanceSupplier: "Deynta nagu leh",
    exchangeRateNotice: "Sarifka Rasmiga: 1 USD = 26,000 SOS",
    currencyMode: "Muujinta Laba Lacagood",
    receiptTitle: "Warqada rasmiga ah ee iibka",
    receiptSub: "Laanta Suuqa Bakaaraha, Muqdisho",
    checkoutSuccess: "Biilka waa laga aqbalay shirkadda isgaarsiinta!",
    lowStockBadge: "Alaabtu wey dhimantahay",
    restockSuccess: "Alaab dheeri ah waa la diiwaan galiyay!",
    saleConfirmMsg: "Ma hubtaa inaad rabto inaad u dirto fariin USSD push ah taleefanka macaamiilka?",
    loginHeading: "Soo gal ama Diiwaan geli dukaanka",
    loginDesc: "Ku soo gal magaca iyo ereygan sirta ah ee dukaankaaga, ama is-diiwaangeli hadda si aad u hesho 2 Maalmood oo tijaabo Bilaash ah (Free Trial) durbadiiba.",
    loginTab: "Soo Gal",
    registerTab: "Diiwaan-geli Dukaan Cusub",
    businessIdInput: "ID-ga Dukaanka (Sida: kaafi_shop)",
    businessNameInput: "Magaca Rasmiga ah ee Ganacsiga",
    phoneInput: "Lambarka Teleefanka Dukaanka",
    passwordInput: "Ereyga Sirta ah (Password)",
    registerAlert: "Diiwaangelintu wey guulaysatay! Waxaad heshay 2 maalmood oo tijaabo bilaash ah.",
  }
};

export default function App() {
  // Application Configurations
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "so">("so"); // Default to Somali
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.BUSINESS_OWNER); // Default to Owner
  const [currencySymbol, setCurrencySymbol] = useState<"USD" | "SOS">("USD"); // Standard default
  const [currentTab, setCurrentTab] = useState<"dashboard" | "pos" | "inventory" | "debts" | "expenses" | "suppliers" | "blueprints" | "assistant" | "billing">("dashboard");
  const [deviceFrameMode, setDeviceFrameMode] = useState<"desktop" | "mobile">("desktop"); // Allow Mobile smartphone view

  // Dynamic user logged session and SaaS trial metrics
  const [currentUser, setCurrentUser] = useState<{ businessId: string; businessName: string; phone: string; password?: string } | null>(() => {
    const saved = localStorage.getItem("kaafi_sme_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Password-lock states for role select gates (Cashiir v Owner/Manager)
  const [roleToUnlock, setRoleToUnlock] = useState<UserRole | null>(null);
  const [roleUnlockPassword, setRoleUnlockPassword] = useState("");
  const [roleUnlockError, setRoleUnlockError] = useState("");

  // Helper helper to load business-specific state
  const loadBusinessState = <T,>(key: string, mockBackup: T): T => {
    const savedUser = localStorage.getItem("kaafi_sme_user");
    if (!savedUser) return [] as any;
    try {
      const userObj = JSON.parse(savedUser);
      const bId = userObj.businessId;
      const stored = localStorage.getItem(`kaafi_sme_${bId}_${key}`);
      if (stored) {
        return JSON.parse(stored);
      }
      return bId === "kaafi_shop_01" ? mockBackup : ([] as any);
    } catch (e) {
      return [] as any;
    }
  };

  const [subStatus, setSubStatus] = useState<{
    businessId: string;
    status: "active" | "expired" | "grace_period";
    startDate: string;
    endDate: string;
    gracePeriodEnd: string;
    billingIntervalMonths: number;
    totalAmountPaid: number;
    transactionId?: string;
  } | null>(null);

  const [subLoading, setSubLoading] = useState<boolean>(false);

  // Auto query subscription status
  useEffect(() => {
    if (!currentUser) return;
    const fetchStatus = async () => {
      try {
        setSubLoading(true);
        const res = await fetch(`/api/v1/billing/status/${currentUser.businessId}`);
        if (res.ok) {
          const data = await res.json();
          setSubStatus(data);
        }
      } catch (err) {
        console.error("Error query subscription:", err);
      } finally {
        setSubLoading(false);
      }
    };
    fetchStatus();
  }, [currentUser]);

  // Expired sub redirect force
  useEffect(() => {
    if (subStatus?.status === "expired" && currentTab !== "billing") {
      setCurrentTab("billing");
    }
  }, [subStatus, currentTab]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("kaafi_sme_user");
    setCurrentUser(null);
    setSubStatus(null);
  };

  // Application Dynamic States
  const [currentSector, setCurrentSector] = useState<BusinessSector>(() => {
    const savedUser = localStorage.getItem("kaafi_sme_user");
    if (!savedUser) return "market";
    try {
      const userObj = JSON.parse(savedUser);
      const bId = userObj.businessId;
      const stored = localStorage.getItem(`kaafi_sme_${bId}_currentSector`);
      if (stored) {
        return JSON.parse(stored) as BusinessSector;
      }
    } catch (e) {}
    return "market";
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const savedUser = localStorage.getItem("kaafi_sme_user");
    if (!savedUser) return SECTORS_CONFIG.market.products;
    try {
      const userObj = JSON.parse(savedUser);
      const bId = userObj.businessId;
      const stored = localStorage.getItem(`kaafi_sme_${bId}_products`);
      if (stored) {
        return JSON.parse(stored);
      }
      
      const secStored = localStorage.getItem(`kaafi_sme_${bId}_currentSector`);
      const sec = secStored ? (JSON.parse(secStored) as BusinessSector) : "market";
      return SECTORS_CONFIG[sec]?.products || SECTORS_CONFIG.market.products;
    } catch (e) {
      return SECTORS_CONFIG.market.products;
    }
  });

  const [customers, setCustomers] = useState<CustomerDebt[]>(() => loadBusinessState("customers", INITIAL_CUSTOMERS));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadBusinessState("suppliers", INITIAL_SUPPLIERS));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadBusinessState("expenses", INITIAL_EXPENSES));
  const [sales, setSales] = useState<Sale[]>(() => loadBusinessState("sales", PRESEEDED_SALES));

  const [categories, setCategories] = useState<string[]>(() => {
    const savedUser = localStorage.getItem("kaafi_sme_user");
    if (!savedUser) return SECTORS_CONFIG.market.categories;
    try {
      const userObj = JSON.parse(savedUser);
      const bId = userObj.businessId;
      const stored = localStorage.getItem(`kaafi_sme_${bId}_categories`);
      if (stored) {
        return JSON.parse(stored);
      }
      
      const secStored = localStorage.getItem(`kaafi_sme_${bId}_currentSector`);
      const sec = secStored ? (JSON.parse(secStored) as BusinessSector) : "market";
      return SECTORS_CONFIG[sec]?.categories || SECTORS_CONFIG.market.categories;
    } catch (e) {
      return SECTORS_CONFIG.market.categories;
    }
  });

  // Method to shift active business sector templates instantly
  const switchBusinessSector = (sectorId: BusinessSector) => {
    const config = SECTORS_CONFIG[sectorId];
    if (!config) return;
    
    setCurrentSector(sectorId);
    setCategories(config.categories);
    setProducts(config.products);
    setPosCart({}); // flush checkout basket to protect category schema
    
    if (currentUser) {
      localStorage.setItem(`kaafi_sme_${currentUser.businessId}_currentSector`, JSON.stringify(sectorId));
      localStorage.setItem(`kaafi_sme_${currentUser.businessId}_categories`, JSON.stringify(config.categories));
      localStorage.setItem(`kaafi_sme_${currentUser.businessId}_products`, JSON.stringify(config.products));
    }
  };

  // Auto sync on user switch or load
  useEffect(() => {
    if (!currentUser) return;
    const bId = currentUser.businessId;
    const isMock = bId === "kaafi_shop_01";
    
    const getStored = (key: string, backup: any) => {
      const stored = localStorage.getItem(`kaafi_sme_${bId}_${key}`);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) { return isMock ? backup : []; }
      }
      return isMock ? backup : [];
    };

    let loadedSector: BusinessSector = "market";
    const secStored = localStorage.getItem(`kaafi_sme_${bId}_currentSector`);
    if (secStored) {
      try { loadedSector = JSON.parse(secStored) as BusinessSector; } catch (e) {}
    }
    setCurrentSector(loadedSector);

    const defaultProducts = SECTORS_CONFIG[loadedSector]?.products || SECTORS_CONFIG.market.products;
    const defaultCategories = SECTORS_CONFIG[loadedSector]?.categories || SECTORS_CONFIG.market.categories;

    setProducts(getStored("products", defaultProducts));
    setCategories(getStored("categories", defaultCategories));
    setCustomers(getStored("customers", INITIAL_CUSTOMERS));
    setSuppliers(getStored("suppliers", INITIAL_SUPPLIERS));
    setExpenses(getStored("expenses", INITIAL_EXPENSES));
    setSales(getStored("sales", PRESEEDED_SALES));
  }, [currentUser]);

  // Persist states to local storage on changes
  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_currentSector`, JSON.stringify(currentSector));
  }, [currentSector, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_products`, JSON.stringify(products));
  }, [products, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_categories`, JSON.stringify(categories));
  }, [categories, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_customers`, JSON.stringify(customers));
  }, [customers, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_suppliers`, JSON.stringify(suppliers));
  }, [suppliers, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_expenses`, JSON.stringify(expenses));
  }, [expenses, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(`kaafi_sme_${currentUser.businessId}_sales`, JSON.stringify(sales));
  }, [sales, currentUser]);

  // Cashier tab locking redirect (only POS and Assistant)
  useEffect(() => {
    if (selectedRole === UserRole.CASHIER) {
      const allowedTabsForCashier = ["pos", "assistant"];
      if (!allowedTabsForCashier.includes(currentTab)) {
        setCurrentTab("pos");
      }
    }
  }, [selectedRole, currentTab]);

  // Request secure switch to other roles (passcode-gate for OWNER/MANAGER)
  const requestRoleSwitch = (r: UserRole) => {
    if (r === UserRole.CASHIER) {
      setSelectedRole(UserRole.CASHIER);
      setCurrentTab("pos");
      return;
    }
    // OWNER or MANAGER, trigger secure passcode modal popup
    setRoleToUnlock(r);
    setRoleUnlockPassword("");
    setRoleUnlockError("");
  };

  const handleVerifyRolePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleUnlockError("");
    
    // Retrieve actual correct password from the logged session user
    const correctPassword = currentUser?.password || "123"; 
    
    if (roleUnlockPassword === correctPassword) {
      if (roleToUnlock) {
        setSelectedRole(roleToUnlock);
      }
      setRoleToUnlock(null);
      setRoleUnlockPassword("");
    } else {
      setRoleUnlockError(
        currentLanguage === "so"
          ? "EREYGA SIRTA AH (PASSWORD) WAA KHALAD! Iska hubi."
          : "INCORRECT PASSCODE! Only the boss is permitted to bypass."
      );
    }
  };

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Modals view controllers
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<Sale | null>(null);
  
  // Quick price change and immediate sale transitions
  const [priceEditingProduct, setPriceEditingProduct] = useState<Product | null>(null);
  const [newEditPrice, setNewEditPrice] = useState<string>("");

  // New item form buffers
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: INITIAL_CATEGORIES[0],
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 10,
    minStock: 5,
    barcode: ""
  });

  const [newCustomerDebt, setNewCustomerDebt] = useState({
    name: "",
    phone: "",
    amount: 0,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    note: ""
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    category: "UTILITIES" as any,
    amount: 0
  });

  // POS Checkout variables
  const [posCart, setPosCart] = useState<{ [id: string]: number }>({});
  const [paymentOption, setPaymentOption] = useState<"CASH" | "EVC_PLUS" | "EDAHAB" | "SAHAL" | "SOMNET" | "PREMIER_WALLET">("EVC_PLUS");
  const [payPhoneNumber, setPayPhoneNumber] = useState(() => {
    try {
      const saved = localStorage.getItem("kaafi_sme_user");
      if (saved) {
        const u = JSON.parse(saved);
        const rawPhone = u.phone || "615551122";
        return rawPhone.trim().replace(/^0+/, "");
      }
    } catch(e) {}
    return "615551122";
  });

  useEffect(() => {
    if (currentUser?.phone) {
      setPayPhoneNumber(currentUser.phone.trim().replace(/^0+/, ""));
    }
  }, [currentUser]);

  const [posDebtCustomerId, setPosDebtCustomerId] = useState("");
  const [checkoutSimulating, setCheckoutSimulating] = useState(false);
  const [evcUSSDMessage, setEvcUSSDMessage] = useState<string | null>(null);

  // Real-time server unified QR integration states
  const [activeTxId, setActiveTxId] = useState<string | null>(null);
  const [activeTxStatus, setActiveTxStatus] = useState<"pending" | "paid" | null>(null);

  // Customer-facing mobile portal intercept states
  const payTxId = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("payTx");
  const [customerPayTxData, setCustomerPayTxData] = useState<any>(null);
  const [customerPayStatus, setCustomerPayStatus] = useState<"pending" | "paid" | "error" | "loading">("loading");

  // Cashier polling for real-time QR payments
  useEffect(() => {
    if (!activeTxId) return;
    let isMounted = true;
    
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/v1/payments/status/${activeTxId}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.status === "paid" && activeTxStatus !== "paid") {
            setActiveTxStatus("paid");
            // Auto complete payment and transition
            setTimeout(() => {
              if (isMounted) {
                completePOSCheckout(null);
                setActiveTxId(null);
                setActiveTxStatus(null);
                setEvcUSSDMessage(null);
              }
            }, 1800);
          }
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    };

    const interval = setInterval(checkStatus, 1200);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeTxId, activeTxStatus]);

  // Customer portal polling / state sync
  useEffect(() => {
    if (!payTxId) return;
    const fetchCustomerInvoice = async () => {
      try {
        const res = await fetch(`/api/v1/payments/status/${payTxId}`);
        if (res.ok) {
          const data = await res.json();
          setCustomerPayTxData(data);
          setCustomerPayStatus(data.status);
        } else {
          setCustomerPayStatus("error");
        }
      } catch (err) {
        setCustomerPayStatus("error");
      }
    };
    fetchCustomerInvoice();
    const interval = setInterval(fetchCustomerInvoice, 2000);
    return () => clearInterval(interval);
  }, [payTxId]);

  const handleCustomerConfirmPayment = async () => {
    if (!payTxId) return;
    try {
      setCustomerPayStatus("loading");
      const res = await fetch("/api/v1/payments/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: payTxId })
      });
      if (res.ok) {
        setCustomerPayStatus("paid");
        if (customerPayTxData) {
          setCustomerPayTxData({ ...customerPayTxData, status: "paid" });
        }
      } else {
        alert("Waa uu guuldareystay xaqiijinta.");
        setCustomerPayStatus("pending");
      }
    } catch (err) {
      alert("Xariirka server-ka waa uu go'ay.");
      setCustomerPayStatus("pending");
    }
  };

  // Notification Banner State
  const [notifications, setNotifications] = useState<string[]>([]);

  // Trigger Low Stock warning notifications on load or whenever stock changes
  useEffect(() => {
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    const alerts: string[] = [];
    if (lowStockItems.length > 0) {
      lowStockItems.forEach(p => {
        alerts.push(
          currentLanguage === "so"
            ? `QAYLO DHAAN: Alaabta '${p.name}' way dhimantahay! Waxaa haray kaliya ${p.stock} xabbo (Hantida yoolku waa ${p.minStock}).`
            : `LOW STOCK ALERT: '${p.name}' is near exhaustion! Remaining: ${p.stock} units (Minimum bound: ${p.minStock}).`
        );
      });
    }
    // Check if any debts are due soon (overdue or due in 3 days)
    const today = new Date();
    customers.forEach(c => {
      if (c.debtAmount > 0 && c.dueDate) {
        const due = new Date(c.dueDate);
        const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          alerts.push(
            currentLanguage === "so"
              ? `MUDDO DHAAF: Macmiilka '${c.name}' waxaa laga rabaa $${c.debtAmount} oo lasoo dhaafay mudadii bixinta!`
              : `OVERDUE DEBT: Customer '${c.name}' owes $${c.debtAmount} which passed repayment due date!`
          );
        } else if (diffDays <= 3) {
          alerts.push(
            currentLanguage === "so"
              ? `XASUUSIN DEYN: Macmiilka '${c.name}' waxaa la rabaa inuu bixiyo $${c.debtAmount} muddo 3 maalmood gudahood ah!`
              : `DEBT NOTICE: Customer '${c.name}' is scheduled to return $${c.debtAmount} within 3 days!`
          );
        }
      }
    });
    setNotifications(alerts);
  }, [products, customers, currentLanguage]);

  // Currency Converter Helpers
  const formatMoney = (amountUsd: number) => {
    if (currencySymbol === "USD") {
      return `$${amountUsd.toFixed(2)}`;
    } else {
      const sosAmount = amountUsd * 26000;
      return `SOS ${sosAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.BUSINESS_OWNER:
        return { canEditStock: true, canDeleteItems: true, canViewFinances: true, desc: "Full ownership of system database and financial margin calculations." };
      case UserRole.MANAGER:
        return { canEditStock: true, canDeleteItems: false, canViewFinances: true, desc: "Can manage products, check supplier backlogs, and record stock-in levels." };
      case UserRole.CASHIER:
        return { canEditStock: false, canDeleteItems: false, canViewFinances: false, desc: "Restricted to POS checkout and printing customer receipts." };
      case UserRole.EMPLOYEE:
        return { canEditStock: false, canDeleteItems: false, canViewFinances: false, desc: "Read-only access to verify low stock indicators." };
    }
  };

  const currentPerms = getRolePermissions(selectedRole);

  // Dynamic Dashboard Stats Calculations
  const getDashboardStats = () => {
    const todayDateStr = new Date().toISOString().split("T")[0]; // "2026-06-15" (matching mock date)
    
    // Total gross sales of all history
    const grossHistoricalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    
    // Today's Sales
    const todaySales = sales
      .filter(s => s.timestamp.startsWith("2026-06-15") || s.timestamp.startsWith("2026-06-14T15")) // matching simulated date range
      .reduce((sum, s) => sum + s.totalAmount, 0);

    // Monthly gross expenses
    const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Business net position calculation
    const netProfit = grossHistoricalSales - monthlyExpenses;

    // Total cost/valuation of the products currently sitting in stock
    const inventoryValuation = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);

    // Outstanding customer debts
    const customerDebts = customers.reduce((sum, c) => sum + c.debtAmount, 0);

    // Count products experiencing low stock bounds
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    return {
      todaySales,
      weeklySales: grossHistoricalSales + 120, // preseeded factor
      monthlySales: grossHistoricalSales + 680,
      expenses: monthlyExpenses,
      profit: netProfit,
      inventoryValuation,
      customerDebts,
      lowStockCount
    };
  };

  const stats = getDashboardStats();

  // POS CART ACTIONS
  const addToCart = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    const currentQty = posCart[productId] || 0;
    if (p.stock > currentQty) {
      setPosCart(prev => ({
        ...prev,
        [productId]: currentQty + 1
      }));
    }
  };

  const removeFromCart = (productId: string) => {
    const currentQty = posCart[productId] || 0;
    if (currentQty <= 1) {
      const copy = { ...posCart };
      delete copy[productId];
      setPosCart(copy);
    } else {
      setPosCart(prev => ({
        ...prev,
        [productId]: currentQty - 1
      }));
    }
  };

  const getCartTotal = () => {
    return Object.entries(posCart).reduce((sum, [id, qty]) => {
      const p = products.find(prod => prod.id === id);
      return sum + (p ? p.sellingPrice * (qty as number) : 0);
    }, 0);
  };

  // Transaction checkout processing
  const handlePOSCheckout = () => {
    const total = getCartTotal();
    if (total <= 0) return;

    if (paymentOption !== "CASH" && !payPhoneNumber.trim()) {
      alert(currentLanguage === "so" ? "Fadlan gali lambarka Taleefanka wareejinta!" : "Please enter your mobile payout phone number!");
      return;
    }

    setCheckoutSimulating(true);
    setActiveTxStatus(null);
    setActiveTxId(null);

    if (paymentOption === "CASH") {
      // Complete cash sale instantly
      setTimeout(() => {
        completePOSCheckout(null);
      }, 1200);
    } else {
      // Register custom payment invoice on backend server to synchronize physical scan with cashier
      const merchantPhone = currentUser?.phone || "0615551122";
      const merchantName = currentUser?.businessName || "Kaafi SME Store";
      
      fetch("/api/v1/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, merchantPhone, merchantName })
      })
      .then((res) => res.json())
      .then((data) => {
        const providerName = 
          paymentOption === "EVC_PLUS" ? "EVC Plus (Hormuud)" :
          paymentOption === "EDAHAB" ? "eDahab (Somtel)" :
          paymentOption === "SAHAL" ? "Sahal (Golis)" :
          paymentOption === "SOMNET" ? "Somnet (Jeeb)" :
          paymentOption === "PREMIER_WALLET" ? "Premier Wallet" : "Mobile Money";

        if (data.success) {
          setActiveTxId(data.txId);
          setActiveTxStatus("pending");
          
          setEvcUSSDMessage(
            currentLanguage === "so"
              ? `[ USSD SIMULATION - ${providerName} ]\nMa hubtaa inaad lacag dhan $${total.toFixed(2)} (${formatMoney(total)}) u wareejiso Bakhaarka ${merchantName}?\n\nGali PIN-kaaga si aad u ogolaato.`
              : `[ USSD SIMULATION - ${providerName} ]\nConfirm paying $${total.toFixed(2)} (${formatMoney(total)}) to ${merchantName}?\n\nEnter telecom Secret PIN to authorize.`
          );
        } else {
          // Fallback to offline simulation if network warning
          setEvcUSSDMessage(
            currentLanguage === "so"
              ? `[ USSD SIMULATION - ${providerName} ]\nMa hubtaa inaad lacag dhan $${total.toFixed(2)} (${formatMoney(total)}) u wareejiso Bakhaarka ${merchantName}?\n\nGali PIN-kaaga si aad u ogolaato.`
              : `[ USSD SIMULATION - ${providerName} ]\nConfirm paying $${total.toFixed(2)} (${formatMoney(total)}) to ${merchantName}?\n\nEnter telecom Secret PIN to authorize.`
          );
        }
      })
      .catch((err) => {
        console.error("QR create err", err);
        const providerName = 
          paymentOption === "EVC_PLUS" ? "EVC Plus (Hormuud)" :
          paymentOption === "EDAHAB" ? "eDahab (Somtel)" :
          paymentOption === "SAHAL" ? "Sahal (Golis)" :
          paymentOption === "SOMNET" ? "Somnet (Jeeb)" :
          paymentOption === "PREMIER_WALLET" ? "Premier Wallet" : "Mobile Money";
        setEvcUSSDMessage(
          currentLanguage === "so"
            ? `[ USSD SIMULATION - ${providerName} ]\nMa hubtaa inaad lacag dhan $${total.toFixed(2)} (${formatMoney(total)}) u wareejiso Bakhaarka ${merchantName}?\n\nGali PIN-kaaga si aad u ogolaato.`
            : `[ USSD SIMULATION - ${providerName} ]\nConfirm paying $${total.toFixed(2)} (${formatMoney(total)}) to ${merchantName}?\n\nEnter telecom Secret PIN to authorize.`
        );
      });
    }
  };

  const completePOSCheckout = (authPin: string | null) => {
    setEvcUSSDMessage(null);
    
    // Assemble Sale log
    const total = getCartTotal();
    const invoiceItems = Object.entries(posCart).map(([id, quantity]) => {
      const p = products.find(prod => prod.id === id)!;
      return {
        productId: id,
        name: p.name,
        quantity: quantity as number,
        price: p.sellingPrice
      };
    });

    const newSale: Sale = {
      id: "sale_" + Date.now(),
      items: invoiceItems,
      totalAmount: total,
      paymentMethod: paymentOption,
      mobileMoneyNumber: paymentOption !== "CASH" ? payPhoneNumber : undefined,
      timestamp: new Date().toISOString(),
      status: "COMPLETED",
      receivedAmount: total
    };

    // Deduct stock levels in state
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (posCart[p.id]) {
          return {
            ...p,
            ...({ stock: Math.max(0, p.stock - posCart[p.id]) })
          };
        }
        return p;
      });
    });

    // If payment method is CASH and customer credit option selected, record debt
    if (paymentOption === "CASH" && posDebtCustomerId) {
      setCustomers(currentCusts => {
        return currentCusts.map(c => {
          if (c.id === posDebtCustomerId) {
            return {
              ...c,
              debtAmount: c.debtAmount + total,
              history: [
                ...c.history,
                { id: "dh_" + Date.now(), amount: total, type: "BORROW", date: new Date().toISOString().split("T")[0], note: "POS Debt Purchase for shopping" }
              ]
            } as CustomerDebt;
          }
          return c;
        });
      });
    }

    setSales(prev => [newSale, ...prev]);
    setPosCart({});
    setPosDebtCustomerId("");
    setCheckoutSimulating(false);
    setShowReceiptModal(newSale); // Display ticket summary immediately!
  };

  // INVENTORY OPERATIONS
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.sellingPrice === 0) return;

    // Generate unique Somali barcode and SKU standard prefix
    const generatedSku = `KFI-${newProduct.category.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const randomBarcode = `61512345${Math.floor(1000 + Math.random() * 9000)}`;

    const freshProd: Product = {
      id: "p_" + Date.now(),
      name: newProduct.name,
      sku: generatedSku,
      barcode: newProduct.barcode || randomBarcode,
      category: newProduct.category,
      purchasePrice: Number(newProduct.purchasePrice),
      sellingPrice: Number(newProduct.sellingPrice),
      stock: Number(newProduct.stock),
      minStock: Number(newProduct.minStock),
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d296e?w=150&auto=format&fit=crop&q=60" // standard product logo
    };

    setProducts(prev => [freshProd, ...prev]);
    setShowAddProductModal(false);
    setNewProduct({
      name: "",
      category: INITIAL_CATEGORIES[0],
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 10,
      minStock: 5,
      barcode: ""
    });
  };

  // Record Stock Restocking Operations (Stock in / Stock out manual adjustment)
  const handleStockAdjustment = (prodId: string, quantityShift: number) => {
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        if (p.id === prodId) {
          return {
            ...p,
            stock: Math.max(0, p.stock + quantityShift)
          };
        }
        return p;
      });
    });
  };

  // Quick direct price edit followed by immediate redirection to the Point Of Sale
  const handleQuickPriceChangeAndSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceEditingProduct) return;

    const parsedPrice = parseFloat(newEditPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert(
        currentLanguage === "so"
          ? "FAADLAN GELI QIIMO SAX AH OO KA WEYN 0!"
          : "PLEASE ENTER A VALID PRICE GREATER THAN 0!"
      );
      return;
    }

    // Update the custom drug retail selling price inside list
    setProducts((prev) => {
      return prev.map((p) => {
        if (p.id === priceEditingProduct.id) {
          return { ...p, sellingPrice: parsedPrice };
        }
        return p;
      });
    });

    // Automatically queue 1 count into Point of Sale Checkout baskets
    setPosCart((prev) => {
      const updated = { ...prev };
      updated[priceEditingProduct.id] = Math.max(1, (prev[priceEditingProduct.id] || 0) + 1);
      return updated;
    });

    // Enter name in search bar prefix for instant highlight verification
    setSearchQuery(priceEditingProduct.name);

    // Redirect to POS checkouts
    setCurrentTab("pos");

    // Close model buffers
    setPriceEditingProduct(null);
    setNewEditPrice("");

    // Output success notification
    alert(
      currentLanguage === "so"
        ? `QIIMAHA DAAWADA "${priceEditingProduct.name}" WAA LA BEDELAY! Toos ayaa lagugu geeyay qaybta iibta.`
        : `UPDATED DRUG PRICE "${priceEditingProduct.name}" TO ${formatMoney(parsedPrice)}! Redirected to checkout screen.`
    );
  };

  // DEBT OPERATIONS
  const handleAddCustomerDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerDebt.name || newCustomerDebt.amount === 0) return;

    const newCust: CustomerDebt = {
      id: "c_" + Date.now(),
      name: newCustomerDebt.name,
      phone: newCustomerDebt.phone || "0615xxxxxx",
      debtAmount: Number(newCustomerDebt.amount),
      dueDate: newCustomerDebt.dueDate,
      history: [
        {
          id: "dh_i_" + Date.now(),
          amount: Number(newCustomerDebt.amount),
          type: "BORROW",
          date: new Date().toISOString().split("T")[0],
          note: newCustomerDebt.note || "Historical debt integration"
        }
      ]
    };

    setCustomers(prev => [...prev, newCust]);
    setShowAddDebtModal(false);
    setNewCustomerDebt({
      name: "",
      phone: "",
      amount: 0,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      note: ""
    });
  };

  const handleRecordRepayment = (customerId: string, amountToRepay: number) => {
    if (amountToRepay <= 0) return;
    setCustomers(prevCusts => {
      return prevCusts.map(c => {
        if (c.id === customerId) {
          const actualRepay = Math.min(amountToRepay, c.debtAmount);
          return {
            ...c,
            debtAmount: c.debtAmount - actualRepay,
            history: [
              ...c.history,
              {
                id: "dh_r_" + Date.now(),
                amount: actualRepay,
                type: "REPAY" as const,
                date: new Date().toISOString().split("T")[0],
                note: "Mobile payment compensation recorded"
              }
            ]
          };
        }
        return c;
      });
    });
  };

  // EXPENSE OPERATIONS
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || newExpense.amount <= 0) return;

    const record: Expense = {
      id: "e_" + Date.now(),
      description: newExpense.description,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      date: new Date().toISOString().split("T")[0]
    };

    setExpenses(prev => [record, ...prev]);
    setShowAddExpenseModal(false);
    setNewExpense({
      description: "",
      category: "UTILITIES",
      amount: 0
    });
  };

  // Supplier Payouts
  const handleSupplierPayout = (supplierId: string, amount: number) => {
    setSuppliers(prev => {
      return prev.map(s => {
        if (s.id === supplierId) {
          const applied = Math.min(amount, s.dueBalance);
          return {
            ...s,
            dueBalance: s.dueBalance - applied,
            history: [
              ...s.history,
              {
                id: "sh_p_" + Date.now(),
                amount: applied,
                type: "PAYMENT" as const,
                date: new Date().toISOString().split("T")[0],
                note: "Telecom transaction completed"
              }
            ]
          };
        }
        return s;
      });
    });
  };

  // Export tables simulated files triggers
  const handleExportData = (type: "pdf" | "excel") => {
    alert(
      currentLanguage === "so"
        ? `Faylkaaga [KAAFI_SME_REPORT.${type.toUpperCase()}] waa lagu guulaystay in la diyaariyo lana soo dejiyo!`
        : `Your document [KAAFI_SME_REPORT.${type.toUpperCase()}] has been compiled and downloaded successfully!`
    );
  };

  // Render a responsive, visually striking Sector Catalog Switcher that auto-populates products
  const renderSectorCatalogSwitcher = () => (
    <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/60 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-teal-400 uppercase font-black">
              {currentLanguage === "so" ? "Qaybta Isticmaalka (Seeraar)" : "Instant Sector Auto-Preseeds"}
            </span>
            <span className="text-[10px] bg-teal-500/15 border border-teal-500/30 text-teal-300 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
              {currentLanguage === "so" ? "KAAFI AUTO-LOAD" : "ACTIVE CONFIGURATION"}
            </span>
          </div>
          <h4 className="text-sm font-black font-display tracking-tight text-white uppercase">
            {currentLanguage === "so" ? "DOORO NOOCA GANACSIGA (ALAAABTA TOOS AH)" : "CHOOSE YOUR BUSINESS SECTOR (AUTO-POPULATE PRODUCTS)"}
          </h4>
          <p className="text-[11px] text-teal-100/70 leading-relaxed max-w-2xl">
            {currentLanguage === "so"
              ? "Macaamiishu ma rabaan inay mid-mid u galiyaan alaabta. Dooro qaybta hoose si xogta alaabta, caanaha, baastada, dambaylada, daawooyinka ama qaxwada si toos ah ugu dhex shubmanto POS-KA iyo bakhaarka."
              : "Avoid slow manual input! Activate any sector blueprint to automatically preseed the catalog with highly-localized items, prices, SKUs and barcodes."}
          </p>
        </div>

        {/* Buttons List */}
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {(Object.keys(SECTORS_CONFIG) as BusinessSector[]).map((secKey) => {
            const sec = SECTORS_CONFIG[secKey];
            const isActive = currentSector === secKey;
            return (
              <button
                key={secKey}
                onClick={() => {
                  switchBusinessSector(secKey);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black font-mono transition-all flex items-center justify-center gap-2 border cursor-pointer select-none grow sm:grow-0 ${
                  isActive
                    ? "bg-amber-400 border-amber-500 text-slate-950 shadow-lg ring-4 ring-amber-400/20 scale-[1.03]"
                    : "bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className="text-base shrink-0">{sec.emoji}</span>
                <span className="truncate">
                  {currentLanguage === "so" ? sec.nameSo.split("(")[0].trim() : sec.nameEn.split("&")[0].trim()}
                </span>
                {isActive && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Filter products by search prefix or category choice
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode.includes(searchQuery);
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!currentUser) {
    return (
      <AuthWall
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        onLoginSuccess={(user, subscription) => {
          localStorage.setItem("kaafi_sme_user", JSON.stringify(user));
          setCurrentUser(user);
          setSubStatus(subscription);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col antialiased ${deviceFrameMode === "mobile" ? "py-6 items-center" : ""}`}>
      
      {/* Viewport Frame Switcher Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 w-full flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-600 to-indigo-600 p-2.5 rounded-xl text-white font-display font-bold text-lg flex items-center gap-1.5 shadow-md">
            <span className="text-white text-base">KAAFI</span>
            <Layers className="w-5 h-5 text-amber-300 animate-spin animate-duration-3000" />
          </div>
          <div>
            <h1 className="text-slate-800 font-extrabold text-sm sm:text-base tracking-tight font-display flex flex-wrap items-center gap-1.5">
              {TRANSLATIONS[currentLanguage].title}
              <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold">Somalia SME</span>
              {currentUser && (
                <span className="bg-indigo-100 text-indigo-850 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                  🏬 {currentUser.businessName} ({currentUser.businessId})
                </span>
              )}
              {subStatus && (
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-sans font-black uppercase tracking-wider transition ${
                  subStatus.status === "active" ? "bg-emerald-100 text-emerald-800" :
                  subStatus.status === "grace_period" ? "bg-amber-100 text-amber-800" :
                  "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                }`}>
                  🎫 {subStatus.status === "active" ? (currentLanguage === "so" ? "KAAFI AQBALAY (TRIAL)" : "ACTIVE MODULE") : subStatus.status === "grace_period" ? (currentLanguage === "so" ? "MUDDO GAABAN" : "GRACE WINDOW") : (currentLanguage === "so" ? "WUU DHACAY (LOCKED)" : "EXPIRED STATE")}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-slate-550 font-sans hidden sm:block">{TRANSLATIONS[currentLanguage].subtitle}</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3.5 mt-2 sm:mt-0">
          
          {/* Dual currency indicator banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-slate-600 text-[11px] flex items-center gap-1.5 font-mono">
            <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin animate-duration-5000" />
            <span>{TRANSLATIONS[currentLanguage].exchangeRateNotice}</span>
          </div>

          {/* Lang toggle */}
          <button
            onClick={() => setCurrentLanguage(prev => prev === "en" ? "so" : "en")}
            className="bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-slate-700 transition-all font-semibold font-sans cursor-pointer focus:outline-none"
          >
            <Languages className="w-4 h-4 text-teal-600" />
            <span>{currentLanguage === "en" ? "Somali (SO)" : "English (EN)"}</span>
          </button>

          {/* Currency Toggle */}
          <button
            onClick={() => setCurrencySymbol(prev => prev === "USD" ? "SOS" : "USD")}
            className="bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 text-slate-700 transition-all font-semibold font-mono cursor-pointer focus:outline-none"
          >
            <span>💰 {currencySymbol === "USD" ? "SOS Mode" : "USD Mode"}</span>
          </button>

          {/* Presentation bezel switcher */}
          <button
            onClick={() => setDeviceFrameMode(prev => prev === "desktop" ? "mobile" : "desktop")}
            className="bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 text-slate-700 transition-all font-sans cursor-pointer focus:outline-none"
          >
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">{deviceFrameMode === "desktop" ? "Mobile Bezel Mode" : "Desktop Wide Mode"}</span>
          </button>

          {/* Log Out option */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="bg-rose-50 border border-rose-200 hover:border-rose-450 hover:bg-rose-100 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 text-rose-700 transition-all font-bold font-sans cursor-pointer focus:outline-none shadow-sm"
            >
              🚪 <span>{currentLanguage === "so" ? "Ka Bax" : "Log Out"}</span>
            </button>
          )}

        </div>
      </div>

      {/* Main Framework container */}
      <div className={`w-full ${deviceFrameMode === "desktop" ? "flex-1 max-w-full flex" : "w-[390px] h-[820px] rounded-[42px] border-[12px] border-slate-900 bg-white overflow-hidden shadow-2xl relative flex flex-col mt-4"}`}>
        
        {/* APP BODY NAVIGATOR FRAME FOR BOTH DESKTOP AND MOBILE */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
          
          {/* Active alerts panel */}
          {notifications.length > 0 && currentTab === "dashboard" && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 shrink-0 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              <span className="bg-amber-600 text-white rounded px-1.5 py-0.5 text-[9px] font-bold font-sans tracking-wider animate-pulse uppercase">Notification Core</span>
              <div className="flex gap-4 text-xs text-amber-800 font-sans font-medium">
                {notifications.slice(0, 3).map((note, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* User role setup dashboard ribbon */}
          <div className="bg-indigo-950 text-white px-6 py-3 shrink-0 flex flex-wrap justify-between items-center gap-2 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-indigo-200 font-mono tracking-wider">{TRANSLATIONS[currentLanguage].roleSelector}:</span>
              <div className="flex items-center gap-1 bg-indigo-900/90 border border-indigo-700 rounded-lg p-0.5">
                {[UserRole.BUSINESS_OWNER, UserRole.MANAGER, UserRole.CASHIER].map((r) => {
                  const label = r === UserRole.BUSINESS_OWNER ? (currentLanguage === "so" ? "👔 Owner (Boss)" : "👔 Boss (Owner)") :
                                r === UserRole.MANAGER ? (currentLanguage === "so" ? "🔑 Maamule" : "🔑 Manager") :
                                (currentLanguage === "so" ? "🛒 Cashiir" : "🛒 Cashier");
                  return (
                    <button
                      key={r}
                      onClick={() => requestRoleSwitch(r)}
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                        selectedRole === r 
                          ? "bg-teal-500 text-slate-900" 
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-indigo-200 italic font-sans hidden lg:block">
              <b>{selectedRole === UserRole.BUSINESS_OWNER ? (currentLanguage === "so" ? "MALAQA GANACSIGA" : "BUSINESS OWNER") : selectedRole === UserRole.MANAGER ? (currentLanguage === "so" ? "MAAMULE" : "MANAGER") : (currentLanguage === "so" ? "CASHIIRKA" : "CASHIER")} Role:</b> {currentPerms.desc}
            </p>
          </div>

          {/* Module App Tabs */}
          <div className="bg-white border-b border-slate-200 overflow-x-auto flex shrink-0 shadow-sm scrollbar-none">
            {[
              { id: "dashboard", label: TRANSLATIONS[currentLanguage].dashboardTab, icon: BarChart3 },
              { id: "pos", label: TRANSLATIONS[currentLanguage].posTab, icon: ShoppingCart },
              { id: "inventory", label: TRANSLATIONS[currentLanguage].inventoryTab, icon: Package },
              { id: "debts", label: TRANSLATIONS[currentLanguage].debtsTab, icon: Users },
              { id: "expenses", label: TRANSLATIONS[currentLanguage].expensesTab, icon: CreditCard },
              { id: "suppliers", label: TRANSLATIONS[currentLanguage].suppliersTab, icon: Truck },
              { id: "assistant", label: TRANSLATIONS[currentLanguage].assistantTab, icon: Sparkles, accent: true },
              { id: "billing", label: TRANSLATIONS[currentLanguage].billingTab, icon: CreditCard },
              { id: "blueprints", label: TRANSLATIONS[currentLanguage].blueprintsTab, icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isLocked = subStatus?.status === "expired" && tab.id !== "billing";
              return (
                <button
                  key={tab.id}
                  disabled={isLocked}
                  onClick={() => !isLocked && setCurrentTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    isLocked 
                      ? "opacity-35 cursor-not-allowed bg-slate-50 border-transparent text-slate-400" 
                      : currentTab === tab.id
                      ? "border-teal-600 text-teal-700 bg-teal-50/20 font-bold"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  } ${tab.accent && !isLocked ? "text-indigo-600" : ""}`}
                >
                  <Icon className={`w-4 h-4 ${tab.accent && currentTab !== "assistant" && !isLocked ? "text-indigo-600 animate-pulse" : ""}`} />
                  <span>{tab.label}</span>
                  {isLocked && (
                    <span className="text-[9px] bg-rose-50 border border-rose-250 text-rose-600 px-1.5 py-0.2 rounded-full font-bold ml-1 uppercase">
                      Locked 🔒
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Core Content Stage */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
            {currentTab === "dashboard" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="dashboard" currentLanguage={currentLanguage} />
                {renderSectorCatalogSwitcher()}
                
                {/* Visual Sales, Debts & Inventory KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* KPI card today sales */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-teal-50 text-teal-600 rounded-bl-xl group-hover:bg-teal-600 group-hover:text-white transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px] font-sans font-semibold uppercase tracking-wider">{TRANSLATIONS[currentLanguage].todaySales}</p>
                      <h3 className="text-slate-900 font-display font-black text-lg sm:text-2xl mt-1.5 tracking-tight">
                        {formatMoney(stats.todaySales)}
                      </h3>
                      <p className="text-[10px] text-emerald-600 font-mono mt-1 flex items-center gap-1 font-bold leading-none">
                        <TrendingUp className="w-3.5 h-3.5 inline" />
                        <span>+14.5% vs yesterday</span>
                      </p>
                    </div>
                  </div>

                  {/* KPI card gross profit */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-emerald-50 text-emerald-600 rounded-bl-xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px] font-sans font-semibold uppercase tracking-wider">{TRANSLATIONS[currentLanguage].profit}</p>
                      <h3 className={`font-display font-black text-lg sm:text-2xl mt-1.5 tracking-tight ${stats.profit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {formatMoney(stats.profit)}
                      </h3>
                      <p className="text-[10px] text-emerald-600 font-mono mt-1 flex items-center gap-1 font-bold leading-none">
                        <ArrowUpRight className="w-3.5 h-3.5 inline" />
                        <span>35.4% margins</span>
                      </p>
                    </div>
                  </div>

                  {/* KPI card customer debts */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-amber-50 text-amber-600 rounded-bl-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px] font-sans font-semibold uppercase tracking-wider">{TRANSLATIONS[currentLanguage].outstandingDebts}</p>
                      <h3 className="text-slate-800 font-display font-black text-lg sm:text-2xl mt-1.5 tracking-tight">
                        {formatMoney(stats.customerDebts)}
                      </h3>
                      <p className="text-[10px] text-amber-600 font-mono mt-1 flex items-center gap-1 font-bold leading-none">
                        <Clock className="w-3.5 h-3.5 inline" />
                        <span>{customers.filter(c => c.debtAmount > 0).length} active debtors</span>
                      </p>
                    </div>
                  </div>

                  {/* KPI card inventory valuation */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-indigo-50 text-indigo-600 rounded-bl-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px] font-sans font-semibold uppercase tracking-wider">{TRANSLATIONS[currentLanguage].inventoryValue}</p>
                      <h3 className="text-slate-900 font-display font-black text-lg sm:text-2xl mt-1.5 tracking-tight">
                        {formatMoney(stats.inventoryValuation)}
                      </h3>
                      <p className="text-[10px] text-indigo-600 font-mono mt-1 flex items-center gap-1 font-bold leading-none">
                        <Layers className="w-3.5 h-3.5 inline" />
                        <span>{products.length} registered items</span>
                      </p>
                    </div>
                  </div>

                </div>

                {/* Main Visual charts bento row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Analytics charts panels */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-slate-800 font-bold text-sm tracking-wide">
                          {currentLanguage === "so" ? "Burcad-Hantiyaha Toddobaadka" : "Weekly Transaction Cash Flow"}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">USD and Somali Shilling dual metric representation</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleExportData("excel")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Export Excel</span>
                        </button>
                        <button onClick={() => handleExportData("pdf")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Handmade elegant SVG representation of weekly sales */}
                    <div className="h-64 flex items-end gap-3.5 px-4 pt-4 border-b border-l border-slate-200 relative">
                      
                      {/* background grid guide lines */}
                      <div className="absolute left-0 right-0 top-1/4 border-t border-slate-100 border-dashed pointer-events-none"></div>
                      <div className="absolute left-0 right-0 top-2/4 border-t border-slate-100 border-dashed pointer-events-none"></div>
                      <div className="absolute left-0 right-0 top-3/4 border-t border-slate-100 border-dashed pointer-events-none"></div>

                      {[
                        { dayLabel: "Isniin (Mon)", volumeUsd: 140, expenseUsd: 45 },
                        { dayLabel: "Talaado (Tue)", volumeUsd: 210, expenseUsd: 30 },
                        { dayLabel: "Arbaco (Wed)", volumeUsd: 180, expenseUsd: 65 },
                        { dayLabel: "Khamiis (Thu)", volumeUsd: 310, expenseUsd: 50 },
                        { dayLabel: "Jimco (Fri)", volumeUsd: 450, expenseUsd: 120 },
                        { dayLabel: "Sabti (Sat)", volumeUsd: 380, expenseUsd: 80 },
                        { dayLabel: "Axad (Sun)", volumeUsd: 290, expenseUsd: 40 },
                      ].map((bar, idx) => {
                        const totalHeightPercent = (bar.volumeUsd / 450) * 100;
                        const expHeightPercent = (bar.expenseUsd / 450) * 100;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end relative group">
                            
                            {/* Vol indicator values */}
                            <div className="absolute -top-7 bg-slate-900 text-white rounded text-[9px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-all font-mono shadow-md z-10">
                              Sales: {formatMoney(bar.volumeUsd)}
                            </div>

                            {/* Double Bars */}
                            <div className="w-full flex justify-center gap-1 items-end h-[90%]">
                              {/* Sales Bar */}
                              <div 
                                style={{ height: `${totalHeightPercent}%` }} 
                                className="w-3 sm:w-4 bg-teal-600 rounded-t group-hover:bg-teal-500 transition-all shadow-sm"
                              ></div>
                              {/* Expenses Bar */}
                              <div 
                                style={{ height: `${expHeightPercent}%` }} 
                                className="w-3 sm:w-4 bg-rose-500 rounded-t group-hover:bg-rose-400 transition-all shadow-sm"
                              ></div>
                            </div>
                            
                            <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono mt-2 truncate w-full text-center">{bar.dayLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* graph legends */}
                    <div className="flex gap-4 p-3 justify-center text-[10px] font-mono mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-teal-600 rounded"></span>
                        <span className="text-slate-600">{currentLanguage === "so" ? "Iibka (Sales)" : "Gross Payouts (Sales)"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-rose-500 rounded"></span>
                        <span className="text-slate-600">{currentLanguage === "so" ? "Kharash (Expenses)" : "Expenses"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Pulse / Telecommunication adapters mockup */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-slate-800 font-bold text-sm tracking-wide mb-3 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                        {currentLanguage === "so" ? "Mashiinka Biilka Mobile-ka" : "Somali Payment Integrations"}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed font-sans mb-4">
                        {currentLanguage === "so" 
                          ? "Farsamada loogu talagalay lacag bixinta isgaarsiinta directly ku dhex shaqeysa nidaamka. Hubi lifaaqyada API-ga hoose:" 
                          : "Integration-ready native modules compiled for direct merchant USSD callbacks:"}
                      </p>

                      <div className="space-y-2.5">
                        {[
                          { name: "EVC Plus (Hormuud)", status: "INTEGRATION READY", code: "*712*MERCHANT*AMT#", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                          { name: "eDahab (Somtel)", status: "INTEGRATION READY", code: "*101*MERCHANT*AMT#", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
                          { name: "Sahal (Golis)", status: "PROTOTYPE TESTING", code: "*207*MERCHANT*AMT#", color: "text-sky-700 bg-sky-50 border-sky-300" },
                          { name: "Somnet (Jeeb)", status: "PROTOTYPE TESTING", code: "*288*MERCHANT*AMT#", color: "text-purple-700 bg-purple-50 border-purple-200" },
                          { name: "Premier Wallet", status: "REST-API LINKED", code: "OAuth2 Token Validation", color: "text-teal-700 bg-teal-50 border-teal-200" },
                        ].map((gate, i) => (
                          <div key={i} className={`p-2.5 rounded-xl border text-[11px] font-mono leading-none flex items-center justify-between ${gate.color}`}>
                            <div>
                              <span className="font-bold text-slate-800 shrink-0">{gate.name}</span>
                              <p className="text-[9px] text-slate-400 mt-1 uppercase font-normal">{gate.code}</p>
                            </div>
                            <span className="font-bold text-[9px] shrink-0">{gate.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-6 text-center">
                      <button
                        onClick={() => setCurrentTab("assistant")}
                        className="bg-indigo-600 text-white rounded-xl px-4 py-2 text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {currentLanguage === "so" ? "Weydii Kaafi AI La-taliyahaaga" : "Consult AI Assistant Coach"}
                      </button>
                    </div>
                  </div>

                </div>

                {/* History list and quick alerts */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-slate-800 font-bold text-sm tracking-wide">
                      {currentLanguage === "so" ? "Kuwii ugu Dambeeyay ee la Ibiyay" : "Recent Store Activity & Cashouts"}
                    </h4>
                    <span className="text-slate-400 font-mono text-[10px]/none">Today's transactions</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-sans uppercase text-[10px]">
                          <th className="py-2.5">Receipt ID</th>
                          <th className="py-2.5">Items Ordered</th>
                          <th className="py-2.5">Date & Time</th>
                          <th className="py-2.5">Payment Gateway</th>
                          <th className="py-2.5 text-right">Settled Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {sales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-slate-50 text-slate-700 transition">
                            <td className="py-3 font-mono font-bold text-teal-600">{sale.id.replace("sale_", "KFI-")}</td>
                            <td className="py-3 max-w-xs truncate">
                              {sale.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                            </td>
                            <td className="py-3 text-slate-400 font-mono">{new Date(sale.timestamp).toLocaleString()}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px]/none font-mono font-bold bg-slate-100 border border-slate-300 text-slate-800">{sale.paymentMethod}</span>
                            </td>
                            <td className="py-3 text-right font-bold text-slate-900">{formatMoney(sale.totalAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* POINT OF SALE (POS) checkout interface */}
            {currentTab === "pos" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="pos" currentLanguage={currentLanguage} />
                {renderSectorCatalogSwitcher()}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Available Products Selection Stage (Col 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-sm items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={TRANSLATIONS[currentLanguage].search}
                        className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 focus:border-teal-500 focus:outline-none transition-all text-slate-800"
                      />
                    </div>
                    
                    {/* Category quick selectors */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500 hover:bg-slate-100 text-slate-700 font-medium shrink-0 w-full md:w-auto"
                    >
                      <option value="">{currentLanguage === "so" ? "Dhammaan Qaybaha" : "All Categories"}</option>
                      {categories.map((c, i) => (
                        <option value={c} key={i}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((p) => {
                      const qtyInCart = posCart[p.id] || 0;
                      const isLowStock = p.stock <= p.minStock;
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => p.stock > 0 && addToCart(p.id)}
                          className={`bg-white border rounded-2xl p-4 shadow-sm relative flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer ${
                            qtyInCart > 0 ? "border-teal-600 ring-1 ring-teal-600/30 bg-teal-50/5" : "border-slate-200 hover:border-slate-300"
                          } ${p.stock === 0 ? "opacity-60 cursor-not-allowed bg-slate-100" : ""}`}
                        >
                          <div className="flex gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-800 text-xs sm:text-sm truncate leading-snug">{p.name}</h5>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
                              
                              <div className="flex gap-2.5 mt-2">
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
                                  isLowStock ? "bg-red-50 text-red-700 border border-red-200" : "bg-slate-100 text-slate-600"
                                }`}>
                                  Stock: {p.stock}
                                </span>
                                {isLowStock && p.stock > 0 && (
                                  <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5 animate-pulse">⚠️ {currentLanguage === "so" ? "Yaraaday" : "Low"}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-4 border-t border-slate-100 pt-3">
                            <div>
                              <span className="text-slate-400 text-[10px] block leading-none">Price</span>
                              <span className="font-display font-black text-xs sm:text-sm text-teal-600 mt-1 block">
                                {formatMoney(p.sellingPrice)}
                              </span>
                            </div>

                            {p.stock === 0 ? (
                              <span className="text-[11px] bg-slate-200 text-slate-600 px-2 py-1 rounded-lg font-bold font-sans uppercase">OUT OF STOCK</span>
                            ) : qtyInCart > 0 ? (
                              <div className="flex items-center gap-1.5 bg-teal-600 text-white rounded-lg p-0.5" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => removeFromCart(p.id)} className="p-1 hover:bg-teal-700 rounded transition"><Minus className="w-3.5 h-3.5" /></button>
                                <span className="text-xs font-bold font-mono px-1.5">{qtyInCart}</span>
                                <button onClick={() => addToCart(p.id)} className="p-1 hover:bg-teal-700 rounded transition"><Plus className="w-3.5 h-3.5" /></button>
                              </div>
                            ) : (
                              <span className="bg-teal-50 border border-teal-200 hover:bg-teal-600 hover:text-white hover:border-transparent text-teal-700 font-bold rounded-lg p-1.5 text-xs transition cursor-pointer">
                                + Add Checkout
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shopping Checkout side panel (Col 5) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm tracking-wide border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart className="w-4 h-4 text-teal-600" />
                        {currentLanguage === "so" ? "Kabadhka Dalabka" : "Checkout Basket"}
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold">
                        {Object.values(posCart).reduce((acc, v) => (acc as number) + (v as number), 0)} Items
                      </span>
                    </h4>

                    {/* Cart rows */}
                    {Object.keys(posCart).length === 0 ? (
                      <div className="py-20 text-center text-slate-400 space-y-2">
                        <ShoppingCart className="w-10 h-10 mx-auto opacity-30 text-teal-600" />
                        <p className="text-xs">{currentLanguage === "so" ? "Dambiiluhu waa madhan yahay. Guji alaab si aad ugu darto." : "No checkout items. Tap products on the left stage."}</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                        {Object.entries(posCart).map(([id, qty]) => {
                          const p = products.find(prod => prod.id === id)!;
                          return (
                            <div key={id} className="py-3 flex justify-between items-center text-xs">
                              <div className="min-w-0 pr-2">
                                <span className="font-bold text-slate-800 block truncate">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{qty} x {formatMoney(p.sellingPrice)}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-mono font-bold text-slate-800">{formatMoney(p.sellingPrice * (qty as number))}</span>
                                <button
                                  onClick={() => {
                                    const copy = { ...posCart };
                                    delete copy[id];
                                    setPosCart(copy);
                                  }}
                                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pricing summaries */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatMoney(getCartTotal() * 0.95)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Service Tax (Commercial 5%)</span>
                      <span className="font-mono">{formatMoney(getCartTotal() * 0.05)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-2.5">
                      <span>Total Payout (Amount)</span>
                      <span className="font-mono text-teal-600 text-base">{formatMoney(getCartTotal())}</span>
                    </div>
                  </div>

                  {/* Checkout settings / Payment Gateways */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Payment Method</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: "EVC_PLUS", title: "EVC Plus" },
                          { id: "EDAHAB", title: "eDahab" },
                          { id: "SAHAL", title: "Sahal" },
                          { id: "SOMNET", title: "Somnet" },
                          { id: "PREMIER_WALLET", title: "Premier W" },
                          { id: "CASH", title: "CASH Mode" },
                        ].map((gate) => (
                          <button
                            key={gate.id}
                            type="button"
                            onClick={() => setPaymentOption(gate.id as any)}
                            className={`px-2.5 py-2 rounded-xl text-[11px] font-mono font-bold text-center border cursor-pointer transition-all ${
                              paymentOption === gate.id 
                                ? "bg-teal-600 text-white border-transparent shadow" 
                                : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {gate.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Phone input if mobile money selected */}
                    {paymentOption !== "CASH" ? (
                      <div className="space-y-1 bg-teal-50/40 p-3 rounded-xl border border-teal-100">
                        <label className="text-[10px] uppercase font-bold text-teal-800 tracking-wider flex items-center gap-1 leading-none mb-1">
                          <Phone className="w-3.5 h-3.5 inline text-teal-600" />
                          <span>Macaamiilka Phone (Partner/Customer Number)</span>
                        </label>
                        <input
                          type="tel"
                          value={payPhoneNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, ""); // Only allow digits
                            if (val.startsWith("0")) {
                              val = val.replace(/^0+/, ""); // Automatically strip leading 0s
                            }
                            setPayPhoneNumber(val);
                          }}
                          placeholder="Fadlan bili 61, 62 ama 68 (Sida 61xxxxxxx, 62xxxxxxx, 68xxxxxxx)"
                          className="w-full bg-white text-xs border border-slate-300 rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none transition-all text-slate-800 font-mono"
                        />
                        <div className="text-[9px] text-slate-400 font-sans mt-0.5 leading-tight">
                          * Hormuud (61xxxxxxx) | Somtel (62xxxxxxx) | Somnet (68xxxxxxx). Si toos ah ayaa lagaaga reebay '0'-da hore.
                        </div>
                      </div>
                    ) : (
                      /* Repayment credit debt options for cash matching Somali tradition (Amaah) */
                      <div className="space-y-1 bg-amber-50/40 p-3 rounded-xl border border-amber-150">
                        <label className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5 leading-none mb-1">
                          <Users className="w-3.5 h-3.5 inline text-amber-600" />
                          <span>Amaah (Record as Customer Debt Credit)</span>
                        </label>
                        <select
                          value={posDebtCustomerId}
                          onChange={(e) => setPosDebtCustomerId(e.target.value)}
                          className="w-full bg-white text-xs border border-slate-300 rounded-lg p-2 focus:border-amber-500 focus:outline-none transition-all text-slate-700"
                        >
                          <option value="">-- No credit, completed cash payment --</option>
                          {customers.map((c) => (
                            <option value={c.id} key={c.id}>{c.name} ({formatMoney(c.debtAmount)} active debt)</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={Object.keys(posCart).length === 0 || checkoutSimulating}
                      onClick={handlePOSCheckout}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 w-full text-xs font-bold tracking-wider transition-all shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                      {checkoutSimulating ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          {currentLanguage === "so" ? "Daabacayaa..." : "Telecom Hooking..."}
                        </span>
                      ) : (
                        currentLanguage === "so" ? "Xaqiiji Iibka (Fariinka USSD)" : "Confirm Order & Payout"
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
            )}

            {/* PRODUCT INVENTORY Hub Manager */}
            {currentTab === "inventory" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="inventory" currentLanguage={currentLanguage} />
                {renderSectorCatalogSwitcher()}
                
                {/* Header operations controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={TRANSLATIONS[currentLanguage].search}
                        className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 focus:border-teal-500 focus:outline-none text-slate-800"
                      />
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-700 font-medium font-sans focus:outline-none w-full sm:w-auto"
                    >
                      <option value="">All Categories</option>
                      {categories.map((c, i) => (
                        <option value={c} key={i}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {currentPerms.canEditStock ? (
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide cursor-pointer transition flex items-center gap-1.5 w-full md:w-auto justify-center shadow-md shadow-teal-600/10"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{TRANSLATIONS[currentLanguage].addProduct}</span>
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs font-mono italic">Manager permission required to add products</span>
                  )}
                </div>

                {/* Main inventory list table */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-sans uppercase text-[10px]">
                          <th className="p-4">{TRANSLATIONS[currentLanguage].productName}</th>
                          <th className="p-4">{TRANSLATIONS[currentLanguage].sku}</th>
                          <th className="p-4">{TRANSLATIONS[currentLanguage].category}</th>
                          <th className="p-4">Cost Price</th>
                          <th className="p-4">{TRANSLATIONS[currentLanguage].price}</th>
                          <th className="p-4 text-center">{TRANSLATIONS[currentLanguage].stock}</th>
                          <th className="p-4 text-right">Adjustment & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {filteredProducts.map((p) => {
                          const isLowStock = p.stock <= p.minStock;
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/30 text-slate-700 transition">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm shrink-0" referrerPolicy="no-referrer" />
                                  <div className="min-w-0">
                                    <span className="font-bold text-slate-900 block truncate leading-tight">{p.name}</span>
                                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Barcode: {p.barcode}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-mono font-bold text-slate-600">{p.sku}</td>
                              <td className="p-4">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]/none font-medium text-slate-700">{p.category}</span>
                              </td>
                              <td className="p-4 font-mono text-slate-600">{formatMoney(p.purchasePrice)}</td>
                              <td className="p-4 font-mono font-bold text-teal-600">{formatMoney(p.sellingPrice)}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded font-mono font-bold text-[11px] ${
                                  isLowStock 
                                    ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse" 
                                    : "bg-slate-100 text-slate-800"
                                }`}>
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 shrink-0">
                                  {currentPerms.canEditStock ? (
                                    <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
                                      <button
                                        title="Stock out"
                                        onClick={() => handleStockAdjustment(p.id, -5)}
                                        className="p-1 hover:bg-white text-rose-600 rounded transition cursor-pointer"
                                      >
                                        <Minus className="w-3.5 h-3.5" />
                                      </button>
                                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold px-1">5 Pcs</span>
                                      <button
                                        title="Stock in"
                                        onClick={() => handleStockAdjustment(p.id, 5)}
                                        className="p-1 hover:bg-white text-teal-600 rounded transition cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-mono text-slate-400 italic">No access</span>
                                  )}

                                  <button
                                    onClick={() => {
                                      setPriceEditingProduct(p);
                                      setNewEditPrice(p.sellingPrice.toString());
                                    }}
                                    className="bg-amber-500 hover:bg-amber-450 text-slate-950 font-black font-mono text-[10px] uppercase px-3 py-2 rounded-xl border border-amber-600 cursor-pointer shadow-sm transition-all flex items-center gap-1 select-none active:scale-95 shrink-0"
                                    title={currentLanguage === "so" ? "Bedel qiimaha oo u gudub iibta" : "Update price and start checkout"}
                                  >
                                    <Sparkles className="w-3 h-3 text-slate-950 animate-pulse" />
                                    <span>{currentLanguage === "so" ? "Qiimaha & Iibi" : "Price & Sell"}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* CUSTOMER DEBTS REGISTRY (Amaah Module) */}
            {currentTab === "debts" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="debts" currentLanguage={currentLanguage} />
                
                {/* Header controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm tracking-wide">Customer Amaah & Creditors Ledger</h4>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">Automated payments tracking following Somali retail customs</p>
                  </div>
                  
                  <button
                    onClick={() => setShowAddDebtModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 w-full md:w-auto shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record New Debtor</span>
                  </button>
                </div>

                {/* Grid list of debtors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {customers.map((c) => {
                    const isOverdue = c.debtAmount > 0 && c.dueDate && new Date(c.dueDate) < new Date();
                    return (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between">
                        
                        {/* Overdue badge watermark */}
                        {isOverdue && (
                          <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono absolute top-4 right-4 animate-bounce">
                            Overdue Alert
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-display font-bold">
                              {c.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="font-bold text-slate-800 text-sm leading-tight">{c.name}</h5>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">📞 {c.phone}</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">Outstanding Balance:</span>
                              <span className="font-mono font-extrabold text-sm text-amber-700">{formatMoney(c.debtAmount)}</span>
                            </div>
                            
                            {c.debtAmount > 0 && c.dueDate && (
                              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                                <span>Repayment Deadline:</span>
                                <span className={`font-mono font-bold ${isOverdue ? "text-rose-600" : ""}`}>
                                  📅 {c.dueDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer repayments and reminders */}
                        <div className="mt-6 border-t border-slate-100 pt-4 space-y-2.5">
                          {c.debtAmount > 0 ? (
                            <>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const amount = parseFloat(prompt(currentLanguage === "so" ? "Gali lacagta lasoo celiyay (USD):" : "Enter repayment amount in USD:", c.debtAmount.toString()) || "0");
                                    if (amount > 0) handleRecordRepayment(c.id, amount);
                                  }}
                                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-[11px]/none font-bold tracking-wide uppercase cursor-pointer text-center text-[10px]"
                                >
                                  Record cash payment
                                </button>
                                
                                <button
                                  onClick={() => {
                                    const msg = `Salaamu Alaykum ${c.name}. Kani waa xasuusin saaxiibtinimo oo ku saabsan deyntaada dukaanka KAAFI oo dhan $${c.debtAmount} (${formatMoney(c.debtAmount)}) oo ku beegan taariikhda ${c.dueDate}. Fadlan nagula soo hagaaji EVC Plus: 0615551122. Mahadsanid!`;
                                    alert(`Reminding ${c.name} via WhatsApp/SMS integration:\n\n"${msg}"`);
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg px-2.5 py-2 text-[10px]/none flex items-center justify-center gap-1 cursor-pointer font-bold"
                                  title="WhatsApp Reminder"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Remind</span>
                                </button>
                              </div>
                            </>
                          ) : (
                            <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>No outstanding credit debt!</span>
                            </span>
                          )}

                          {/* mini ledger expander */}
                          <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px]/relaxed text-slate-400 font-mono">
                            <span className="font-bold text-slate-600 block mb-1">Ledger Audits:</span>
                            {c.history.map((h) => (
                              <div key={h.id} className="flex justify-between">
                                <span>{h.date} - {h.type}:</span>
                                <span className={h.type === "BORROW" ? "text-amber-700 font-bold" : "text-emerald-700 font-bold"}>
                                  {h.type === "BORROW" ? "+" : "-"}${h.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* EXPENSES TRACKER */}
            {currentTab === "expenses" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="expenses" currentLanguage={currentLanguage} />
                
                {/* Header operations controls */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="text-slate-800 font-bold text-sm tracking-wide">Commercial Outflow Tracker</h4>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">Record fixed costs, utilities, transport and salaries</p>
                  </div>
                  
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5 w-full md:w-auto shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record New Expense</span>
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Category summary cards */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2">Expenses by Sector</h5>
                    <div className="space-y-3 text-xs leading-none">
                      {[
                        { category: "RENT", label: "Shop Space Rent", defaultAmount: expenses.filter(e => e.category === "RENT").reduce((acc, o) => acc + o.amount, 0), color: "bg-red-500" },
                        { category: "SALARIES", label: "Salaries and Allowances", defaultAmount: expenses.filter(e => e.category === "SALARIES").reduce((acc, o) => acc + o.amount, 0), color: "bg-amber-500" },
                        { category: "UTILITIES", label: "Utilities & Solar Power", defaultAmount: expenses.filter(e => e.category === "UTILITIES").reduce((acc, o) => acc + o.amount, 0), color: "bg-indigo-500" },
                        { category: "LOGISTICS", label: "Import Logistics / Transport", defaultAmount: expenses.filter(e => e.category === "LOGISTICS").reduce((acc, o) => acc + o.amount, 0), color: "bg-sky-500" },
                        { category: "OTHER", label: "Miscellaneous Outflows", defaultAmount: expenses.filter(e => e.category === "OTHER").reduce((acc, o) => acc + o.amount, 0), color: "bg-slate-500" }
                      ].map((item, id) => (
                        <div key={id} className="space-y-1.5">
                          <div className="flex justify-between font-medium text-slate-600">
                            <span>{item.label}</span>
                            <span className="font-bold font-mono text-slate-900">{formatMoney(item.defaultAmount)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${Math.min(100, (item.defaultAmount / (stats.expenses || 1)) * 100)}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expenses logs tables */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-2.5 mb-3">Outflow logs</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 font-sans uppercase text-[10px]">
                            <th className="py-2">Description</th>
                            <th className="py-2">Category</th>
                            <th className="py-2">Date</th>
                            <th className="py-2 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                          {expenses.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 font-medium text-slate-900">{e.description}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 border border-slate-200 text-slate-600">{e.category}</span>
                              </td>
                              <td className="py-3 text-slate-400 font-mono">{e.date}</td>
                              <td className="py-3 text-right font-bold text-rose-600 font-mono">-{formatMoney(e.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUPPLIERS BACKLOG */}
            {currentTab === "suppliers" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="suppliers" currentLanguage={currentLanguage} />
                
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h4 className="text-slate-800 font-bold text-sm tracking-wide">Bakaara Market Wholesalers & Suppliers Directories</h4>
                  <p className="text-slate-500 text-xs font-sans mt-0.5">Settle wholesale stock purchases and follow payment histories</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suppliers.map((s) => (
                    <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold text-sm">
                            {s.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-sm leading-tight">{s.name}</h5>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">🏢 {s.company} | 📞 {s.phone}</p>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">Due Balance to Supplier:</span>
                          <span className={`font-mono font-black ${s.dueBalance > 0 ? "text-rose-600 font-extrabold" : "text-emerald-700"}`}>
                            {formatMoney(s.dueBalance)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                        {s.dueBalance > 0 ? (
                          <button
                            onClick={() => {
                              const amt = parseFloat(prompt(currentLanguage === "so" ? "Gali lacagta aad bixineyso (USD):" : "Enter payment amount in USD to supplier:", s.dueBalance.toString()) || "0");
                              if (amt > 0) handleSupplierPayout(s.id, amt);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 w-full text-xs font-bold transition shadow cursor-pointer text-center uppercase text-[10px]"
                          >
                            Pay Wholesale Balance
                          </button>
                        ) : (
                          <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                            <CheckCircle2 className="w-4.5 h-4.5" />
                            <span>Supplier account is fully settled and cleared!</span>
                          </span>
                        )}

                        {/* Suppliers History logs */}
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px]/relaxed text-slate-400 font-mono">
                          <span className="font-bold text-slate-600 block mb-1">Suppliers Ledger:</span>
                          {s.history.map((h) => (
                            <div key={h.id} className="flex justify-between">
                              <span>{h.date} - {h.type}:</span>
                              <span className={h.type === "PURCHASE" ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                                {h.type === "PURCHASE" ? "[Buy] +" : "[Pay] -"}${h.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Real-time AI Assistant consults (connected to dynamic server context!) */}
            {currentTab === "assistant" && (
              <div className="h-[580px]">
                <AIAssistant 
                  products={products}
                  customers={customers}
                  expenses={expenses}
                  suppliers={suppliers}
                  sales={sales}
                  currentLanguage={currentLanguage}
                />
              </div>
            )}

            {/* Technical designs, schemas and source codes */}
            {currentTab === "blueprints" && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="blueprints" currentLanguage={currentLanguage} />
                <BlueprintsHub />
              </div>
            )}

            {/* SaaS Billing & Subscription Manager */}
            {currentTab === "billing" && currentUser && (
              <div className="space-y-6">
                <SMESectionGuide sectionId="billing" currentLanguage={currentLanguage} />
                <BillingSubSec
                  currentLanguage={currentLanguage}
                  formatMoney={formatMoney}
                  businessId={currentUser.businessId}
                  onStatusUpdated={(status) => setSubStatus(status)}
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ROLE UNLOCK SECURITY PASSCODE GATEWAY MODAL */}
      <AnimatePresence>
        {roleToUnlock && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-3xl relative text-slate-100 font-sans"
            >
              <button 
                onClick={() => setRoleToUnlock(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer bg-slate-800 p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5 mt-2">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-3 text-amber-400">
                  <Clock className="w-8 h-8 animate-pulse text-amber-400" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase font-display">
                  {currentLanguage === "so" ? "Xaqiijinta Ereyga Sirta (Boss Only)" : "Owner Security Challenge"}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {currentLanguage === "so"
                    ? `Fadlan geli ereyga sirta ah dukaanka si aad u furto qaybta: ${roleToUnlock.replace("_", " ")}`
                    : `Specify your SME shop passcode to activate restricted area: ${roleToUnlock.replace("_", " ")}`}
                </p>
              </div>

              <form onSubmit={handleVerifyRolePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">
                    {currentLanguage === "so" ? "Ereyga Sirta ah (Password)" : "Passcode PIN"}
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={roleUnlockPassword}
                    onChange={(e) => setRoleUnlockPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-center text-slate-200 tracking-widest text-lg font-mono focus:outline-none transition-all"
                  />
                </div>

                {roleUnlockError && (
                  <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs text-center font-mono font-bold leading-relaxed">
                    ⚠ {roleUnlockError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3.5 pt-2 font-mono text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleToUnlock(null);
                      setRoleUnlockPassword("");
                      setRoleUnlockError("");
                    }}
                    className="py-3 rounded-xl border border-slate-800 text-slate-350 bg-slate-950 hover:bg-slate-900 transition cursor-pointer"
                  >
                    {currentLanguage === "so" ? "Xir" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase tracking-wider transition cursor-pointer font-black"
                  >
                    {currentLanguage === "so" ? "Foorri" : "Unlock"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK PRICE UPDATE & DIRECT OUTFLOW TRANSITION MODAL */}
      <AnimatePresence>
        {priceEditingProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-sm shadow-2xl relative font-sans text-slate-800"
            >
              <button 
                onClick={() => setPriceEditingProduct(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer bg-slate-100 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5 mt-2">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-3 text-amber-600 animate-bounce">
                  <Sparkles className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase font-display leading-tight">
                  {currentLanguage === "so" ? "Bedel Qiimaha & Iibi" : "Change Price & Sell"}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {currentLanguage === "so"
                    ? `Bedel qiimaha retailka ee daawadan, markaad submit dhahdo waxaa laguu gudbin doona dukaanka iibka (POS) iyadoo lagugu dhex daray.`
                    : `Update this drug's retail price. Submitting will save the price and key it right into point-of-sale for instant checkout.`}
                </p>
              </div>

              {/* Drug context info panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span>{currentLanguage === "so" ? "Daawada:" : "Medicine Name:"}</span>
                  <span className="font-extrabold text-slate-800 truncate max-w-[180px]">{priceEditingProduct.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>{currentLanguage === "so" ? "Qiimaha Sifaha (Cost):" : "Cost price:"}</span>
                  <span className="font-mono text-slate-600 font-bold">{formatMoney(priceEditingProduct.purchasePrice)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>{currentLanguage === "so" ? "Khaasidda (Stock):" : "Current Stock:"}</span>
                  <span className="font-mono text-slate-600 font-extrabold">{priceEditingProduct.stock} units</span>
                </div>
              </div>

              <form onSubmit={handleQuickPriceChangeAndSell} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                    {currentLanguage === "so" ? "QIIMAHA CUSUB EE RETAIKA ($ USD)" : "NEW RETAIL SELLING PRICE ($ USD)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-extrabold text-lg font-mono">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      autoFocus
                      min="0.01"
                      value={newEditPrice}
                      onChange={(e) => setNewEditPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white rounded-xl pl-9 pr-4 py-3 text-left text-slate-900 font-bold font-mono text-lg focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setPriceEditingProduct(null);
                      setNewEditPrice("");
                    }}
                    className="py-3 rounded-xl border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  >
                    {currentLanguage === "so" ? "Ka laabo" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 uppercase tracking-wider transition cursor-pointer font-black border border-amber-600 shadow-sm"
                  >
                    {currentLanguage === "so" ? "Xaqiiji & Iibi" : "Update & Sell"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD PRODUCT MODAL --- */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowAddProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-slate-800 font-display font-bold text-base mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Package className="w-5 h-5 text-teal-600" />
                <span>Onboard New Product</span>
              </h4>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Camel Milk 1L, Paracetamol box, etc..."
                    className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-lg px-3.5 py-2 focus:border-teal-500 focus:outline-none transition-all text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category Sector</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-teal-500 text-slate-700 font-medium"
                    >
                      {categories.map((c, i) => (
                        <option value={c} key={i}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Stock Amount</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Price (USD)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newProduct.purchasePrice || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sale Price (USD)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newProduct.sellingPrice || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Low Stock Warning Indicator</label>
                  <input
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 w-full text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer mt-4"
                >
                  Onboard product register
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RECORD DEBT MODAL --- */}
      <AnimatePresence>
        {showAddDebtModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowAddDebtModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-slate-800 font-display font-bold text-base mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Users className="w-5 h-5 text-amber-600" />
                <span>Add Customer Debt Record</span>
              </h4>

              <form onSubmit={handleAddCustomerDebt} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Debtor Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomerDebt.name}
                    onChange={(e) => setNewCustomerDebt({ ...newCustomerDebt, name: e.target.value })}
                    placeholder="e.g. Guled Farah, Cabdi Kaafi..."
                    className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Merchant Phone Number</label>
                  <input
                    type="tel"
                    value={newCustomerDebt.phone}
                    onChange={(e) => setNewCustomerDebt({ ...newCustomerDebt, phone: e.target.value })}
                    placeholder="E.g. 061543xxxx"
                    className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Borrowed USD Amount</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newCustomerDebt.amount || ""}
                      onChange={(e) => setNewCustomerDebt({ ...newCustomerDebt, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Repay Deadline</label>
                    <input
                      type="date"
                      required
                      value={newCustomerDebt.dueDate}
                      onChange={(e) => setNewCustomerDebt({ ...newCustomerDebt, dueDate: e.target.value })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Details Note</label>
                  <input
                    type="text"
                    value={newCustomerDebt.note}
                    onChange={(e) => setNewCustomerDebt({ ...newCustomerDebt, note: e.target.value })}
                    placeholder="e.g. Caano Geel delivery buy"
                    className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-3 w-full text-xs font-bold tracking-wider uppercase transition"
                >
                  Confirm active borrow registration
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RECORD EXPENSE MODAL --- */}
      <AnimatePresence>
        {showAddExpenseModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setShowAddExpenseModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <h4 className="text-slate-800 font-display font-bold text-base mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <CreditCard className="w-5 h-5 text-rose-600" />
                <span>Onboard Commercial Outflow Expense</span>
              </h4>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expense Description</label>
                  <input
                    type="text"
                    required
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="e.g. Fuel recharge, backup Solar batteries settlement"
                    className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-lg px-3.5 py-2 text-slate-800 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sector Class category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg p-2 text-slate-700 font-sans focus:outline-none focus:border-rose-500 font-semibold"
                    >
                      <option value="RENT">Rent / Leasing</option>
                      <option value="UTILITIES">Utilities / Electrics</option>
                      <option value="SALARIES">Employee Wages</option>
                      <option value="MARKETING">Advertisements / Marketing</option>
                      <option value="LOGISTICS">Imports / Logistics</option>
                      <option value="OTHER">Other miscellaneous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">USD Amount</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={newExpense.amount || ""}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-mono focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3 w-full text-xs font-bold tracking-wider uppercase transition shadow-md"
                >
                  Record Outflow cash deduction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REAL-TIME QR & USSD DUAL SIMULATOR WINDOW --- */}
      <AnimatePresence>
        {evcUSSDMessage && (() => {
          const getUssdAmountStr = (amount: number) => {
            const dollars = Math.floor(amount);
            const cents = Math.round((amount - dollars) * 100);
            if (cents <= 0) {
              return `${dollars}`;
            }
            return `${dollars}*${cents}`;
          };
          const ussdAmountStr = getUssdAmountStr(getCartTotal());
          const simulatedUssdCode = paymentOption === "EVC_PLUS" 
            ? `*712*${payPhoneNumber}*${ussdAmountStr}#` 
            : paymentOption === "EDAHAB"
            ? `*101*${payPhoneNumber}*${ussdAmountStr}#`
            : paymentOption === "SAHAL"
            ? `*207*${payPhoneNumber}*${ussdAmountStr}#`
            : paymentOption === "SOMNET"
            ? `*288*${payPhoneNumber}*${ussdAmountStr}#`
            : `*211*${payPhoneNumber}*${ussdAmountStr}#`;
          const qrTelData = `tel:${simulatedUssdCode}`;

          return (
            <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 w-full max-w-2xl shadow-3xl relative font-sans overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <button 
                  onClick={() => {
                    setEvcUSSDMessage(null);
                    setCheckoutSimulating(false);
                    setActiveTxId(null);
                    setActiveTxStatus(null);
                  }} 
                  className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-3">
                  <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-black font-mono text-teal-400 uppercase tracking-widest leading-none">
                      {paymentOption === "EVC_PLUS" 
                        ? "EVC Plus Direct USSD & QR Integration" 
                        : paymentOption === "EDAHAB"
                        ? "eDahab (Somtel) USSD & QR Integration"
                        : paymentOption === "SAHAL"
                        ? "Sahal (Golis) USSD & QR Integration"
                        : paymentOption === "SOMNET"
                        ? "Somnet (Jeeb) USSD & QR Integration"
                        : "Mobile USSD & QR Gate"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase mt-1">Status: {activeTxStatus === "paid" ? "APPROVED" : "WAITING FOR SCAN/DIAL"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Left side: USSD Mobile Phone frame mockup */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase block">Method 1: Manual USSD Emulator</span>
                      <p className="text-xs font-mono font-bold leading-relaxed whitespace-pre-wrap text-emerald-400 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                        {evcUSSDMessage}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end mt-4">
                      <button
                        onClick={() => {
                          setEvcUSSDMessage(null);
                          setCheckoutSimulating(false);
                          setActiveTxId(null);
                          setActiveTxStatus(null);
                        }}
                        className="px-3 py-1.5 hover:bg-slate-800 text-slate-400 text-xs rounded-xl font-bold font-sans cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Double trigger simulation confirmation automatically
                          setActiveTxStatus("paid");
                          setTimeout(() => {
                            completePOSCheckout("1020");
                            setEvcUSSDMessage(null);
                            setCheckoutSimulating(false);
                            setActiveTxId(null);
                            setActiveTxStatus(null);
                          }, 1600);
                        }}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 text-xs rounded-xl font-black font-sans cursor-pointer transition-all"
                      >
                        Send PIN
                      </button>
                    </div>
                  </div>

                  {/* Right side: Real-time QR Code Scanner & Sync Status */}
                  <div className="bg-slate-950 border border-teal-900/30 rounded-2xl p-4 flex flex-col justify-between text-center relative">
                    <div>
                      <span className="text-[9px] font-mono tracking-wider text-teal-400 uppercase font-black block mb-2">
                        Method 2: Scan Real-Time USSD QR
                      </span>

                      {activeTxStatus === "paid" ? (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="py-10 space-y-3"
                        >
                          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-1 scale-110">
                            <Check className="w-8 h-8 stroke-[3] animate-bounce" />
                          </div>
                          <h4 className="text-sm font-black text-emerald-400 uppercase tracking-tight">SAX! PAY SUCCESS</h4>
                          <p className="text-[10px] text-slate-350 leading-snug">
                            Macamiilka si dhab ah ayuu u bixiyey lacagta. Waa fasan tahay! Daabacay risiidhka...
                          </p>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {/* Direct tel: USSD QR code */}
                          <div className="bg-white p-2.5 rounded-2xl inline-block shadow-lg mx-auto">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrTelData)}`} 
                              alt="USSD Dialing QR Code" 
                              className="w-32 h-32"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-center gap-1.5 text-amber-500 text-[10px] uppercase font-mono tracking-wider font-bold">
                              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                              <span>Waiting for Camera Scan...</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-normal max-w-[190px] mx-auto">
                              Markaad talafoonka ku qabato, si toos ah ayuu kuugu furayaa call-ka tel USSD adigooan website galayn!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {activeTxStatus !== "paid" && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setActiveTxStatus("paid");
                            setTimeout(() => {
                              completePOSCheckout("1020");
                              setEvcUSSDMessage(null);
                              setCheckoutSimulating(false);
                              setActiveTxId(null);
                              setActiveTxStatus(null);
                            }, 1800);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] py-2.5 rounded-xl uppercase tracking-wider transition duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                          <span>Haa, wuu bixiyey (Confirm Paid)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 text-center">
                  <p className="text-[10px] text-slate-400 italic">
                    {simulatedUssdCode} — Direct mobile telecom dialing channel. Number of this merchant is saved securely.
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* --- PRINTABLE / DIGITAL RECEIPT DIALOG --- */}
      <AnimatePresence>
        {showReceiptModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-sm shadow-2xl relative my-8"
            >
              <button onClick={() => setShowReceiptModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 no-print cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div id="printable-receipt" className="space-y-4 font-mono text-xs text-slate-800">
                {/* Receipt Header logo */}
                <div className="text-center space-y-1">
                  <div className="border-2 border-slate-800 rounded-full w-10 h-10 flex items-center justify-center mx-auto text-lg font-bold leading-none">Kaafi</div>
                  <h3 className="font-bold text-sm tracking-wide mt-2">{TRANSLATIONS[currentLanguage].receiptTitle}</h3>
                  <p className="text-[10px] text-slate-500">{TRANSLATIONS[currentLanguage].receiptSub}</p>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1 text-[10px] leading-none">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-bold text-slate-950">{showReceiptModal.id.replace("sale_", "KFI-")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(showReceiptModal.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway:</span>
                    <span className="font-bold">{showReceiptModal.paymentMethod}</span>
                  </div>
                  {showReceiptModal.mobileMoneyNumber && (
                    <div className="flex justify-between">
                      <span>Sender Account:</span>
                      <span>{showReceiptModal.mobileMoneyNumber}</span>
                    </div>
                  )}
                </div>

                {/* Receipt Items list */}
                <div className="space-y-1.5 py-1">
                  {showReceiptModal.items.map((item, id) => (
                    <div key={id} className="flex justify-between text-[11px] leading-tight">
                      <span className="truncate max-w-[200px]">{item.name} x{item.quantity}</span>
                      <span className="font-bold">{formatMoney(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Total settled summary */}
                <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 leading-none">
                  <div className="flex justify-between font-bold text-sm text-slate-950">
                    <span>TOTAL SETTLED:</span>
                    <span>{formatMoney(showReceiptModal.totalAmount)}</span>
                  </div>
                  {currencySymbol === "USD" ? (
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>SOS Equivalent:</span>
                      <span>SOS {(showReceiptModal.totalAmount * 26000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                      <span>USD Equivalent:</span>
                      <span>${showReceiptModal.totalAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Footer and barcode mock */}
                <div className="text-center pt-4 space-y-2 border-t border-slate-100">
                  <div className="mx-auto w-40 h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#1e293b_2px,#1e293b_6px)]"></div>
                  <p className="text-[10px]/snug text-slate-400 italic">Mahadsanid Macmiil. Soo dhowow markale!<br />Thanks for shopping with Kaafi Somali SME.</p>
                </div>
              </div>

              {/* print button controls */}
              <div className="mt-6 flex gap-2.5 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-800 hover:bg-slate-900 text-stone-100 rounded-xl py-2.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
