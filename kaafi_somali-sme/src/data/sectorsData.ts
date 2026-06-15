import { Product } from "../types";

export type BusinessSector = "pharmacy" | "market" | "cafe" | "electronics";

export interface SectorConfig {
  id: BusinessSector;
  nameEn: string;
  nameSo: string;
  emoji: string;
  categories: string[];
  products: Product[];
}

export const SECTORS_CONFIG: Record<BusinessSector, SectorConfig> = {
  market: {
    id: "market",
    nameEn: "Supermarket & Grocery",
    nameSo: "Suuqa & Jumlada (Market)",
    emoji: "🛒",
    categories: [
      "Dairy & Milk (Caano)",
      "Grains & Cereals (Boorash & Bariis)",
      "Pasta & Oil (Baasto & Saliid)",
      "Frozen & Ice Cream (Ais-kiriim)",
      "Beverages & Soft Drinks (Cabitaano)",
      "Daily Household (Agabka Guriga)",
      "Spices & Tea (Caleen & Baarat)"
    ],
    products: [
      {
        id: "m1",
        name: "Caano Boore Nido (Powdered Milk - 900g)",
        sku: "KFI-MRKT-001",
        barcode: "615993456101",
        category: "Dairy & Milk (Caano)",
        purchasePrice: 6.50,
        sellingPrice: 8.00,
        stock: 45,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m2",
        name: "Gasac Caano Boore (Dilano Canned Milk)",
        sku: "KFI-MRKT-002",
        barcode: "615993456102",
        category: "Dairy & Milk (Caano)",
        purchasePrice: 0.80,
        sellingPrice: 1.20,
        stock: 120,
        minStock: 20,
        imageUrl: "https://images.unsplash.com/photo-1549468057-5b7fa1a41d7a?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m3",
        name: "Boorashka Cad ee Boorsada (Somali Oatmeal)",
        sku: "KFI-MRKT-003",
        barcode: "615993456103",
        category: "Grains & Cereals (Boorash & Bariis)",
        purchasePrice: 1.50,
        sellingPrice: 2.20,
        stock: 80,
        minStock: 10,
        imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m4",
        name: "Bariis Basmati Barako Super (5kg Bag)",
        sku: "KFI-MRKT-004",
        barcode: "615993456104",
        category: "Grains & Cereals (Boorash & Bariis)",
        purchasePrice: 4.80,
        sellingPrice: 6.50,
        stock: 60,
        minStock: 8,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m5",
        name: "Bariis Cad ee Jaban (1kg Retail Pack)",
        sku: "KFI-MRKT-005",
        barcode: "615993456105",
        category: "Grains & Cereals (Boorash & Bariis)",
        purchasePrice: 0.90,
        sellingPrice: 1.30,
        stock: 150,
        minStock: 25,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m6",
        name: "Baasto Somfood Local Made (500g Pack)",
        sku: "KFI-MRKT-006",
        barcode: "615993456106",
        category: "Pasta & Oil (Baasto & Saliid)",
        purchasePrice: 0.45,
        sellingPrice: 0.70,
        stock: 200,
        minStock: 30,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m7",
        name: "Saliidda Macaan Hayat (Pure Cooking Oil - 3L)",
        sku: "KFI-MRKT-007",
        barcode: "615993456107",
        category: "Pasta & Oil (Baasto & Saliid)",
        purchasePrice: 4.20,
        sellingPrice: 5.50,
        stock: 40,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m8",
        name: "Saliid Cad ee Safeeyna Extra (1 Litre)",
        sku: "KFI-MRKT-008",
        barcode: "615993456108",
        category: "Pasta & Oil (Baasto & Saliid)",
        purchasePrice: 1.60,
        sellingPrice: 2.20,
        stock: 75,
        minStock: 12,
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m9",
        name: "Ice Cream Scoop Cup (Strawberry & Vanilla)",
        sku: "KFI-MRKT-009",
        barcode: "615993456109",
        category: "Frozen & Ice Cream (Ais-kiriim)",
        purchasePrice: 0.60,
        sellingPrice: 1.20,
        stock: 50,
        minStock: 10,
        imageUrl: "https://images.unsplash.com/photo-1501443721117-37d40d73c415?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m10",
        name: "Sonkor Cad ee Barkac (Premium White Sugar - 1kg)",
        sku: "KFI-MRKT-010",
        barcode: "615993456110",
        category: "Daily Household (Agabka Guriga)",
        purchasePrice: 0.85,
        sellingPrice: 1.20,
        stock: 180,
        minStock: 20,
        imageUrl: "https://images.unsplash.com/photo-1581447101795-7fd29fb5aa6a?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m11",
        name: "Shaah Caleen Lipton (Teabag Box - 100 Pcs)",
        sku: "KFI-MRKT-011",
        barcode: "615993456111",
        category: "Spices & Tea (Caleen & Baarat)",
        purchasePrice: 1.95,
        sellingPrice: 2.80,
        stock: 35,
        minStock: 6,
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "m12",
        name: "Koka Kola (Coca-Cola Somali Cold Can)",
        sku: "KFI-MRKT-012",
        barcode: "615993456112",
        category: "Beverages & Soft Drinks (Cabitaano)",
        purchasePrice: 0.35,
        sellingPrice: 0.60,
        stock: 240,
        minStock: 40,
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&auto=format&fit=crop&q=60"
      }
    ]
  },
  pharmacy: {
    id: "pharmacy",
    nameEn: "Pharmacy & Medical",
    nameSo: "Farmashiye (Pharmacy)",
    emoji: "💊",
    categories: [
      "Pain & Fever Relief (Sifaynta Xanuunka)",
      "Antibiotics & Infection (Kahortagga Jeermiska)",
      "Stomach & Acid Reflux (Caloosha & Gaaska)",
      "Chronic Illnesses (Sonkor & Dhiigkar)",
      "Cough, Cold & Resp (Hargabka & Neefta)",
      "Baby & Mother Care (Hooyada & Ilmaha)",
      "Vitamins & Supplements (Fiitamiino)"
    ],
    products: [
      {
        id: "p1",
        name: "Paracetamol 500mg Tablets (20x Pack)",
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
      }
    ]
  },
  cafe: {
    id: "cafe",
    nameEn: "Café & Maqaayada (Restaurant)",
    nameSo: "Kafeega & Restoranka",
    emoji: "☕",
    categories: [
      "Hot Coffee & Espresso (Kafeega Kulul)",
      "Traditional Somali Teas (Shaaha)",
      "Tasty Fast Food (Cunto Fudud)",
      "Main Course Dishes (Qado & Casho)",
      "Cabitaan Fresh ah (Fruit Juices)"
    ],
    products: [
      {
        id: "c1",
        name: "Qaxwo Carabi Cup (Arabic Saffron Coffee)",
        sku: "KFI-REST-001",
        barcode: "615443456201",
        category: "Hot Coffee & Espresso (Kafeega Kulul)",
        purchasePrice: 0.30,
        sellingPrice: 0.80,
        stock: 250,
        minStock: 15,
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c2",
        name: "Koob Macchiato ah (Italian Style)",
        sku: "KFI-REST-002",
        barcode: "615443456202",
        category: "Hot Coffee & Espresso (Kafeega Kulul)",
        purchasePrice: 0.25,
        sellingPrice: 0.60,
        stock: 350,
        minStock: 20,
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c3",
        name: "Shaah Cadays Carwo (Cardamom Spiced Milk Tea)",
        sku: "KFI-REST-003",
        barcode: "615443456203",
        category: "Traditional Somali Teas (Shaaha)",
        purchasePrice: 0.15,
        sellingPrice: 0.40,
        stock: 450,
        minStock: 30,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c4",
        name: "Shaah Rinjiga (Somali Black Tea)",
        sku: "KFI-REST-004",
        barcode: "615443456204",
        category: "Traditional Somali Teas (Shaaha)",
        purchasePrice: 0.08,
        sellingPrice: 0.25,
        stock: 500,
        minStock: 40,
        imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c5",
        name: "Pasta Iyo Hilib Ari (Spaghetti with Somali Goat Meat)",
        sku: "KFI-REST-005",
        barcode: "615443456205",
        category: "Main Course Dishes (Qado & Casho)",
        purchasePrice: 3.50,
        sellingPrice: 6.00,
        stock: 40,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c6",
        name: "Bariis Iyo Hilib Ari Super (Rice with Goat Meat)",
        sku: "KFI-REST-006",
        barcode: "615443456206",
        category: "Main Course Dishes (Qado & Casho)",
        purchasePrice: 3.50,
        sellingPrice: 6.00,
        stock: 40,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c7",
        name: "Sambuusa Hilib (Somali Minced Meat Samosa)",
        sku: "KFI-REST-007",
        barcode: "615443456207",
        category: "Tasty Fast Food (Cunto Fudud)",
        purchasePrice: 0.15,
        sellingPrice: 0.35,
        stock: 180,
        minStock: 15,
        imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "c8",
        name: "Fresh Mango Grapefruit Juice (Mix Juice)",
        sku: "KFI-REST-008",
        barcode: "615443456208",
        category: "Cabitaan Fresh ah (Fruit Juices)",
        purchasePrice: 0.60,
        sellingPrice: 1.50,
        stock: 90,
        minStock: 10,
        imageUrl: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=150&auto=format&fit=crop&q=60"
      }
    ]
  },
  electronics: {
    id: "electronics",
    nameEn: "Electronics & General",
    nameSo: "Elektarooniga & Guud",
    emoji: "🔌",
    categories: [
      "Mobile Accessories (Qalabka Mobidada)",
      "Chargers & Power (Dabayl & Koronto)",
      "Smartphones & Gadgets (Taleefoonno)",
      "Audio & Headsets (Samaacado)"
    ],
    products: [
      {
        id: "e1",
        name: "USB Type-C Fast Charger Cable (1.5M)",
        sku: "KFI-ELEC-001",
        barcode: "615773456301",
        category: "Chargers & Power (Dabayl & Koronto)",
        purchasePrice: 1.20,
        sellingPrice: 3.00,
        stock: 75,
        minStock: 8,
        imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "e2",
        name: "18W Fast Charger Brick (Somali standard pin)",
        sku: "KFI-ELEC-002",
        barcode: "615773456302",
        category: "Chargers & Power (Dabayl & Koronto)",
        purchasePrice: 2.50,
        sellingPrice: 5.50,
        stock: 35,
        minStock: 5,
        imageUrl: "https://images.unsplash.com/photo-1609101863597-ed69db189e41?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "e3",
        name: "Redmi Note 12 Premium Phone (128GB)",
        sku: "KFI-ELEC-003",
        barcode: "615773456303",
        category: "Smartphones & Gadgets (Taleefoonno)",
        purchasePrice: 145.00,
        sellingPrice: 175.00,
        stock: 12,
        minStock: 2,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "e4",
        name: "M90 Pro Bluetooth Wireless Airbud pods",
        sku: "KFI-ELEC-004",
        barcode: "615773456304",
        category: "Audio & Headsets (Samaacado)",
        purchasePrice: 4.80,
        sellingPrice: 9.50,
        stock: 45,
        minStock: 6,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=60"
      },
      {
        id: "e5",
        name: "Power Bank 20,000mAh (Heavy Duty backup)",
        sku: "KFI-ELEC-005",
        barcode: "615773456305",
        category: "Chargers & Power (Dabayl & Koronto)",
        purchasePrice: 8.50,
        sellingPrice: 15.00,
        stock: 22,
        minStock: 4,
        imageUrl: "https://images.unsplash.com/photo-1609101863597-ed69db189e41?w=150&auto=format&fit=crop&q=60"
      }
    ]
  }
};
