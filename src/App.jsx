import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Adicionamos .jsx no final para garantir que o servidor encontre o arquivo exato
import Lotes from "./pages/Lotes.jsx";
import Rastreamento from "./pages/Rastreamento.jsx";
import { LayoutDashboard, Radar, Shield } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white font-sans">
        {/* Menu Superior - Estilo Investigador */}
        <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xl tracking-tighter">
              <Shield className="w-6 h-6 fill-amber-500 text-slate-900" />
              <span>BUSCA<span className="text-white ml-1">LEILÕES</span></span>
            </div>
            
            <div className="flex gap-4 md:gap-8">
              <Link to="/" className="flex items-center gap-2 text-sm font-semibold hover:text-amber-400 transition-all border-b-2 border-transparent hover:border-amber-500 pb-1">
                <LayoutDashboard className="w-4 h-4" /> Painel
              </Link>
              <Link to="/rastreamento" className="flex items-center gap-2 text-sm font-semibold hover:text-amber-400 transition-all border-b-2 border-transparent hover:border-amber-500 pb-1">
                <Radar className="w-4 h-4" /> Investigar
              </Link>
            </div>
          </div>
        </nav>

        {/* Área das Páginas */}
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Lotes />} />
            <Route path="/rastreamento" element={<Rastreamento />} />
          </Routes>
        </main>
        
        <footer className="text-center py-10 text-slate-600 text-xs uppercase tracking-widest">
          Sistema de Monitoramento de Leilões v2.0 | IA Gemini Ativa
        </footer>
      </div>
    </Router>
  );
}

export default App;
