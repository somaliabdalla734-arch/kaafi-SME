import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, HelpCircle, Loader, RefreshCw, AlertTriangle } from "lucide-react";
import { Product, CustomerDebt, Expense, Supplier, Sale } from "../types";

interface AIAssistantProps {
  products: Product[];
  customers: CustomerDebt[];
  expenses: Expense[];
  suppliers: Supplier[];
  sales: Sale[];
  currentLanguage: "en" | "so";
  onAddNewProduct?: (p: Product) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
  provider?: string;
  requiresKey?: boolean;
}

export default function AIAssistant({
  products,
  customers,
  expenses,
  suppliers,
  sales,
  currentLanguage
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default welcome message based on language selector
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "ai",
          text: currentLanguage === "so"
            ? "Macaan! Soo dhawoow Kaafi AI Assistant. Waxaan ahay la-taliyahaaga ganacsiga. I weydii wax ku saabsan faa'iidada, alaabta ka dhiman bakhaarka, ama macaamiisha deynta kugu leh!"
            : "Somaliland & Somalia Business Consultant online! I am Kaafi AI, your store advisor. Ask me questions about today's profits, cash flow, low stock, or customer debts!",
          timestamp: new Date(),
          provider: "Local Knowledge Engine"
        }
      ]);
    }
  }, [currentLanguage]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getSmeContext = () => {
    // Generate high-fidelity analytical counters to pass to Gemini
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalValuation = products.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0);
    const outstandingDebts = customers.reduce((sum, c) => sum + c.debtAmount, 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
    
    return {
      summary: {
        todaySalesUsd: sales.filter(s => s.timestamp.startsWith("2026-06-15")).reduce((acc, s) => acc + s.totalAmount, 0),
        totalSalesUsd: totalSales,
        totalExpensesUsd: totalExpenses,
        profitUsd: totalSales - totalExpenses,
        outstandingDebtsUsd: outstandingDebts,
        inventoryValueUsd: totalValuation,
        lowStockItemsCount: lowStockCount
      },
      products: products.map(p => ({
        name: p.name,
        stock: p.stock,
        minStock: p.minStock,
        price: p.sellingPrice,
        sku: p.sku
      })),
      customers: customers.map(c => ({
        name: c.name,
        debt: c.debtAmount,
        dueDate: c.dueDate
      })),
      expenses: expenses.map(e => ({
        description: e.description,
        amount: e.amount,
        category: e.category
      }))
    };
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "user_" + Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: getSmeContext(),
          // Filter down history to prevent tokens pollution
          history: messages.slice(-6).map(m => ({
            role: m.sender === "user" ? "user" : "model",
            parts: [{ text: m.text }]
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with service agent network.");
      }

      const resData = await response.json();
      
      setMessages(prev => [...prev, {
        id: "ai_" + Math.random().toString(),
        sender: "ai",
        text: resData.text,
        timestamp: new Date(),
        provider: resData.provider,
        requiresKey: resData.requiresKey
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "err_" + Math.random().toString(),
        sender: "ai",
        text: currentLanguage === "so"
          ? "Raali ahoow, cilad baa dhacday intii lala xiriirayay sirdoonka macmalka ah. Fadlan dib u tijaabi ama hubi in GEMINI_API_KEY uu sax weyn ku jiro Secrets panel-ka."
          : "Sorry, an connection issue occurred with the AI system. Please verify your internet connection or check if your GEMINI_API_KEY is configured inside the Secrets panel inside the app Settings.",
        timestamp: new Date(),
        provider: "Offline Diagnostics Engine"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const chips = currentLanguage === "so" ? [
    { text: "Intee faa'iido ayaan sameeyay bishan?", query: "How much profit did I make this month?" },
    { text: "Waa kuwee alaabta ka dhiman bakhaarka?", query: "Which products are running out of stock?" },
    { text: "Yaa deyn nagu leh oo muddo dhaafay?", query: "Who owes me money?" },
    { text: "I sii warbixin kooban oo ku saabsan ganacsiga", query: "Give me an expert, high-level business analysis update." }
  ] : [
    { text: "How much profit did I make this month?", query: "How much profit did I make this month?" },
    { text: "Which products are running out of stock?", query: "Which products are running out of stock?" },
    { text: "Who owes me money and outstanding debt?", query: "Who owes me money?" },
    { text: "Analyze business metrics briefly", query: "Give me an expert, high-level business analysis update." }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-indigo-700 px-4 py-3 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse animate-duration-1000" />
          <div>
            <h3 className="font-bold text-sm tracking-wide">Kaafi AI Intelligence Coach</h3>
            <p className="text-xs text-teal-100 flex items-center gap-1 leading-none mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              {currentLanguage === "so" ? "Sirdoonka Macmalka ah" : "Gemini Real-Time Business Grounding"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`p-2 rounded-lg flex items-center justify-center h-8 w-8 shrink-0 ${m.sender === "user" ? "bg-teal-600 text-white" : "bg-indigo-600 text-white"}`}>
              {m.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            </div>
            <div className="flex flex-col max-w-[82%]">
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.sender === "user" 
                  ? "bg-teal-50 text-slate-800 border-teal-100 border-b-2 rounded-tr-none" 
                  : "bg-white text-slate-800 border-indigo-100 border-b-2 rounded-tl-none"
              }`}>
                {/* Parse basic markdown header and custom bullets */}
                <div className="whitespace-pre-wrap space-y-1 font-sans">
                  {m.text.split("\n").map((line, i) => {
                    if (line.startsWith("###")) {
                      return <h4 key={i} className="font-bold text-slate-900 border-b border-slate-100 pb-1 mt-2 text-sm">{line.replace("###", "").trim()}</h4>;
                    }
                    if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
                      return <li key={i} className="ml-3 list-disc pl-1 text-slate-700">{line.replace(/^[-*]\s*/, "")}</li>;
                    }
                    return <p key={i} className="text-slate-700">{line}</p>;
                  })}
                </div>
                
                {/* Notice badge if running on developer local solver */}
                {m.requiresKey && (
                  <div className="mt-3 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-lg flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <span className="font-bold">Sandbox Demo Mode:</span> Add your own <code className="font-mono bg-amber-100 px-1 rounded text-amber-900 text-[10px]">GEMINI_API_KEY</code> in <b>Settings &gt; Secrets</b> to connect this chatbot to the live Gemini 3.5 cloud models.
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 flex justify-between">
                <span>{m.provider || "Gemini Core"}</span>
                <span>{m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white flex items-center justify-center h-8 w-8 shrink-0">
              <Loader className="w-4 h-4 animate-spin text-amber-300" />
            </div>
            <div className="bg-white border border-indigo-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300"></span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {currentLanguage === "so" ? "Kaafi AI wuxuu xisaabinayaa xogta..." : "AI calculating database state..."}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 border-t border-slate-200 scrollbar-none">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            disabled={loading}
            className="text-xs bg-white text-slate-700 hover:text-teal-700 hover:bg-teal-50 border border-slate-300 hover:border-teal-300 px-2.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50 font-medium"
          >
            {chip.text}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="bg-white border-t border-slate-200 p-2.5 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={currentLanguage === "so" ? "Suxufi weydii Kaafi AI..." : "Ask your business assistant..."}
          disabled={loading}
          className="flex-1 bg-slate-50 focus:bg-white text-sm border border-slate-300 focus:border-teal-500 rounded-xl px-3.5 py-2 hover:bg-slate-100 focus:outline-none transition-all disabled:opacity-75 text-slate-800"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
