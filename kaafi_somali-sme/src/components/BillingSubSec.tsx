import React, { useState, useEffect } from "react";
import { CreditCard, Shield, Sliders, Check, AlertCircle, RefreshCw, Copy, CheckCircle2, DollarSign } from "lucide-react";

interface BillingSubSecProps {
  currentLanguage: "en" | "so";
  formatMoney: (amountUsd: number) => string;
  businessId: string;
  onStatusUpdated?: (newStatus: any) => void;
}

interface SubscriptionStatus {
  businessId: string;
  status: "active" | "expired" | "grace_period";
  startDate: string;
  endDate: string;
  gracePeriodEnd: string;
  billingIntervalMonths: number;
  totalAmountPaid: number;
  transactionId?: string;
}

interface BillingReceipt {
  id: string;
  businessId: string;
  amount: number;
  discountApplied: boolean;
  monthsPaid: number;
  repaymentAccount: string;
  transactionId: string;
  createdAt: string;
}

export default function BillingSubSec({ currentLanguage, formatMoney, businessId, onStatusUpdated }: BillingSubSecProps) {
  const [months, setMonths] = useState<number>(1);
  const [transactionId, setTransactionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(true);
  
  // Status states
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [receipts, setReceipts] = useState<BillingReceipt[]>([
    {
      id: "bill_pre_01",
      businessId: businessId || "kaafi_shop_01",
      amount: 20,
      discountApplied: false,
      monthsPaid: 1,
      repaymentAccount: "38577675",
      transactionId: "TX-FIRST-99",
      createdAt: "2026-06-15T00:00:00.000Z"
    }
  ]);
  
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [successLocal, setSuccessLocal] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  const officialPricePerMonth = 20;
  const merchantAccount = "38577675";

  // Dynamic price calculation
  const getPricingDetails = () => {
    if (months === 24) {
      const original = officialPricePerMonth * 24;
      const finalPrice = original * 0.95; // 5% discount
      return {
        original,
        finalPrice,
        discountApplied: true,
        discountAmount: original - finalPrice // $24 saved
      };
    }
    return {
      original: officialPricePerMonth * months,
      finalPrice: officialPricePerMonth * months,
      discountApplied: false,
      discountAmount: 0
    };
  };

  const pricing = getPricingDetails();

  // Load status from backend
  const fetchSubStatus = async () => {
    try {
      setStatusLoading(true);
      const res = await fetch(`/api/v1/billing/status/${businessId || "kaafi_shop_01"}`);
      if (res.ok) {
        const data = await res.json();
        setSubStatus(data);
        if (onStatusUpdated) {
          onStatusUpdated(data);
        }
      }
    } catch (err) {
      console.error("Error loading subscription status:", err);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchSubStatus();
  }, [businessId]);

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setErrorLocal(
        currentLanguage === "so"
          ? "FAADLAN GALI: Waa inaad qortaa Transaction ID-ga oo sax ah!"
          : "PLEASE ENTER: You must specify a valid transfer Transaction ID!"
      );
      return;
    }

    setErrorLocal(null);
    setSuccessLocal(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/billing/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId || "kaafi_shop_01",
          months_to_renew: months,
          transaction_id: transactionId
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        setErrorLocal(resData.error || "Cusboonaysiinta rukunka waa guuldareysatay.");
      } else {
        setSuccessLocal(
          currentLanguage === "so"
            ? `CUSBOONAYSIIN GUUL LEH! App-ka ku cusboonaysiiyay ${months} bilood. Expiry: ${new Date(resData.subscription.endDate).toLocaleDateString()}`
            : `RENEWED SUCCESS! App extended by ${months} months. New expiry: ${new Date(resData.subscription.endDate).toLocaleDateString()}`
        );
        // Refresh subscription state
        setSubStatus(resData.subscription);
        if (onStatusUpdated) {
          onStatusUpdated(resData.subscription);
        }
        // Prepend new billing receipt log
        if (resData.billingHistory) {
          setReceipts(prev => [resData.billingHistory, ...prev]);
        }
        setTransactionId(""); // Clear input
      }
    } catch (err: any) {
      setErrorLocal(err.message || "Xariirka server-ka waa uu katay.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountToClipboard = () => {
    navigator.clipboard.writeText(merchantAccount);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  // Localized string packs
  const text = {
    title: currentLanguage === "so" ? "MAAMULKA BIILASHA KAAFI" : "KAAFI BILLING PORTAL (SaaS)",
    desc: currentLanguage === "so"
      ? "Hoos ka maaree, ka hubi, oo si toos ah uga cusboonaysii rukunka dukaankaaga adoo isticmaalaya EVC Plus ama eDahab."
      : "Verify, oversee, and renew your Somali SME Suite subscription tier directly using EVC Plus & eDahab.",
    statusCardTitle: currentLanguage === "so" ? "Heerka Rukunka Dukaanka" : "Store Subscription Status",
    currentStatus: currentLanguage === "so" ? "Heerka Hadda:" : "Current Level:",
    expiryLabel: currentLanguage === "so" ? "Taariikhda Dhicitaanka:" : "Expiration Date:",
    graceLabel: currentLanguage === "so" ? "Muddada Dheeraadka ah (Grace):" : "Grace Window Expiry:",
    totalPaidLabel: currentLanguage === "so" ? "Guud ahaan intaad bixisay:" : "Total Amount Paid:",
    activeStatus: currentLanguage === "so" ? "Dhaqdhaqaaq nidaamka (Active)" : "Operational / Active",
    graceStatus: currentLanguage === "so" ? "Grace Period (Dib-u-bixinta la rabo)" : "Grace Period (Renewal Due)",
    expiredStatus: currentLanguage === "so" ? "Wuu Dhacay (Locked)" : "Expired / Locked App State",
    step1Title: currentLanguage === "so" ? "1. Dooro muddada (1 ilaa 24 bilood)" : "1. Choose duration (1 to 24 months)",
    step1Subtitle: currentLanguage === "so"
      ? "Dooro inta bilood ee aad u baahantahay (Ugu yaraan 1 bil, 24 bilood u dooro 5% dhimis!)."
      : "Adjust the slider range. Standard rate is $20/m, selecting 24 months unlocks a 5% discount ($456).",
    step2Title: currentLanguage === "so" ? "2. U wareeji lacagta si toos ah" : "2. Transfer payment directly",
    step2Subtitle: currentLanguage === "so"
      ? "Account-kan hoose waa qasab inaad si toos ah ugu soo dirto lacagta u muuqata sanduuqa qiimaha:"
      : "Transfer the calculated amount using your mobile money provider to this official destination:",
    accountNoLabel: currentLanguage === "so" ? "Account-ka Rasmiga: 38577675 (Somalia Client Checkout)" : "Merchant Account: 38577675 (Somalia SME Support)",
    ussdPrefix: currentLanguage === "so" ? "Nidaamka Quick USSD:" : "USSD Command string:",
    step3Title: currentLanguage === "so" ? "3. Xaqiiji Transaction ID-ga" : "3. Verify your Transaction ID",
    step3Subtitle: currentLanguage === "so"
      ? "Marka isgaarsiintu kuu soo dirto fariinta wareejinta xisaabta, ku qor TRANS ID-ga halkan si loo furo app-ka."
      : "Once telecom gateway emits the payment SMS on your phone, paste the Transaction ID code below.",
    historyTitle: currentLanguage === "so" ? "Liiska Taariikhda Biilasha (Billing History)" : "Billing History Ledgers",
    monthsCount: currentLanguage === "so" ? "bilood" : "months",
    transInputLabel: currentLanguage === "so" ? "Transaction ID-ga (EVC Plus / eDahab)" : "Transaction ID (From EVC/eDahab response)",
    renewBtn: currentLanguage === "so" ? "Cusboonaysii App-ka Hadda" : "Renew App Now",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/15 border-emerald-500 text-emerald-400";
      case "grace_period":
        return "bg-amber-500/15 border-amber-500 text-amber-400";
      case "expired":
        return "bg-rose-500/15 border-rose-500 text-rose-400";
      default:
        return "bg-slate-500/15 border-slate-500 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Segment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <CreditCard className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight font-display">{text.title}</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">{text.desc}</p>
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Store subscription status cards and instructions (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Status Display */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 text-slate-200">
            <h4 className="text-xs tracking-widest text-slate-400 uppercase font-bold mb-4 font-mono">
              🛡️ {text.statusCardTitle}
            </h4>

            {statusLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${getStatusColor(subStatus?.status || "active")}`}>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-wider opacity-80">{text.currentStatus}</p>
                    <span className="text-sm font-black uppercase text-white font-sans block mt-1">
                      {subStatus?.status === "active" && text.activeStatus}
                      {subStatus?.status === "grace_period" && text.graceStatus}
                      {subStatus?.status === "expired" && text.expiredStatus}
                    </span>
                  </div>
                  <Shield className="w-6 h-6 shrink-0" />
                </div>

                <div className="bg-slate-900 rounded-xl p-4.5 border border-slate-850 space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{text.expiryLabel}</span>
                    <span className="font-bold text-slate-250">
                      {subStatus ? new Date(subStatus.endDate).toLocaleDateString() : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{text.graceLabel}</span>
                    <span className="font-bold text-amber-400">
                      {subStatus ? new Date(subStatus.gracePeriodEnd).toLocaleDateString() : "---"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-2.5">
                    <span className="text-slate-400">{text.totalPaidLabel}</span>
                    <span className="font-bold text-teal-400">
                      {formatMoney(subStatus?.totalAmountPaid || 20)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mandated Direct Payment Notice instructions card */}
          <div className="bg-amber-950/15 border border-amber-900/40 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute right-2 top-2 p-1 text-amber-500 opacity-20">
              <AlertCircle className="w-16 h-16" />
            </div>
            <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              ⚠️ {currentLanguage === "so" ? "Ogeysiis Shuruudaha bixinta" : "Strict Somalia Billing Protections"}
            </h5>
            <p className="text-[10px]/relaxed text-slate-350 font-mono">
              {currentLanguage === "so"
                ? "Dhammaan lacagaha waxaa si toos ah loogu shubayaa Account-ka rasmiga ah ee ururinta SaaS-ka ee ah: 38577675. Kadib markaad lacagta wareejiso xuquuqda furitaanka appka waxaa lagu xaqiijin doonaa isla goobta."
                : "Standard payments require target transfer directly to our main collection accounting terminal: 38577675. Renewal locks is instantly released the moment the transaction is validated with appropriate transaction code."}
            </p>
          </div>

        </div>

        {/* Right Side: Double interaction engine (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          
          <form onSubmit={handleRenew} className="space-y-6">
            
            {/* Step 1 duration choices slider slider */}
            <div className="space-y-3">
              <h4 className="text-slate-800 font-bold text-sm tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-display font-bold text-xs">1</span>
                {text.step1Title}
              </h4>
              <p className="text-slate-500 text-xs font-sans pl-7">{text.step1Subtitle}</p>
              
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 pl-7 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-sans font-bold uppercase tracking-wider">Select Duration:</span>
                  <span className="text-sm font-black font-mono text-teal-600">{months} {text.monthsCount}</span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600"
                />

                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-400 text-center">
                  <div>1 Bil</div>
                  <div>6 Bilood</div>
                  <div>12 Bilood (1 Yr)</div>
                  <div>24 Bilood (2 Yrs)</div>
                </div>
              </div>
            </div>

            {/* Step 2 payment routing details */}
            <div className="space-y-3">
              <h4 className="text-slate-800 font-bold text-sm tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-display font-bold text-xs">2</span>
                {text.step2Title}
              </h4>
              <p className="text-slate-500 text-xs font-sans pl-7">{text.step2Subtitle}</p>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 pl-7 space-y-4">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="p-3 bg-teal-100/40 text-teal-800 rounded-xl border border-teal-200/50">
                    <span className="text-xs uppercase font-mono font-bold block">{currentLanguage === "so" ? "QIIMAHA BILALAHAS:" : "Total Checkout Sum:"}</span>
                    <span className="text-2xl font-black font-mono mt-0.5 block">{formatMoney(pricing.finalPrice)}</span>
                  </div>
                  
                  {pricing.discountApplied && (
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl px-3.5 py-1.5 text-xs font-semibold animate-bounce mt-1">
                      🎉 5% dhimis ayaa lagu kiciyay! (Badbaadiyay $24.00)
                    </div>
                  )}
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-900">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider block font-sans">
                      📟 {text.accountNoLabel}
                    </span>
                    <button
                      type="button"
                      onClick={copyAccountToClipboard}
                      className="p-1 hover:bg-rose-100 text-rose-700 rounded transition flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedAccount ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  
                  <div className="bg-slate-900 text-amber-400 p-2 text-center rounded-lg font-mono text-xs sm:text-sm font-bold shadow-inner">
                    *712*{merchantAccount}*{Math.round(pricing.finalPrice)}#
                  </div>
                  <p className="text-[10px] text-rose-800 text-center block">
                    {currentLanguage === "so"
                      ? "Fariin USSD push ah waxaad ka helaysaa Hormuud ama Telecom rasmiga."
                      : "Trigger dial code directly on your phone, then input PIN to verify deposit."}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 Transaction Entry Form */}
            <div className="space-y-3">
              <h4 className="text-slate-800 font-bold text-sm tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-display font-bold text-xs">3</span>
                {text.step3Title}
              </h4>
              <p className="text-slate-500 text-xs font-sans pl-7">{text.step3Subtitle}</p>

              <div className="pl-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{text.transInputLabel}</label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="E.g., TXN-SOM-KAAFI-991A or mobile ID..."
                    className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-xl px-4 py-2.5 focus:border-teal-500 focus:outline-none transition-all text-slate-800 font-mono font-bold"
                  />
                </div>

                {/* Status alerting */}
                {errorLocal && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-850 text-xs flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                    <span>{errorLocal}</span>
                  </div>
                )}

                {successLocal && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-850 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    <span>{successLocal}</span>
                  </div>
                )}

                {/* Submitting button trigger */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-3 text-xs font-extrabold tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 uppercase font-sans"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  <span>{text.renewBtn}</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>

      {/* Billing history invoice archives */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h4 className="text-slate-800 font-bold text-sm tracking-wide flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          {text.historyTitle}
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] tracking-wider">
                <th className="py-2.5 font-bold">Transaction ID</th>
                <th className="py-2.5 font-bold">Months Paid</th>
                <th className="py-2.5 font-bold">Refund Channel Acc</th>
                <th className="py-2.5 font-bold">Amount In USD</th>
                <th className="py-2.5 font-bold">Billing Stamp</th>
                <th className="py-2.5 font-bold text-right">Receipt Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {receipts.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-mono font-bold text-slate-905">{r.transactionId}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-teal-50 text-teal-700 border border-teal-100">
                      {r.monthsPaid} {text.monthsCount}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-500">📞 {r.repaymentAccount}</td>
                  <td className="py-3 font-bold text-slate-800 font-mono">${r.amount.toFixed(2)}</td>
                  <td className="py-3 text-slate-450 font-mono text-[10.5px]">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold text-teal-600 border border-teal-200 bg-teal-50 px-2 py-0.5 rounded cursor-pointer hover:bg-teal-600 hover:text-white transition">
                      PAID / RECEIPT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
