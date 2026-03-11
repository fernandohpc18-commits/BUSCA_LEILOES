import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Fontes from "./views/Fontes";
import Lotes from "./views/Lotes";
import { LayoutDashboard, Gavel, Database } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        
        {/* Barra de Navegação Superior */}
        <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo / Título */}
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 p-2 rounded-lg">
                <Gavel className="w-6 h-6 text-black" />
              </div>
              <span className="font-black text-xl text-white tracking-tighter">
                LEILÃO<span className="text-amber-500">PRO</span> <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">v2.0</span>
              </span>
            </div>

            {/* Links de Navegação */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                DASHBOARD DE LOTES
              </Link>
              
              <Link 
                to="/fontes" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <Database className="w-4 h-4 text-amber-500" />
                GESTÃO DE FONTES
              </Link>
            </div>
          </div>
        </nav>

        {/* Área de Conteúdo (Onde as páginas carregam) */}
        <main className="flex-grow">
          <Routes>
            {/* Rota Principal: Mostra os Cards dos Lotes */}
            <Route path="/" element={<Lotes />} />
            
            {/* Rota Fontes: Mostra a Tabela de Leiloeiros */}
            <Route path="/fontes" element={<Fontes />} />
          </Routes>
        </main>

        {/* Rodapé Simples */}
        <footer className="p-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            Sistema de Monitoramento Inteligente © 2026 - Conectado via Google Gemini IA
          </p>
        </footer>

      </div>
    </Router>
  );
}

export default App;
