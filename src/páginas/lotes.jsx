import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { LayoutDashboard, ExternalLink, Tag } from "lucide-react";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const data = await leilaoClient.getLotes();
      setLotes(data);
      setLoading(false);
    };
    carregar();
  }, []);

  if (loading) return <div className="p-10 text-center text-gold-500">Carregando Super Trunfo...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {lotes.map((lote, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:border-gold-500 transition-all group">
          <div className="h-48 bg-slate-800 overflow-hidden">
             <img src={lote.imagem || "https://images.unsplash.com/photo-1512428559087-560ad518528c?auto=format&fit=crop&q=80&w=400"} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{lote.titulo}</h3>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-slate-400">Lance: <b className="text-green-400">R$ {lote.lance}</b></span>
              <span className="bg-slate-800 px-2 py-1 rounded text-xs text-gold-400 font-bold uppercase">{lote.estado}</span>
            </div>
            <a href={lote.link} target="_blank" className="flex items-center justify-center gap-2 w-full bg-gold-600 text-slate-950 py-3 rounded-xl font-bold hover:bg-gold-500 transition-colors">
              VER LEILÃO <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
