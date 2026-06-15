import React, { useState } from "react";
import { Info, CheckCircle, X, ChevronRight, HelpCircle, Sparkles } from "lucide-react";

interface GuideProps {
  sectionId: string;
  currentLanguage: "en" | "so";
}

export default function SMESectionGuide({ sectionId, currentLanguage }: GuideProps) {
  // Use localStorage to remember if user closed this guide, but default to VISIBLE
  const [isOpen, setIsOpen] = useState(() => {
    const closed = localStorage.getItem(`sme_guide_closed_${sectionId}`);
    return closed !== "true";
  });

  if (!isOpen) {
    return (
      <div className="mb-4">
        <button
          onClick={() => {
            setIsOpen(true);
            localStorage.setItem(`sme_guide_closed_${sectionId}`, "false");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 border border-indigo-900/50 rounded-xl transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {currentLanguage === "so"
              ? `Halkaan ka furi tillaabada qaybta ${sectionId.toUpperCase()}`
              : `Show system guidance for ${sectionId.toUpperCase()}`}
          </span>
        </button>
      </div>
    );
  }

  // Define details for each tool sector
  const getGuideDetails = () => {
    switch (sectionId) {
      case "dashboard":
        return {
          title: currentLanguage === "so" ? "Kormeerka Guud ee Dukaanka" : "Overall Shop Control Center",
          desc: currentLanguage === "so"
            ? "Halkaan waxay ku tusineysaa xogta guud ee dukaanka si aad markiiba u ogaato meesha ay wax u socdaan."
            : "Monitor store operations, total finances, and inventory health metrics dynamically from one secure center.",
          points: currentLanguage === "so"
            ? [
                "U kuur-gal dakhliga maanta (Today's Sales) iyo faa'iidada nadiifka ah.",
                "Ogow dukaanka inta hanti ah oo ku kaydsan (Inventory Valuation).",
                "Arag alaabta dhamaadka u dhow iyo deymaha dibadda ku maqan oo dhan."
              ]
            : [
                "Track today's live cashflow performance and calculate net profitability.",
                "Instantly gauge your total frozen stock capital valuation in Somalia shillings or dollars.",
                "Catch critical warnings like rising low-stock items or due customer debts."
              ],
          bg: "from-teal-950/80 to-slate-900",
          border: "border-teal-500/30",
          iconColor: "text-teal-400",
        };

      case "pos":
        return {
          title: currentLanguage === "so" ? "Goobta Cashiirka & Iibinta Degdegga ah" : "Point of Sale & Dynamic Stock Tracking",
          desc: currentLanguage === "so"
            ? "Halkaan waa meesha rasmiga ah oo aad macaamiisha alaabta kaga iibinayso."
            : "Check out clients, print digital bills, and perform automatic volume assessments in real time.",
          points: currentLanguage === "so"
            ? [
                "💥 MUHIIM: Markaad alaab iibiso, nidaamka wuxuu toos u jarayaa inta ka iibsatay, isagoo ku tusaya inta ku harsan Bakhaarka!",
                "Dallacsiin USSD ah deganaansho kula dir durbadiiba (EVC Plus, Sahal, eDahab).",
                "Ku qor magaca macaamiil haddii uu deyn ku iibsanayo si loogu daro diiwaanka."
              ]
            : [
                "💥 CRITICAL: Selling items automatically deducts quantities, keeping live track of stock levels remaining!",
                "Trigger automated mobile money USSD billing requests (EVC Plus, Sahal, eDahab).",
                "Flag transactions as outstanding credit to instantly populate debtor balance ledgers."
              ],
          bg: "from-sky-950/80 to-slate-900",
          border: "border-sky-500/30",
          iconColor: "text-sky-400",
        };

      case "inventory":
        return {
          title: currentLanguage === "so" ? "Maamulka Bakhaarka & Alaabada Dukaanka" : "Warehouse & Product Line Control",
          desc: currentLanguage === "so"
            ? "Halkaan waa halka lagu kaydiyo laguna maamulo dhammaan agabka dukaanka uu iibiyo."
            : "Establish your custom retail catalogue, specify purchase/selling markup, and manage inventory levels.",
          points: currentLanguage === "so"
            ? [
                "Ku dar alaab cusub oo geli qiimaha lagu soo iibiyay iyo kan loo iibinayo.",
                "Xaddid inta ugu yar ee looga baahan yahay dukaanka (Low Stock Alert).",
                "U qaybi alaabaha noocyo kala duwan si aad si fudud ugu dhex raadiso."
              ]
            : [
                "Register products, scan barcodes, and enter targeted purchasing vs retail prices to define profit fields.",
                "Specify low-stock alert margins to guarantee you never run out of vital retail goods.",
                "Assign category tags to dynamically group items for speedier POS queries."
              ],
          bg: "from-indigo-950/80 to-slate-900",
          border: "border-indigo-500/30",
          iconColor: "text-indigo-400",
        };

      case "debts":
        return {
          title: currentLanguage === "so" ? "Buugga Diiwaangelinta Deymaha dukaanka" : "Interactive Customer Debt Ledger",
          desc: currentLanguage === "so"
            ? "Halkaan ku diiwaangeli macaamiisha deynta kugu leh iyo taariikhda loogu talagalay inay iska bixiyaan."
            : "Securely document clients receiving goods on credit, schedule repayments, and manage historic collections.",
          points: currentLanguage === "so"
            ? [
                "Ka hortag inay kaa khasaarto deynta adoo qoraya lambarka taleefanka macmiilka.",
                "Ku dar taariikhda la rabo in lagu soo celiyo lacagta si nidaamka ku xasuusiyo.",
                "Diiwaangeli mar kasta oo macmiilku lacag qayb ahaan kuu soo celiyo."
              ]
            : [
                "Prevent financial leaks by tracking and saving debtors with verified phone coordinates.",
                "Enforce repayment collection dates with automated overdue notification warning signs.",
                "Log step-by-step partial repayments to dynamically refresh active credit balances."
              ],
          bg: "from-amber-950/80 to-slate-900",
          border: "border-amber-500/30",
          iconColor: "text-amber-400",
        };

      case "expenses":
        return {
          title: currentLanguage === "so" ? "Kharashaadka Dukaanka & Dheelitirka Faaiidada" : "Operational Expense Ledger & Savings",
          desc: currentLanguage === "so"
            ? "Halkaan ku qor dhammaan khidmadaha dukaanka dhexdiisa ka baxa si aad u ogaato faa'iidada rasmiga ah."
            : "Keep track of running expenditures like shop rent, electric utilities, and staff salaries in real-time.",
          points: currentLanguage === "so"
            ? [
                "Diiwaangeli kirada, mushaaraadka, korontada, iyo kharash kasta oo dukaanka ka baxay.",
                "Lacagta halkan ku baxda si toos ah ayaa looga gooyaa dakhliga guud si aad u ogaato faa'iidada saxda ah.",
                "Ka hortag khasaaraha maaliyadeed si dukaankaaga uu u guuleysto."
              ]
            : [
                "Log daily overheads such as shop rent, electricity, transport, or unexpected repairs.",
                "All expenses are instantly subtracted from gross margins to display authentic green profit ranges.",
                "Prevent budget overruns by auditing non-essential spending categories dynamically."
              ],
          bg: "from-rose-950/80 to-slate-900",
          border: "border-rose-500/30",
          iconColor: "text-rose-400",
        };

      case "suppliers":
        return {
          title: currentLanguage === "so" ? "Maamulka Jumladleyda / Shirkadaha Alaabta keena" : "Wholesaler Accounts & Supplier Backlogs",
          desc: currentLanguage === "so"
            ? "Halkaan ku kaydi ganacsatada aad alaabta jumlo ahaan uga soo iibsato iyo dheelitirka lacagaha ka dambeeya."
            : "Manage directories of corporate partners, log wholesale acquisitions, and track supplier payables.",
          points: currentLanguage === "so"
            ? [
                "Ku qor magacyada shirkadaha jumlada iyo lambarkooda si aad si fudud ula xiriirto.",
                "La soco inta lacag ah oo aad ku leedahay ama ku leeyihiin jumlada.",
                "Xaqiiji xiriir dhow oo aad la yeelato ganacsatada alaabta ku keenta."
              ]
            : [
                "Store wholesaler directories with direct touch dials to quicken delivery requests.",
                "Track how much corporate credit or outstanding balance you owe back to wholesalers.",
                "Audit whole inventory acquisitions history to detect sudden pricing fluctuations."
              ],
          bg: "from-emerald-950/80 to-slate-900",
          border: "border-emerald-500/30",
          iconColor: "text-emerald-400",
        };

      case "blueprints":
        return {
          title: currentLanguage === "so" ? "Nidaamyada & Habraaca Dukaanka" : "SME Codebook & Action Blueprints",
          desc: currentLanguage === "so"
            ? "Blueprints waa qayb gaar ah oo ku siisa xeeladaha iyo tababarka lagu guuleysto ee ganacsiga Somaliland iyo Soomaaliya."
            : "Review localized workflow models, standard operation protocols, and visual retail templates.",
          points: currentLanguage === "so"
            ? [
                "Baro habraaca furiinka iyo xeritaanka khasnadda (Cash Register Opening/Closing).",
                "Ogow sida loo qaabilo macaamiisha loona kordhiyo iibka dukaanka.",
                "Baro sida loo xalliyo khaladaadka alaabada is khilaafsan."
              ]
            : [
                "Access standard instructions for morning registers opening and evening cash drawers checkout.",
                "Master client onboarding and upsell strategies optimized for regional Somali bazaars.",
                "Resolve cross-stock discrepancies with offline auditing sheets."
              ],
          bg: "from-indigo-950/80 to-slate-900",
          border: "border-indigo-500/30",
          iconColor: "text-indigo-400",
        };

      case "billing":
        return {
          title: currentLanguage === "so" ? "Maamulka Rukunka App-ka & SaaS Billing" : "SaaS License Management & Direct Renewals",
          desc: currentLanguage === "so"
            ? "Halkaan ku kordhi rukunka barnaamijka si dukaankaaga uusan u xirmin."
            : "Review subscription intervals, claim active trial statuses, and activate direct renewals.",
          points: currentLanguage === "so"
            ? [
                "Ku kordhi rukunka adoo raacaya tillaabooyinka bixinta mobile money-ga.",
                "Soo degso Rasiidhada rasmiga ah ee aad bixisay oo dhan maamulka dukaanka.",
                "Fadlan xiriir la samee taageerada haddii aad wax su'aalo ah qabto."
              ]
            : [
                "Renew active licenses seamlessly by sending push billing requests via Zaad/EVC Plus.",
                "Examine transaction invoice history and download receipts for tax compliance.",
                "Gain full access to all features with consistent trial-to-membership transfers."
              ],
          bg: "from-violet-950/80 to-slate-900",
          border: "border-violet-500/30",
          iconColor: "text-violet-400",
        };

      default:
        return {
          title: "System Section Guide",
          desc: "Understand what this functional area is designed for.",
          points: ["Track metrics", "Record logs", "Automate services"],
          bg: "from-slate-900 to-slate-950",
          border: "border-slate-800",
          iconColor: "text-teal-400",
        };
    }
  };

  const details = getGuideDetails();

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(`sme_guide_closed_${sectionId}`, "true");
  };

  return (
    <div className={`bg-gradient-to-r ${details.bg} border ${details.border} rounded-2xl p-5 mb-6 relative overflow-hidden transition-all shadow-md`}>
      <div className="absolute top-3 right-3">
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white bg-slate-800/85 hover:bg-slate-700/90 p-1.5 rounded-lg transition cursor-pointer"
          title={currentLanguage === "so" ? "Qari hanuuninta" : "Dismiss guide"}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-start gap-3.5 max-w-[95%]">
        <div className={`p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0 ${details.iconColor}`}>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <div>
          <h4 className="text-white text-sm font-black font-display flex items-center gap-1.5 tracking-tight">
            <span>{details.title}</span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              {currentLanguage === "so" ? "Hanuun" : "Guide"}
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl font-sans">
            {details.desc}
          </p>

          <div className="mt-3.5 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {currentLanguage === "so" ? "Sida ay kuu caawineyso:" : "How this helps your business:"}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-200 font-sans">
              {details.points.map((pt, index) => (
                <div key={index} className="flex items-start gap-1.5 pl-1">
                  <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${details.iconColor}`} />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
