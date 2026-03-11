import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Novos nomes para limpar o erro de cache do GitHub
import Painel from "./views/Painel"; 
import Catalogo from "./views/Catalogo"; 
import Fontes from "./views/Fontes";
import Investigacao from "./views/Investigacao"; 

import { LayoutDashboard, Gavel, Users, Search, Shield } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-950 text-white font-sans">
        {/* Sidebar Lateral */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-8 hidden md:flex">
          <div className="flex items-center gap-2 px-2">
            <Shield className="text-amber-500" size={32} />
            <span className="text-white font-black tracking-tighter text-xl italic uppercase">Busca Leilões</span>
          </div>

          <nav className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm">
              <LayoutDashboard size={20} /> PAINEL
            </Link>
            <Link to="/lotes" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm">
              <Gavel size={20} /> LOTES
            </Link>
            <Link to="/leiloeiros" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm">
              <Users size={20} /> LEILOEIROS
            </Link>
            <Link to="/investigar" className="flex items-center gap-3 text-slate-400 hover:text-amber-500 p-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm">
              <Search size={20} /> INVESTIGAR
            </Link>
          </nav>
        </aside>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-auto bg-slate-950">
          <Routes>
            <Route path="/" element={<Painel />} />
            <Route path="/lotes" element={<Catalogo />} />
            <Route path="/leiloeiros" element={<Fontes />} />
            <Route path="/investigar" element={<Investigacao />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
