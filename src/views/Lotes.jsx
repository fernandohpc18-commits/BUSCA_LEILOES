import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  Gavel, Clock, MapPin, ExternalLink, 
  TrendingUp, Loader2, Filter, AlertCircle 
} from "lucide-react";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header do Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
              <Gavel className="text-amber-500 w-10 h-10" />
              OPORTUNIDADES <span className="text-amber-500">IA</span>
            </h1>
            <p className="text-slate-400 mt-1 uppercase text-xs tracking-[0.2em]">Monitoramento de Leilões em Tempo Real</p>
          </div>
          
          <button 
            onClick={carregarLotes}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold text-sm"
          >
            <Filter className="w-4 h-4 text-amber-500" />
            FILTRAR BUSCA
          </button>
        </div>

        {/* Grid de Lotes */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <p className="text-slate-500 animate-pulse">Sincronizando com a base do Google...</p>
          </div>
        ) : lotes.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
            <AlertCircle className="w-16 h-16 mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Nenhum lote disponível</h3>
            <p className="text-slate-600">Clique em "Varrer Lotes" na tela de Fontes para gerar novos dados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lotes.map((lote, index) => (
              <div key={index} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all group shadow-xl">
                
                {/* Imagem do Bem */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={lote.imagens || "https://placehold.co/600x400?text=Sem+Foto"} 
                    alt={lote.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {lote.tipo_bem || "Veículo"}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 p-4">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                      <Clock className="w-3 h-3" /> 2d 04h 12m
                    </div>
                  </div>
                </div>

                {/* Info do Lote */}
                <div className="p-5">
                  <h2 className="text-lg font-bold leading-tight mb-2 group-hover:text-amber-400 transition-colors">
                    {lote.titulo}
                  </h2>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-4">
                    <MapPin className="w-3 h-3" /> {lote.praca || "Brasil"} • <span className="text-slate-600 font-mono">{lote.placa || "---"}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800 mb-5">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Avaliação</p>
                      <p className="text-sm font-bold text-slate-300">R$ {Number(lote.lance_inicial).toLocaleString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-amber-500 uppercase font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Lance Atual
                      </p>
                      <p className="text-lg font-black text-white">R$ {Number(lote.lance_atual).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  <a 
                    href={lote.site_leilao} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-black py-3 rounded-xl transition-all text-sm uppercase"
                  >
                    Ir para o Leilão
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
