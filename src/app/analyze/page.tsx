"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import VoiceInput from "@/components/VoiceInput";
import { getDictionary, Locale } from "@/i18n/dictionaries";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "other";
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [dict, setDict] = useState(getDictionary("en"));

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match && match[2]) {
      setDict(getDictionary(match[2] as Locale));
    }
  }, []);

  const handleAnalyze = async () => {
    if (!textInput.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput, category }),
      });
      
      const data = await res.json();
      if (res.ok && data) {
        sessionStorage.setItem("legalAnalysisInput", textInput);
        sessionStorage.setItem("legalAnalysisResult", JSON.stringify(data));
        router.push("/results");
      } else {
        alert("Failed to analyze text. Please try again.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTranscription = (text: string) => {
    // Whisper empty-audio hallucinations filter
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes("subtitles by") || lowerText === "thank you." || lowerText === "may god bless you.") {
      alert("No voice detected. Please try again.");
      return;
    }
    setTextInput(prev => prev ? prev + " " + text : text);
  };

  return (
    <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full text-brand-text min-h-screen">
      
      <header className="py-6 flex items-center gap-2 mb-2 animate-in slide-in-from-top-4">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center hover:bg-brand-gold/10 rounded-full transition-colors cursor-pointer active:scale-95">
          <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-bold text-brand-gold tracking-wide">
          {dict.analyze.title}
        </h1>
      </header>

      <div className="flex-1 flex flex-col gap-5 mt-2 animate-in fade-in duration-500 delay-150 fill-mode-both">
        
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-brand-gold border-t-transparent animate-spin"></div>
            <p className="text-brand-gold font-semibold tracking-wider">{dict.analyze.analyzing}</p>
          </div>
        ) : (
          <>
            <div>
              <label className="text-sm font-bold text-brand-text mb-2 block">{dict.analyze.title}</label>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={dict.analyze.placeholder}
                className="w-full bg-[#1a1311] border border-brand-gold/30 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold transition-all min-h-[200px] text-brand-text resize-none"
              />
            </div>

            <VoiceInput onTranscriptionComplete={handleTranscription} />

            <button 
              onClick={handleAnalyze}
              disabled={!textInput.trim()}
              className="w-full mt-2 bg-brand-gold text-[#1e1712] font-bold py-4 rounded-xl hover:bg-brand-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold"
            >
              {dict.analyze.button}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
