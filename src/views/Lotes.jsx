import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  Gavel, Clock, MapPin, ExternalLink, 
  TrendingUp, Loader2, Search, Filter, 
  Car, Home, Tag, Calendar, BadgePercent
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

  // Filtros inteligentes
  const lotesFiltrados = lotes.filter(l => {
    const termo = busca.toLowerCase();
    const matchBusca = 
      l.titulo?.toLowerCase().includes(termo) || 
      l.marca?.toLowerCase().includes(termo) ||
      l.modelo?.toLowerCase().includes(termo) ||
      l.cidade?.toLowerCase().includes(termo);
    
    const matchTipo = filtroTipo === "todos" || l.tipo_bem?.toLowerCase() === filtroTipo.toLowerCase();
    return matchBusca && matchTipo;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header e Filtros */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3 tracking-tighter">
                <Gavel className="text-amber-500 w-10 h-10" />
                OPORTUNIDADES <span className="text-amber-500">REAIS</span>
              </h1>
              <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.3em] font-bold">Inteligência em Arrematações</p>
            </div>
            
            <div className="flex gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button onClick={() => setFiltroTipo("todos")} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${filtroTipo === 'todos' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}>TODOS</button>
              <button onClick={() => setFiltroTipo("veiculo")} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${filtroTipo === 'veiculo' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}><Car className="w-3 h-3" /> VEÍCULOS</button>
              <button onClick={() => setFiltroTipo("imóvel")} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${filtroTipo === 'imóvel' ? 'bg-amber-500 text-black' : 'text-slate-500 hover:text-white'}`}><Home className="w-3 h-3" /> IMÓVEIS</button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text"
              placeholder="Pesquise por marca, placa, cidade ou modelo..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-5 pl-14 pr-4 focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 transition-all text-sm font-medium"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Listagem */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Sincronizando Base de Dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lotesFiltrados.map((l, index) => {
              // Cálculo de Oportunidade
              const avaliacao = parseFloat(l.valor_avaliacao) || 0;
              const atual = parseFloat(l.lance_atual || l.lance_inicial) || 0;
              const desconto = avaliacao > 0 ? Math.round(((avaliacao - atual) / avaliacao) * 100) : 0;

              return (
                <div key={index} className="bg-slate-900 rounded-[32px] border border-slate-800 overflow-hidden hover:border-amber-500/40 transition-all group flex flex-col shadow-2xl">
                  
                  {/* Foto/Thumb com Overlay de Desconto */}
                  <div className="h-48 bg-slate-800 relative overflow-hidden">
                    <img 
                      src={`https://placehold.co/600x400/0f172a/f59e0b?text=${l.marca || 'Lote'}+${l.modelo || ''}`} 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    
                    {desconto > 0 && (
                      <div className="absolute top-4 left-4 bg-green-500 text-black text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/20">
                        <BadgePercent className="w-3 h-3" /> {desconto}% ABAIXO DA AVALIAÇÃO
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[10px] font-bold text-slate-300">
                      <MapPin className="w-3 h-3 text-red-500" /> {l.cidade} / {l.estado}
                    </div>
                  </div>

                  {/* Detalhes do Lote */}
                  <div className="p-7 flex-grow flex flex-col">
                    <div className="flex gap-2 mb-4">
                      <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-slate-700">
                        {l.tipo_bem}
                      </span>
                      <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-amber-500/20">
                        {l.marca}
                      </span>
                      <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-slate-700">
                        <Calendar className="w-2.5 h-2.5 inline mr-1" /> {l.ano}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold leading-tight mb-3 text-white group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter">
                      {l.titulo}
                    </h2>
                    
                    <p className="text-slate-500 text-xs line-clamp-2 mb-6 italic leading-relaxed">
                      {l.descricao}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/50">
                        <div>
                          <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Avaliação</p>
                          <p className="text-xs text-slate-500 font-bold">R$ {Number(avaliacao).toLocaleString('pt-BR')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] text-amber-500 font-black uppercase mb-1 flex items-center justify-end gap-1">
                            <TrendingUp className="w-2.5 h-2.5" /> Lance Atual
                          </p>
                          <p className="text-xl font-black text-white tracking-tighter leading-none">
                            R$ {Number(atual).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <a 
                        href={l.link_original} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all text-[11px] uppercase tracking-widest active:scale-95 shadow-lg shadow-amber-500/10"
                      >
                        Ver Detalhes no Leiloeiro
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
