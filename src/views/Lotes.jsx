import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  Gavel, Clock, MapPin, ExternalLink, 
  TrendingUp, Loader2, Search, Filter, 
  Car, Home, Tag, Calendar
} from "lucide-react";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const carregarLotes = async () => {
    setLoading(true);
    try {
      const data = await leilaoClient.getLotes();
      setLotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar lotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarLotes(); }, []);

  // Lógica de Filtro e Busca
  const lotesFiltrados = lotes.filter(l => {
    const matchBusca = l.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
                       l.marca?.toLowerCase().includes(busca.toLowerCase()) ||
                       l.modelo?.toLowerCase().includes(busca.toLowerCase());
    
    const matchTipo = filtroTipo === "todos" || l.tipo_bem?.toLowerCase() === filtroTipo.toLowerCase();
    
    return matchBusca && matchTipo;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header e Filtros */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3 tracking-tighter">
                <Gavel className="text-amber-500 w-10 h-10" />
                OPORTUNIDADES <span className="text-amber-500">REAIS</span>
              </h1>
              <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest">Base de Dados Sincronizada via IA</p>
            </div>
            
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setFiltroTipo("todos")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filtroTipo === 'todos' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >TODOS</button>
              <button 
                onClick={() => setFiltroTipo("veiculo")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${filtroTipo === 'veiculo' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
              ><Car className="w-3 h-3" /> VEÍCULOS</button>
              <button 
                onClick={() => setFiltroTipo("imóvel")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${filtroTipo === 'imóvel' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}
              ><Home className="w-3 h-3" /> IMÓVEIS</button>
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text"
              placeholder="Pesquisar por marca, modelo ou título..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500/50 transition-all text-sm"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Lotes */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <p className="text-slate-500 animate-pulse font-bold uppercase tracking-tighter">Processando Lotes Reais...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotesFiltrados.map((l, index) => (
              <div key={index} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-amber-500/30 transition-all group relative flex flex-col">
                
                {/* Badge de Localização */}
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" /> {l.cidade} - {l.estado}
                </div>

                {/* Imagem Placeholder Inteligente */}
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <img 
                    src={`https://placehold.co/600x400/0f172a/f59e0b?text=${l.marca || 'Leilão'}+${l.modelo || ''}`} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>

                {/* Info do Lote */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex gap-2 mb-3">
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {l.marca || "Geral"}
                    </span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-black px-2 py-1 rounded border border-slate-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {l.ano || "N/D"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-tight mb-2 text-white group-hover:text-amber-400 transition-colors uppercase italic">
                    {l.titulo}
                  </h2>
                  
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 italic">
                    {l.descricao}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Lance Inicial</p>
                        <p className="text-xs text-slate-400 line-through">R$ {Number(l.lance_inicial).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-amber-500 font-black uppercase flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3" /> Lance Atual
                        </p>
                        <p className="text-2xl font-black text-white leading-none tracking-tighter">
                          R$ {Number(l.lance_atual || l.lance_inicial).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <a 
                      href={l.link_original} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-amber-500 text-black font-black py-4 rounded-2xl transition-all text-xs uppercase"
                    >
                      Aceder ao Lote Real
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
