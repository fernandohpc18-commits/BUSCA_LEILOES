import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Lotes from "./pages/Lotes";
import Rastreamento from "./pages/Rastreamento";
import { LayoutDashboard, Radar } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Menu Superior Simples */}
        <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gold-500 font-bold text-xl tracking-tighter">
              <span className="bg-gold-500 text-slate-950 px-2 py-0.5 rounded">BUSCA</span>
              LEILÕES
            </div>
            
            <div className="flex gap-6">
              <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:text-gold-400 transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Lotes
              </Link>
              <Link to="/rastreamento" className="flex items-center gap-2 text-sm font-medium hover:text-gold-400 transition-colors">
                <Radar className="w-4 h-4" /> Rastreamento
              </Link>
            </div>
          </div>
        </nav>

        {/* Conteúdo das Páginas */}
        <main className="max-w-7xl mx-auto py-6">
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
