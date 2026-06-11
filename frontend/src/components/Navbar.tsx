"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, BarChart3, FileText, Settings, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Reports", href: "/reports", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--glass-border)] bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
            <ShieldAlert className="h-5.5 w-5.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-gray-900 leading-none">AegisAI</span>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-0.5">Crisis Intelligence</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-1 sm:space-x-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-950 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action / Institutional Branding */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Response Ops</span>
            <span className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1 justify-end">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Node Active
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden lg:inline">Config Matrix</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
