import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Usando o alias @ para evitar erros de caminho relativo
import Lotes from "@/pages/Lotes";
import Rastreamento from "@/pages/Rastreamento";
import { LayoutDashboard, Radar, Shield } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xl">
              <Shield className="w-6 h-6 fill-amber-500 text-slate-900" />
              <span>BUSCA<span className="text-white ml-1">LEILÕES</span></span>
            </div>
            <div className="flex gap-8">
              <Link to="/" className="text-sm font-semibold hover:text-amber-400">Painel</Link>
              <Link to="/rastreamento" className="text-sm font-semibold hover:text-amber-400">Investigar</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Lotes />} />
            <Route path="/rastreamento" element={<Rastreamento />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
