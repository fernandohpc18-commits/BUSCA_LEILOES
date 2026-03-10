import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Package, Gavel, Radar, Users, Sun, Moon, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Painel", page: "Dashboard", icon: LayoutDashboard },
  { label: "Lotes", page: "Lotes", icon: Package },
  { label: "Rastreamento", page: "Rastreamento", icon: Radar },
  { label: "Leiloeiros", page: "Leiloeiros", icon: Users },
];

export default function Layout({ children, currentPageName }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <style>{`
        :root { color-scheme: light; }
        .dark { color-scheme: dark; }
      `}</style>

      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gray-900 dark:bg-yellow-500 rounded-xl flex items-center justify-center transition-colors">
              <Gavel className="w-4 h-4 text-white dark:text-gray-900" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight hidden sm:block">
              Busca Leilões
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV_ITEMS.map(({ label, page, icon: Icon }) => {
              const isActive = currentPageName === page;
              return (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(d => !d)}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={dark ? "Modo Claro" : "Modo Escuro"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ label, page, icon: Icon }) => {
              const isActive = currentPageName === page;
              return (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
