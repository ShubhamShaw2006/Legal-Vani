"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton({ dict }: { dict?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Hard refresh to clear all states and middleware cookies
    window.location.href = "/auth";
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-brand-gold text-sm font-bold hover:text-brand-gold-light transition-colors tracking-wide uppercase"
    >
      <LogOut className="w-4 h-4" /> {dict || "Logout"}
    </button>
  );
}
