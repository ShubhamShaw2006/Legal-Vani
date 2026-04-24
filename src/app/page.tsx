
/**
 * Legal-Vani: AI Legal Assistant
 * Developed by Shubham
 * 
 * Home Page Component
 * Main landing page providing quick access to categories and the Police Locator.
 */
import Link from "next/link";
import { cookies } from "next/headers";
import PoliceLocator from "@/components/PoliceLocator";
import LogoutButton from "@/components/LogoutButton";
import { Scale } from "lucide-react";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("legal_vani_session");
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
  const dict = getDictionary(locale);

  const categories = Object.entries(dict.home.categories).map(([key, label]) => ({
    id: key,
    label,
  }));

  return (
    <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative min-h-screen text-brand-text">
      
      {/* Top Bar for Auth */}
      <div className="absolute top-6 right-6 z-10">
        {isLoggedIn ? (
          <LogoutButton dict={dict.home.logout} />
        ) : (
          <Link 
            href="/auth" 
            className="text-brand-gold text-sm font-bold hover:text-brand-gold-light transition-colors tracking-wide uppercase"
          >
            {dict.home.signin}
          </Link>
        )}
      </div>

      {/* Hero Header matching Inspiration */}
      <header className="flex flex-col items-center justify-center pt-20 pb-10">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-10 h-10 text-brand-gold" />
          <h1 className="text-4xl font-black text-brand-text tracking-tight">
            Legal Vani
          </h1>
        </div>
        <p className="text-sm text-brand-text-muted font-medium">
          {dict.home.subtitle}
        </p>
      </header>

      {/* The Grid, redesigned as elegant sleek cards */}
      <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
        <div className="bg-brand-panel border border-brand-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Scale className="w-24 h-24" />
          </div>
          
          <h2 className="text-sm font-bold text-brand-gold mb-4 uppercase tracking-wider">{dict.home.title}</h2>
          
          <div className="grid gap-3 grid-cols-2 relative z-10">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/analyze?category=${cat.id}`}
                className="flex items-center justify-center text-center p-3 bg-[#1e1712]/50 rounded-xl border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold/10 transition-all active:scale-95 text-sm font-semibold text-brand-text"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <PoliceLocator dict={dict.home.police_locator} />
      </div>

      <div className="mt-auto pt-12 pb-6 text-center text-xs text-brand-text-muted font-medium tracking-wider uppercase">
        <p>{dict.home.footer}</p>
      </div>
    </main>
  );
}
