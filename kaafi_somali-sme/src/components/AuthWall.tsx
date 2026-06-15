import React, { useState } from "react";
import { Shield, Sparkles, Smartphone, Key, Layers, Languages, Check, RefreshCw, UserCheck, AlertCircle } from "lucide-react";

interface AuthWallProps {
  currentLanguage: "en" | "so";
  setCurrentLanguage: (lan: "en" | "so") => void;
  onLoginSuccess: (user: { businessId: string; businessName: string; phone: string }, subscription: any) => void;
}

export default function AuthWall({ currentLanguage, setCurrentLanguage, onLoginSuccess }: AuthWallProps) {
  // Check if registered before to enforce: "danbo ha tusin login only"
  const registeredOnce = localStorage.getItem("has_registered_once") === "true";
  
  // Default mode: if registered before, force login. If not, default to register so they onboard first, then lock register!
  const [authMode, setAuthMode] = useState<"login" | "register">(registeredOnce ? "login" : "register");
  
  // Form values
  const [loginKey, setLoginKey] = useState("");
  const [password, setPassword] = useState("");
  
  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [successLocal, setSuccessLocal] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);
    setSuccessLocal(null);
    if (!loginKey.trim() || !password.trim()) {
      setErrorLocal(
        currentLanguage === "so"
          ? "FAADLAN: Geli magaca dukaanka ama taleefanka, iyo ereyga sirta ah!"
          : "PLEASE: Specify store identifier or phone along with passcode!"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginKey, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorLocal(data.error || "Galo waa uu guuldareystay.");
      } else {
        setSuccessLocal(data.message);
        setTimeout(() => {
          onLoginSuccess(data.user, data.subscription);
        }, 1000);
      }
    } catch (err) {
      setErrorLocal(currentLanguage === "so" ? "Xariirka server-ka waa uu go'ay." : "Could not connect to authentication gateway server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);
    setSuccessLocal(null);

    if (!businessId.trim() || !businessName.trim() || !phone.trim() || !regPassword.trim()) {
      setErrorLocal(
        currentLanguage === "so"
          ? "FAADLAN: Buuxi dhammaan sanduuqyada si aad isu diiwaangeliso!"
          : "PLEASE: Complete all fields to perform SME suite registration!"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: businessId.trim(),
          businessName: businessName.trim(),
          phone: phone.trim(),
          password: regPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorLocal(data.error || "Diiwaangelinta waa ay guuldareysatay.");
      } else {
        // Flag registered once device storage so register is NEVER shown again!
        localStorage.setItem("has_registered_once", "true");
        setSuccessLocal(
          currentLanguage === "so"
            ? "WAAR GUUL! Waxaad is-diiwaangelisay oo aad heshay 2 cisho oo tijaabo Bilaash ah."
            : "SUCCESS! Registered correctly. 2-Day free trial instantly assigned!"
        );
        setTimeout(() => {
          onLoginSuccess(data.user, data.subscription);
        }, 1500);
      }
    } catch (err) {
      setErrorLocal(currentLanguage === "so" ? "Xariirka server-ka waa uu go'ay." : "Failed to establish registration gateway connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative futuristic glow elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Bezel Panel */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-3xl p-6 md:p-8 z-10 relative">
        
        {/* Language switch button inside login gate */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-teal-400" />
            <span className="font-mono tracking-widest font-bold">KAAFI SME GATEWAY</span>
          </div>
          
          <button
            onClick={() => setCurrentLanguage(currentLanguage === "en" ? "so" : "en")}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-teal-400" />
            <span>{currentLanguage === "en" ? "Somali" : "English"}</span>
          </button>
        </div>

        {/* Title Presentation Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-indigo-500/20 border border-teal-500/30 mb-3 text-teal-400">
            <Layers className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight font-display text-white">
            {currentLanguage === "so" ? "Soo gal / Diiwaangeli KAAFI" : "Join or Sign In to Kaafi"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {currentLanguage === "so"
              ? "Ku maaree dukaankaaga Mogadishu hal barnaamij. Ka hubi POS, Bakhaarka iyo Deymaha rukunka SaaS."
              : "Operate inventory accounts, POS receipts, and outstanding debts in Somalia SME Suite."}
          </p>
        </div>

        {/* 2-Day Trial Promotional Callout Banner (Only when Register is a choice) */}
        {!registeredOnce && (
          <div className="mb-5 bg-gradient-to-r from-teal-900/40 to-indigo-900/40 border border-teal-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold text-teal-300 uppercase block">🎁 {currentLanguage === "so" ? "2 Maalmood oo Bilaash ah" : "2 Days Initial Free Access"}</span>
              <p className="text-slate-350 font-mono mt-0.5">
                {currentLanguage === "so"
                  ? "Markaad isdiiwaangeliso waxaa laguugu darayaa 2-maalmood oo tijaabo bilaash ah si aad u tijaabiso nidaamka!"
                  : "Onboarding triggers instant 2-day complimentary system credentials prior to sub billing bounds."}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Mode Selector Tabs */}
        {/* If registered once previously, completely block register option! "danbo ha tusin login only" */}
        {registeredOnce ? (
          <div className="mb-5 p-2 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono text-xs text-emerald-400">
            🔒 {currentLanguage === "so" ? "Diiwaangelinta waa la reebay (LOGIN ONLY)" : "Registration Locked (LOGIN ONLY)"}
          </div>
        ) : (
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800/80 rounded-xl mb-5 text-xs font-semibold">
            <button
              onClick={() => {
                setAuthMode("register");
                setErrorLocal(null);
                setSuccessLocal(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                authMode === "register"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📝 {currentLanguage === "so" ? "Is-diiwaangeli" : "Create Account"}
            </button>
            <button
              onClick={() => {
                setAuthMode("login");
                setErrorLocal(null);
                setSuccessLocal(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                authMode === "login"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔑 {currentLanguage === "so" ? "Soo Gal" : "Log In"}
            </button>
          </div>
        )}

        {/* Form Body switches */}
        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "ID-ga Dukaanka ama Mobile-ka" : "Shop ID Code or Mobile No"}
              </label>
              <input
                type="text"
                required
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                placeholder="E.g. kaafi_shop_01 or 0615551122"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "Ereyga Sirta ah (Password)" : "Passcode PIN"}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-250 font-bold"
              />
            </div>

            {errorLocal && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            {successLocal && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                <UserCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{successLocal}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-sans font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/20"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Key className="w-4 h-4 text-slate-950" />
              )}
              <span>{currentLanguage === "so" ? "Soo Gal durbadiiba" : "Authenticate Session"}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "ID-ga Gaarka ah ee Dukaanka" : "Unique ID Word for Store"}
              </label>
              <input
                type="text"
                required
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="E.g. bakaaro_gastro_dukaan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200 font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {currentLanguage === "so" ? "*Xarfaha isku dheji (Sida: kaafi_shop)" : "*No spacing allowed (e.g. kaafi_shop)"}
              </span>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "Magaca Dukaanka ama Ganacsiga" : "Business / Enterprise Name"}
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Magaca dukaankaaga..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "Lambarka Teleefanka (SaaS billing)" : "Workspace Phone Number"}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="061xxxxxxx or 062xxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider">
                {currentLanguage === "so" ? "Ereyga Sirta ah (Password)" : "New Passcode PIN"}
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none rounded-xl px-4 py-2.5 text-slate-250 font-bold"
              />
            </div>

            {errorLocal && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{errorLocal}</span>
              </div>
            )}

            {successLocal && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                <UserCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{successLocal}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-sans font-black text-xs py-3.5 rounded-xl uppercase tracking-wider transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/20"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-950" />
              )}
              <span>{currentLanguage === "so" ? "Abuur oo hel 2 Cisho trial" : "Join to Claim 2-Day Trial"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
