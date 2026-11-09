import Sidebar from "./Sidebar";
export default function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return <div className="min-h-screen md:flex"><Sidebar/><main className="flex-1 p-5 md:p-10 max-w-[1500px]"><header className="mb-8"><p className="text-xs tracking-[.18em] uppercase text-olive font-semibold">Stayora workspace</p><h1 className="text-3xl font-semibold mt-2">{title}</h1>{subtitle && <p className="text-muted mt-2">{subtitle}</p>}</header>{children}</main></div>;
}