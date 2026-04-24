"use client";

import { CheckCircle2, AlertTriangle, Phone, MapPin, Building2, Download, Scale } from "lucide-react";
import TtsButton from "./TtsButton";

interface LegalResult {
  issue_category: string;
  rights_explanation: string;
  step_by_step_actions: string[];
  authority_to_approach?: {
    name: string;
    contact: string;
    address: string;
  };
  documents_required: string[];
  emergency_flag: boolean;
  helpline_numbers: string[];
}

interface ResultsViewProps {
  result: LegalResult;
  userInput?: string;
  dict?: any;
}

export default function ResultsView({ result, userInput, dict }: ResultsViewProps) {
  const combinedTextToRead = `
    Category: ${result.issue_category}. 
    Your rights: ${result.rights_explanation}. 
    Actions to take: ${result.step_by_step_actions.join(". ")}.
  `;

  return (
    <div className="flex flex-col gap-6 pb-20 text-brand-text">
      {/* Emergency Banner */}
      {result.emergency_flag && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-100 p-5 rounded-2xl shadow-lg flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="w-8 h-8 shrink-0 mt-0.5 text-red-400" />
          <div>
            <h2 className="font-bold text-lg mb-1 text-red-300">{dict?.results?.emergency || "Emergency Intervention Required"}</h2>
            <p className="text-sm opacity-90 mb-3 text-red-100/80">{dict?.results?.emergency_desc || "This is a sensitive issue, please reach out to authorities immediately."}</p>
            <div className="flex flex-col gap-2">
              {result.helpline_numbers.map((num, i) => (
                <div key={i} className="flex items-center gap-2 font-mono font-bold text-lg bg-red-950/50 p-2 rounded-lg border border-red-500/20 w-fit">
                  <Phone className="w-5 h-5 text-red-400" /> {num}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Input Display */}
      {userInput && (
        <div className="bg-brand-panel border border-brand-gold/20 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">{dict?.results?.original_input || "Original Input"}</h3>
          <p className="text-sm text-brand-text italic">"{userInput}"</p>
        </div>
      )}

      {/* Main Analysis Card */}
      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-gold/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Scale className="w-32 h-32" />
        </div>
        <div className="p-6 border-b border-brand-gold/10 flex items-start justify-between gap-4 relative z-10">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold font-bold text-xs rounded-full uppercase tracking-wider mb-3 border border-brand-gold/20">
              {result.issue_category}
            </span>
            <h2 className="text-2xl font-black text-brand-text leading-tight tracking-wide">{dict?.results?.legal_rights || "Your Legal Rights"}</h2>
          </div>
          <TtsButton textToRead={combinedTextToRead} />
        </div>
        
        <div className="p-6 relative z-10">
          <p className="text-[17px] leading-relaxed text-brand-text/90">
            {result.rights_explanation}
          </p>
        </div>
      </div>

      {/* Action Steps */}
      <div className="bg-brand-panel rounded-2xl shadow-xl border border-brand-gold/30 p-6">
        <h3 className="text-lg font-black text-brand-gold mb-5 tracking-wide">{dict?.results?.action_steps || "Step-by-Step Action"}</h3>
        <div className="flex flex-col gap-4">
          {result.step_by_step_actions.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-8 h-8 shrink-0 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold flex items-center justify-center font-bold text-sm shadow-inner">
                {idx + 1}
              </div>
              <p className="text-brand-text/90 leading-snug pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authorities & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.authority_to_approach && (
          <div className="bg-gradient-to-br from-[#1a1311] to-[#2a211e] border border-brand-gold/40 rounded-2xl p-6 text-brand-text shadow-xl">
            <h3 className="font-black text-brand-gold mb-4 flex items-center gap-2"><Building2 className="w-5 h-5" /> {dict?.results?.authority || "Authority to Approach"}</h3>
            <p className="font-bold text-lg mb-3 tracking-wide">{result.authority_to_approach.name}</p>
            <div className="space-y-3 text-sm text-brand-text-muted">
              <p className="flex items-start gap-3"><MapPin className="w-5 h-5 shrink-0 mt-0.5 text-brand-gold" /> {result.authority_to_approach.address}</p>
              <p className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0 text-brand-gold" /> {result.authority_to_approach.contact}</p>
            </div>
          </div>
        )}

        {result.documents_required && result.documents_required.length > 0 && (
          <div className="bg-brand-panel rounded-2xl p-6 border border-brand-gold/20 shadow-xl">
            <h3 className="font-black text-brand-gold mb-4 tracking-wide">{dict?.results?.documents || "Required Documents"}</h3>
            <ul className="space-y-3">
              {result.documents_required.map((doc, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-brand-text/90 items-start">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Floating Action Button for PDF */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none z-50">
        <button 
          onClick={async () => {
            try {
              const res = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result)
              });
              const data = await res.json();
              if (data.pdfBase64) {
                const link = document.createElement('a');
                link.href = `data:application/pdf;base64,${data.pdfBase64}`;
                link.download = data.filename || "Legal-Vani-Complaint.pdf";
                link.click();
              } else {
                alert("Could not generate PDF");
              }
            } catch (err) {
              alert("Error generating PDF");
            }
          }}
          className="pointer-events-auto shadow-2xl bg-brand-gold text-[#1e1712] font-black py-4 px-8 rounded-full flex items-center gap-3 hover:bg-brand-gold-light transition-all transform hover:-translate-y-1 active:translate-y-0 glow-gold uppercase tracking-wide"
        >
          <Download className="w-5 h-5" /> {dict?.results?.generate_pdf || "Generate Formal Complaint"}
        </button>
      </div>
    </div>
  );
}
