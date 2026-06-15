import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI helper to avoid crashing the app on startup if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;

// Mock database for subscription status
interface MockSubscription {
  businessId: string;
  status: "active" | "expired" | "grace_period";
  startDate: string;
  endDate: string;
  gracePeriodEnd: string;
  billingIntervalMonths: number;
  totalAmountPaid: number;
  transactionId?: string;
}

interface MockUser {
  businessId: string;
  businessName: string;
  phone: string;
  password?: string;
  createdAt: string;
}

const registeredUsers: Record<string, MockUser> = {
  "kaafi_shop_01": {
    businessId: "kaafi_shop_01",
    businessName: "Kaafi General Shop",
    phone: "0615551122",
    password: "123",
    createdAt: "2026-06-15T00:00:00.000Z"
  }
};

const activeSubscriptions: Record<string, MockSubscription> = {
  "kaafi_shop_01": {
    businessId: "kaafi_shop_01",
    status: "active",
    startDate: "2026-06-15T00:00:00.000Z",
    endDate: "2026-07-15T00:00:00.000Z",
    gracePeriodEnd: "2026-07-18T00:00:00.000Z",
    billingIntervalMonths: 1,
    totalAmountPaid: 20,
    transactionId: "TX-FIRST-99"
  }
};

// Authentication & Trial Engine Endpoints
app.post("/api/v1/auth/register", (req, res) => {
  try {
    const { businessId, businessName, phone, password } = req.body;

    if (!businessId || !businessName || !phone || !password) {
      return res.status(400).json({ error: "Fadlan buuxi dhammaan macluumaadka si aad isu diiwaangeliso." });
    }

    const bIdClean = businessId.replace(/\s+/g, "_").toLowerCase();

    if (registeredUsers[bIdClean]) {
      return res.status(400).json({ error: "Magaca ganacsiga waa la isticmaalay mar hore. Fadlan dooro mid kale!" });
    }

    const phoneExists = Object.values(registeredUsers).some(u => u.phone === phone);
    if (phoneExists) {
      return res.status(400).json({ error: "Lambarka taleefanka waa la isticmaalay mar hore!" });
    }

    const newUser: MockUser = {
      businessId: bIdClean,
      businessName,
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    registeredUsers[bIdClean] = newUser;

    // Create free 2 days trial subscription: "wax time una ogolow marka ugu horeysa 2days oo free ah"
    const now = new Date();
    const trialDays = 2;
    const endDate = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
    const gracePeriodEnd = new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days grace Period

    activeSubscriptions[bIdClean] = {
      businessId: bIdClean,
      status: "active",
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      gracePeriodEnd: gracePeriodEnd.toISOString(),
      billingIntervalMonths: 0, // trial bound
      totalAmountPaid: 0,
      transactionId: "FREE-TRIAL"
    };

    res.json({
      success: true,
      message: "Is-diiwaangelintu waa lagu guulaystay! Waxaad heshay 2 maalmood oo bilaash ah.",
      user: {
        businessId: newUser.businessId,
        businessName: newUser.businessName,
        phone: newUser.phone,
        password: newUser.password
      },
      subscription: activeSubscriptions[bIdClean]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Guuldaro inta lagu jiro diiwaangelinta" });
  }
});

app.post("/api/v1/auth/login", (req, res) => {
  try {
    const { loginKey, password } = req.body;

    if (!loginKey || !password) {
      return res.status(400).json({ error: "Fadlan geli taleefanka ama magaca dukaanka iyo password-ka." });
    }

    const keyClean = loginKey.trim().toLowerCase();
    
    let user = registeredUsers[keyClean];
    if (!user) {
      user = Object.values(registeredUsers).find(u => u.phone === loginKey.trim()) || null;
    }

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Taleefanka ama Password-ka aad gelisay waa khalad!" });
    }

    let sub = activeSubscriptions[user.businessId];
    if (!sub) {
      // Setup trial if first time checking
      const now = new Date();
      const endDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      const gracePeriodEnd = new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      sub = {
        businessId: user.businessId,
        status: "active",
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        gracePeriodEnd: gracePeriodEnd.toISOString(),
        billingIntervalMonths: 0,
        totalAmountPaid: 0,
        transactionId: "FREE-TRIAL"
      };
      activeSubscriptions[user.businessId] = sub;
    }

    // Calculate live expiration
    const now = new Date();
    const endDateObj = new Date(sub.endDate);
    const graceEndObj = new Date(sub.gracePeriodEnd);

    if (now > graceEndObj) {
      sub.status = "expired";
    } else if (now > endDateObj) {
      sub.status = "grace_period";
    } else {
      sub.status = "active";
    }

    res.json({
      success: true,
      message: "Galeen guul leh!",
      user: {
        businessId: user.businessId,
        businessName: user.businessName,
        phone: user.phone,
        password: user.password
      },
      subscription: sub
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Guuldaro lagala kulmay xaqiijinta userka" });
  }
});

// Billing endpoints
app.get("/api/v1/billing/status/:id", (req, res) => {
  const businessId = req.params.id;
  let sub = activeSubscriptions[businessId];
  if (!sub) {
    // Scaffold default sub if not registered
    sub = {
      businessId,
      status: "active",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // fallback to 2 days free
      gracePeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      billingIntervalMonths: 0,
      totalAmountPaid: 0,
      transactionId: "FREE-TRIAL-MIGRATED"
    };
    activeSubscriptions[businessId] = sub;
  }

  // Live calculation of status based on server time
  const now = new Date();
  const endDate = new Date(sub.endDate);
  const graceEnd = new Date(sub.gracePeriodEnd);

  if (now > graceEnd) {
    sub.status = "expired";
  } else if (now > endDate) {
    sub.status = "grace_period";
  } else {
    sub.status = "active";
  }

  res.json(sub);
});

app.post("/api/v1/billing/renew", (req, res) => {
  try {
    const { business_id, months_to_renew, transaction_id } = req.body;

    if (!business_id) {
       return res.status(400).json({ error: "business_id is required." });
    }

    const months = parseInt(months_to_renew, 10);
    if (isNaN(months) || months < 1 || months > 24) {
      return res.status(400).json({ 
        error: "MUDDO KHALAD AH: months_to_renew waa in ay u dhexaysaa 1 ilaa 24 bilood!" 
      });
    }

    if (!transaction_id || transaction_id.trim().length === 0) {
      return res.status(400).json({ 
        error: "FAADLAN GALI: Waa inaad soo dirtaa Transaction ID-ga oo sax ah!" 
      });
    }

    // Pricing calculation
    let totalCost = 0;
    let discountApplied = false;
    if (months === 24) {
      totalCost = 456; // 5% discount: (24 * 20) * 0.95
      discountApplied = true;
    } else {
      totalCost = months * 20;
    }

    // Retrieve or default subscription
    let sub = activeSubscriptions[business_id];
    const baseDate = sub ? new Date(sub.endDate) : new Date();
    // If expired, start from current date
    const startFrom = baseDate.getTime() < Date.now() ? new Date() : baseDate;

    const newEndDate = new Date(startFrom.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    const newGracePeriodEnd = new Date(newEndDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days grace period

    const updatedSub: MockSubscription = {
      businessId: business_id,
      status: "active",
      startDate: new Date().toISOString(),
      endDate: newEndDate.toISOString(),
      gracePeriodEnd: newGracePeriodEnd.toISOString(),
      billingIntervalMonths: months,
      totalAmountPaid: totalCost,
      transactionId: transaction_id
    };

    activeSubscriptions[business_id] = updatedSub;

    // Return receipt payload confirming direct payment target
    res.json({
      success: true,
      message: "Cusboonaysiinta app-ka waa lagu guulaystay!",
      forcedTarget: "38577675",
      subscription: updatedSub,
      billingHistory: {
        id: "bill_" + Date.now(),
        businessId: business_id,
        amount: totalCost,
        discountApplied,
        monthsPaid: months,
        repaymentAccount: "38577675",
        transactionId: transaction_id,
        createdAt: new Date().toISOString()
      }
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message || "Billing update error" });
  }
});

function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in the Secrets panel inside AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Real-Time QR Payment Synchronization Database
interface PaymentTx {
  txId: string;
  amount: number;
  merchantPhone: string;
  merchantName: string;
  status: "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

const activePayments: Record<string, PaymentTx> = {};

// Create custom QR invoice mapping
app.post("/api/v1/payments/create", (req, res) => {
  try {
    const { amount, merchantPhone, merchantName } = req.body;
    if (!amount || !merchantPhone) {
      return res.status(400).json({ error: "Missing required amount or merchantPhone" });
    }
    const txId = "KFI-" + Math.floor(100000 + Math.random() * 900000);
    const newTx: PaymentTx = {
      txId,
      amount: parseFloat(amount),
      merchantPhone,
      merchantName: merchantName || "Kaafi SME Merchant",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    activePayments[txId] = newTx;
    res.json({ success: true, txId, status: "pending" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Check status of payment invoice
app.get("/api/v1/payments/status/:txId", (req, res) => {
  const txObj = activePayments[req.params.txId];
  if (!txObj) {
    return res.status(404).json({ error: "Transaction invoice not found" });
  }
  res.json(txObj);
});

// Customer executes payment mobile USSD simulation
app.post("/api/v1/payments/pay", (req, res) => {
  const { txId } = req.body;
  const txObj = activePayments[txId];
  if (!txObj) {
    return res.status(404).json({ error: "Transaction invoice not found" });
  }
  txObj.status = "paid";
  txObj.paidAt = new Date().toISOString();
  res.json({ success: true, status: "paid" });
});

// Business AI Assistant proxy / API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    
    // Fallback if the user does not have a Gemini API Key setup
    if (!process.env.GEMINI_API_KEY) {
      // Return a simulated, helpful mock response with a badge indicating high-quality local analysis
      const localResponse = getMockAIResponse(message, context);
      return res.json({
        text: localResponse,
        provider: "Local Rule Engine (Demo Mode)",
        requiresKey: true
      });
    }

    const ai = getGenAIClient();
    
    // Inject the Somali SME context into the system instructions to specialize the Gemini response
    const systemPrompt = `You are Kaafi Assistant, an expert AI SME Business and Management Consultant specialized in Somali small and medium enterprises.
Our business owner operates in Somalia and manages transactional records in Somali Shillings (SOS) and US Dollars (USD).
The standard exchange rate is approx 1 USD = 26,000 SOS.

You are provided with real-time live business summary metrics to ground your answers:
${JSON.stringify(context || {}, null, 2)}

Ensure your answer is friendly, expert, highly specific, and answers directly using the numbers/claims provided.
Support mixing Somali and English naturally (Somalish) if appropriate for Somali merchants, or keep it professional in either language according to the user's input.
Suggest exact strategies to improve cash flow, reduce low stock alerts, send reminders to owing customers, and maximize profitability.
Format your output with clean Markdown bold headers and bullet points.`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    // Send history if present, or a singular message
    const formattedMessage = history && history.length > 0 
      ? `User question: ${message}\n\nPlease analyze and incorporate our fresh dashboard data described in the system context.`
      : message;

    const response = await chat.sendMessage({ message: formattedMessage });
    
    res.json({
      text: response.text,
      provider: "Gemini 3.5 Flash"
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: error.message || "Something went wrong on the server while communicating with the AI model.",
      isKeyError: !process.env.GEMINI_API_KEY
    });
  }
});

// A rule-based demo solver for high-fidelity fallback when GEMINI_API_KEY is not defined in user secrets
function getMockAIResponse(message: string, context: any = {}): string {
  const norm = message.toLowerCase();
  const summary = context.summary || {};
  const products = context.products || [];
  const customers = context.customers || [];
  
  if (norm.includes("profit")) {
    const profitUsd = summary.profitUsd || 1540;
    const salesUsd = summary.todaySalesUsd || 450;
    return `### **Magaalada AI: Profit & Loss Analysis (Demo Mode)**
Mahadsanid! Based on your live metrics:
- **This Month's Margin**: Your current gross profit is **$${profitUsd.toLocaleString()}** (approx **SOS ${(profitUsd * 26000).toLocaleString()}**).
- **Today's Activity**: Sales reached **$${salesUsd}**, with an operating margin of roughly **35%**.
- **Assessment**: Your expenses are well-contained. However, to boost profitability by another 12%, consider focusing on restocking high-margin categories (like pharmaceuticals/supermarket imports) and clearing active customer debts.`;
  }
  
  if (norm.includes("stock") || norm.includes("product") || norm.includes("running out")) {
    const lowStock = products.filter((p: any) => p.stock <= p.minStock) || [];
    const sellMost = products.find((p: any) => p.id === "p1")?.name || "Premium Somali Camel Milk";
    return `### **Bakhaarka AI: Inventory Alert (Demo Mode)**
Your live inventory shows the following details:
- **Top Selling Product**: **${sellMost}** is moving at high velocity (34 units sold).
- **Low Stock Alerts**: There are **${lowStock.length || 2} items** below critical thresholds. 
  - *Must Restock urgently*: **Hormuud Recharge vouchers (100 SOS)** and **Anfar Camels Milk**.
- **Action Plan**: Place a Restock Purchase Order to suppliers via your **Suppliers Module** immediately to prevent stockouts during evening sales.`;
  }
  
  if (norm.includes("owe") || norm.includes("debt") || norm.includes("money")) {
    const debtors = customers.filter((c: any) => c.debt > 0) || [];
    const totalDebt = debtors.reduce((acc: number, c: any) => acc + c.debt, 0) || 540;
    return `### **Dahabka AI: Debt Tracker Summary (Demo Mode)**
Your Outstanding Debts require attention:
- **Total Outstanding Balance**: Somali Shilling equivalent of **$${totalDebt}** (approx **SOS ${(totalDebt * 26000).toLocaleString()}**).
- **Active Debtors**: You have **${debtors.length || 3} customers** owing money.
- **Top Due**: **Guled Farah** (Owing **$210.00**, overdue by 4 days).
- **Automated Collection**: I suggest compiling SMS / WhatsApp templates in the **Debts Module** and dispatching due reminders today!`;
  }

  return `### **Kaafi Enterprise Coach (Demo Mode)**
Macaan! I am Kaafi AI, optimized for Somali business operations (EVC Plus, eDahab). 
I'm running in local analysis mode because your **GEMINI_API_KEY** was not found in AI Studio Secrets.

You can ask me questions such as:
1. *"How much profit did I make this month?"*
2. *"Which products are running out of stock?"*
3. *"Who owes me money and when is it due?"*

**Current Business Pulse:**
- **Sales Today**: $${summary.todaySalesUsd || 450} (SOS ${((summary.todaySalesUsd || 450) * 26000).toLocaleString()})
- **Active Customer Debts**: $${summary.outstandingDebtsUsd || 540}
- **Low Stock Level**: 2 Items remaining.`;
}

// Vite middleware configuration for development, static serve for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is securely running on http://localhost:${PORT}`);
  });
}

startServer();
