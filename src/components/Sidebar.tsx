"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Sparkles, MessageSquare, CreditCard, Settings, LogOut } from "lucide-react";
const items = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/properties", "My properties", Building2],
  ["/assistant", "AI assistant", Sparkles],
  ["/history", "Message history", MessageSquare],
  ["/billing", "Plan & billing", CreditCard],
  ["/settings", "Settings", Settings]
] as const;
export default function Sidebar() {
  const path = usePathname();
  return <aside className="w-full md:w-64 bg-white border-r border-line min-h-screen p-5 flex flex-col">
    <Link href="/dashboard" className="text-xl font-bold tracking-tight">stayora<span className="text-olive">.</span><span className="ml-2 text-[10px] uppercase tracking-[.2em] text-muted">AI</span></Link>
    <p className="text-xs text-muted mt-2 mb-8">THE HOST WORKSPACE</p>
    <nav className="space-y-1">{items.map(([href,label,Icon]) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${path === href ? "bg-cream text-oliveDark font-semibold" : "text-muted hover:bg-cream hover:text-ink"}`}><Icon size={17}/>{label}</Link>)}</nav>
    <form action="/auth/signout" method="post" className="mt-auto pt-8"><button className="flex items-center gap-3 text-sm text-muted px-3 py-2"><LogOut size={17}/> Sign out</button></form>
  </aside>;
}