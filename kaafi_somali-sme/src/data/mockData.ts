import { Product, CustomerDebt, Expense, Supplier, Sale } from "../types";

export const INITIAL_CATEGORIES = [
  "General Medicines (Daawooyinka Guud)",
  "Antibiotics & Infection (Kahortagga Jeermiska)",
  "Pain & Fever Relief (Sifaynta Xanuunka)",
  "Stomach & Acid Reflux (Caloosha & Gaaska)",
  "Chronic Illnesses (Sonkor & Dhiigkar)",
  "Cough, Cold & Resp (Hargabka & Neefta)",
  "Baby & Mother Care (Hooyada & Ilmaha)",
  "Vitamins & Supplements (Fiitamiino)"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Paracetamol 500mg (20x Tablets)",
    sku: "KFI-PHAR-001",
    barcode: "615123456001",
    category: "Pain & Fever Relief (Sifaynta Xanuunka)",
    purchasePrice: 0.15,
    sellingPrice: 0.50,
    stock: 120,
    minStock: 20,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p2",
    name: "Amoxicillin 500mg Capsules (Antibiotic)",
    sku: "KFI-PHAR-002",
    barcode: "615123456002",
    category: "Antibiotics & Infection (Kahortagga Jeermiska)",
    purchasePrice: 0.80,
    sellingPrice: 2.00,
    stock: 45,
    minStock: 10,
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p3",
    name: "Flutab Gold (Cold & Flu Somali Choice)",
    sku: "KFI-PHAR-003",
    barcode: "615123456003",
    category: "Cough, Cold & Resp (Hargabka & Neefta)",
    purchasePrice: 0.60,
    sellingPrice: 1.50,
    stock: 80,
    minStock: 15,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p4",
    name: "Ibuprofen 400mg Pain Relief Tablets",
    sku: "KFI-PHAR-004",
    barcode: "615123456004",
    category: "Pain & Fever Relief (Sifaynta Xanuunka)",
    purchasePrice: 0.25,
    sellingPrice: 0.80,
    stock: 65,
    minStock: 10,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p5",
    name: "Ciprofloxacin 500mg Tablets (Antibiotic)",
    sku: "KFI-PHAR-005",
    barcode: "615123456005",
    category: "Antibiotics & Infection (Kahortagga Jeermiska)",
    purchasePrice: 1.20,
    sellingPrice: 3.50,
    stock: 35,
    minStock: 8,
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p6",
    name: "Metformin 500mg (Diabetes Control)",
    sku: "KFI-PHAR-006",
    barcode: "615123456006",
    category: "Chronic Illnesses (Sonkor & Dhiigkar)",
    purchasePrice: 0.90,
    sellingPrice: 2.20,
    stock: 42,
    minStock: 10,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p7",
    name: "Amlodipine 5mg (Blood Pressure - Dhiigkar)",
    sku: "KFI-PHAR-007",
    barcode: "615123456007",
    category: "Chronic Illnesses (Sonkor & Dhiigkar)",
    purchasePrice: 1.10,
    sellingPrice: 2.80,
    stock: 30,
    minStock: 5,
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p8",
    name: "Omeprazole 20mg Capsules (Gaas & Acid)",
    sku: "KFI-PHAR-008",
    barcode: "615123456008",
    category: "Stomach & Acid Reflux (Caloosha & Gaaska)",
    purchasePrice: 0.30,
    sellingPrice: 1.00,
    stock: 95,
    minStock: 20,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p9",
    name: "Gaviscon Liquid Syrup - 150ml (Gaaska)",
    sku: "KFI-PHAR-009",
    barcode: "615123456009",
    category: "Stomach & Acid Reflux (Caloosha & Gaaska)",
    purchasePrice: 2.15,
    sellingPrice: 4.80,
    stock: 18,
    minStock: 4,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p10",
    name: "Salbutamol Asthma Inhaler (100mcg)",
    sku: "KFI-PHAR-010",
    barcode: "615123456010",
    category: "Cough, Cold & Resp (Hargabka & Neefta)",
    purchasePrice: 1.80,
    sellingPrice: 4.50,
    stock: 12,
    minStock: 3,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p11",
    name: "Multivitamin A-Z Complete (60 Tablets)",
    sku: "KFI-PHAR-011",
    barcode: "615123456011",
    category: "Vitamins & Supplements (Fiitamiino)",
    purchasePrice: 3.50,
    sellingPrice: 7.50,
    stock: 24,
    minStock: 5,
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60"
  },
  {
    id: "p12",
    name: "ORS Oral Rehydration Salts (Sachet)",
    sku: "KFI-PHAR-012",
    barcode: "615123456012",
    category: "Baby & Mother Care (Hooyada & Ilmaha)",
    purchasePrice: 0.12,
    sellingPrice: 0.40,
    stock: 150,
    minStock: 15,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60"
  }
];

export const INITIAL_CUSTOMERS: CustomerDebt[] = [
  {
    id: "c1",
    name: "Guled Farah",
    phone: "0615432901",
    debtAmount: 12.50,
    dueDate: "2026-06-25",
    history: [
      { id: "dh1", amount: 12.50, type: "BORROW", date: "2026-06-05", note: "Flutab & Amoxicillin prescription" }
    ]
  },
  {
    id: "c2",
    name: "Xaawo Cilmi",
    phone: "0618223344",
    debtAmount: 4.80,
    dueDate: "2026-06-18",
    history: [
      { id: "dh3", amount: 4.80, type: "BORROW", date: "2026-06-12", note: "Gaviscon Liquid Syrup prescription" }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: "s1",
    name: "Somali Pharma Distributors Ltd",
    company: "SomPharma Group",
    phone: "0615020101",
    dueBalance: 240.00,
    history: [
      { id: "sh1", amount: 500.00, type: "PURCHASE", date: "2026-06-01", note: "Bulk delivery of Paracetamol & Antibiotics" },
      { id: "sh2", amount: 260.00, type: "PAYMENT", date: "2026-06-05", note: "Partial payout via Premier Wallet" }
    ]
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "e1",
    description: "Pharmacy Shop Monthly Rent",
    category: "RENT",
    amount: 150.00,
    date: "2026-06-01"
  },
  {
    id: "e2",
    description: "Pharmacy Fridge Electricity Backup",
    category: "UTILITIES",
    amount: 45.00,
    date: "2026-06-05"
  }
];

export const PRESEEDED_SALES: Sale[] = [
  {
    id: "s_p1",
    items: [
      { productId: "p1", name: "Paracetamol 500mg (20x Tablets)", quantity: 2, price: 0.50 },
      { productId: "p3", name: "Flutab Gold (Cold & Flu Somali Choice)", quantity: 1, price: 1.50 }
    ],
    totalAmount: 2.50,
    paymentMethod: "EVC_PLUS",
    mobileMoneyNumber: "0615432981",
    timestamp: "2026-06-15T09:30:00.000Z",
    status: "COMPLETED",
    receivedAmount: 2.50
  },
  {
    id: "s_p2",
    items: [
      { productId: "p8", name: "Omeprazole 20mg Capsules (Gaas & Acid)", quantity: 3, price: 1.00 }
    ],
    totalAmount: 3.00,
    paymentMethod: "CASH",
    timestamp: "2026-06-15T10:15:00.000Z",
    status: "COMPLETED",
    receivedAmount: 5.00
  }
];
