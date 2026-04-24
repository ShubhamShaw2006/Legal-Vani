"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scale, Loader2, Globe } from "lucide-react";
import OtpModal from "@/components/OtpModal";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { setLanguageCookie } from "@/app/actions/setLanguage";

export default function AuthPage() {
  const router = useRouter();
  
  // i18n state
  const [locale, setLocale] = useState<Locale>("en");
  const [dict, setDict] = useState(getDictionary("en"));

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match && match[2]) {
      const loc = match[2] as Locale;
      setLocale(loc);
      setDict(getDictionary(loc));
    }
  }, []);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    setLocale(newLocale);
    setDict(getDictionary(newLocale));
    await setLanguageCookie(newLocale);
    // Hard reload to sync all server components with new locale
    window.location.reload();
  };

  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // OTP Modal State
  const [showOtp, setShowOtp] = useState(false);
  const [mockOtp, setMockOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { phone_number: phone, password } 
      : { phone_number: phone, password, full_name: name, age: parseInt(age) };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        if (data.mock_otp) setMockOtp(data.mock_otp);
        setShowOtp(true);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtp(false);
    // Force a hard navigation so the browser definitely sends the new HttpOnly cookie to the middleware
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-bg text-brand-text relative">
      
      <div className="w-full max-w-sm mb-8 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-black text-brand-text tracking-tight mb-6 animate-pulse" style={{ animationDuration: '3s' }}>
          LegalVani
        </h1>
        <h2 className="text-2xl font-black text-brand-gold tracking-tight flex items-center gap-2 mb-2">
          <Scale className="w-6 h-6" /> {dict.auth.subtitle}
        </h2>
      </div>

      <div className="bg-brand-panel w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-brand-gold/20 animate-in fade-in duration-500 delay-150 fill-mode-both relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
          <Scale className="w-40 h-40" />
        </div>

        {/* Prominent Language Selector */}
        <div className="relative z-10 mb-6 bg-[#1a1311] border border-brand-gold/30 rounded-xl p-4 shadow-sm">
          <label className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" /> {dict.auth.select_language || "Select Language"}
          </label>
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="w-full bg-transparent text-brand-text text-base font-semibold focus:outline-none cursor-pointer appearance-none border-b border-brand-gold/20 pb-2"
          >
            <option value="en" className="bg-[#1a1311] text-brand-text">English</option>
            <option value="hi" className="bg-[#1a1311] text-brand-text">हिंदी (Hindi)</option>
            <option value="bn" className="bg-[#1a1311] text-brand-text">বাংলা (Bengali)</option>
            <option value="mr" className="bg-[#1a1311] text-brand-text">मराठी (Marathi)</option>
            <option value="ta" className="bg-[#1a1311] text-brand-text">தமிழ் (Tamil)</option>
            <option value="te" className="bg-[#1a1311] text-brand-text">తెలుగు (Telugu)</option>
            <option value="gu" className="bg-[#1a1311] text-brand-text">ગુજરાતી (Gujarati)</option>
            <option value="ml" className="bg-[#1a1311] text-brand-text">മലയാളം (Malayalam)</option>
            <option value="pa" className="bg-[#1a1311] text-brand-text">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="kn" className="bg-[#1a1311] text-brand-text">ಕನ್ನಡ (Kannada)</option>
            <option value="or" className="bg-[#1a1311] text-brand-text">ଓଡ଼ିଆ (Odia)</option>
            <option value="ur" className="bg-[#1a1311] text-brand-text">اردو (Urdu)</option>
          </select>
        </div>

        <div className="flex bg-[#1a1311] p-1 rounded-xl mb-8 border border-brand-gold/10 relative z-10">
          <button 
            onClick={() => {setIsLogin(true); setError("");}}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${isLogin ? "bg-brand-gold text-[#1e1712] shadow-sm" : "text-brand-text-muted hover:text-brand-text"}`}
          >
            {dict.auth.signin_tab}
          </button>
          <button 
            onClick={() => {setIsLogin(false); setError("");}}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!isLogin ? "bg-brand-gold text-[#1e1712] shadow-sm" : "text-brand-text-muted hover:text-brand-text"}`}
          >
            {dict.auth.create_tab}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-bold text-brand-text mb-2 block">{dict.auth.fullname}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                  placeholder={dict.auth.fullname}
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-text mb-2 block">{dict.auth.age}</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
                  placeholder={dict.auth.age}
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-bold text-brand-text mb-2 block">{dict.auth.phone}</label>
            <input 
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
              placeholder={dict.auth.phone}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-brand-text mb-2 block">{dict.auth.password}</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-gold text-[#1e1712] font-bold py-3.5 rounded-xl mt-4 flex items-center justify-center hover:bg-brand-gold-light transition-all glow-gold"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : dict.auth.next}
          </button>
        </form>
      </div>

      {showOtp && <OtpModal phone={phone} mockOtp={mockOtp} onSuccess={handleOtpSuccess} onClose={() => setShowOtp(false)} />}

    </div>
  );
}
