"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function OtpModal({ 
  phone,
  mockOtp,
  onSuccess, 
  onClose 
}: { 
  phone: string;
  mockOtp?: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const verifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (code.length !== 6) {
      setError("Please enter a 6 digit code.");
      return;
    }
    
    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, otp_code: code }),
      });

      const data = await res.json();
      if (res.ok) {
        // Fallback: Manually set the cookie on the client side to guarantee it works on localhost
        if (data.token) {
          document.cookie = `legal_vani_session=${data.token}; path=/; max-age=86400; SameSite=Lax`;
        }
        onSuccess();
      } else {
        setError(data.error || "Invalid code.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-brand-panel w-full max-w-sm rounded-3xl p-8 shadow-2xl border border-brand-gold/20 animate-in zoom-in-95 duration-300">
        <h2 className="text-xl font-black text-brand-gold mb-2 tracking-wide">Enter OTP</h2>
        <p className="text-sm text-brand-text-muted mb-6">
          Sent to <span className="font-bold text-brand-text">{phone}</span>
        </p>

        {/* MOCK OTP BANNER FOR PRESENTATION PURPOSES */}
        {mockOtp && (
          <div className="bg-[#1a1311] border border-brand-gold/30 rounded-xl p-3 mb-6 text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block mb-1">Mock SMS Received</span>
            <span className="font-mono text-2xl font-black tracking-[0.25em] text-brand-text">{mockOtp}</span>
          </div>
        )}

        <form onSubmit={verifyOtp} className="flex flex-col gap-4">
          <input 
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-xl px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] text-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
            placeholder="------"
            required
            autoFocus
          />

          {error && <p className="text-red-400 text-xs font-semibold text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full bg-brand-gold text-[#1e1712] font-black py-4 rounded-xl mt-2 hover:bg-brand-gold-light transition-all glow-gold tracking-wide"
          >
            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
          </button>
        </form>

        <button 
          onClick={onClose}
          className="w-full mt-4 text-sm font-bold text-brand-text-muted hover:text-brand-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
