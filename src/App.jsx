import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// Importação direta e minúscula
import Lotes from "./pages/lotes.jsx";
import Rastreamento from "./pages/rastreamento.jsx";
import { LayoutDashboard, Radar, Shield } from "lucide-react";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 p-4 flex gap-6">
          <Link to="/" className="hover:text-amber-500">Painel</Link>
          <Link to="/rastreamento" className="hover:text-amber-500">Investigar</Link>
        </nav>
        <main className="p-4">
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
