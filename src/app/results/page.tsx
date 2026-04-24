"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default function ResultsPage() {
  const [result, setResult] = useState<any>(null);
  const [userInput, setUserInput] = useState<string>("");
  const router = useRouter();

  const [dict, setDict] = useState(getDictionary("en"));

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match && match[2]) {
      setDict(getDictionary(match[2] as Locale));
    }
    
    const data = sessionStorage.getItem("legalAnalysisResult");
    const inputStr = sessionStorage.getItem("legalAnalysisInput");
    
    if (!data) {
      router.push("/");
    } else {
      setResult(JSON.parse(data));
      if (inputStr) setUserInput(inputStr);
    }
  }, [router]);

  if (!result) {
    return <div className="p-6 text-center text-brand-gold font-semibold mt-20">Loading Results...</div>;
  }

  return (
    <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative min-h-screen text-brand-text">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-brand-gold hover:text-brand-gold-light transition-colors uppercase tracking-wide">
          <ArrowLeft className="w-4 h-4 mr-2" /> {dict.results.start_over}
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black text-brand-gold leading-tight tracking-wide">
          {dict.results.title}
        </h1>
        <p className="text-sm text-brand-text-muted mt-1 font-medium">
          {dict.results.subtitle}
        </p>
      </header>

      <ResultsView result={result} userInput={userInput} dict={dict} />
    </main>
  );
}
