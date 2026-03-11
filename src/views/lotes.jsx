import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  Gavel, Filter, LayoutGrid, List, Search, 
  MapPin, Calendar, ExternalLink, ChevronLeft, ChevronRight,
  TrendingUp, Award, Loader2
} from "lucide-react";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await leilaoClient.getLotes();
        setLotes(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    carregar();
  }, []);

  // Lógica de Filtro
  const lotesFiltrados = lotes.filter(l => {
    const matchesTipo = filtroTipo === "Todos" || l.tipo_bem === filtroTipo;
    const matchesBusca = l.titulo?.toLowerCase().includes(busca.toLowerCase());
    return matchesTipo && matchesBusca;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header e Filtros */}
        <div className="flex flex-col gap-6 mb-10 border-b border-slate-800 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-amber-500 italic tracking-tighter">OS MEUS LOTES</h1>
              <p className="text-slate-500 font-mono text-xs mt-1 underline">CATÁLOGO GLOBAL DE OPORTUNIDADES</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex">
               <button className="p-2 bg-amber-500 text-black rounded shadow-lg"><LayoutGrid size={18}/></button>
               <button className="p-2 text-slate-500 hover:text-white"><List size={18}/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar placa, título ou matrícula..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 text-sm outline-none focus:border-amber-500 transition-all"
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none"
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="Todos">Todos os Tipos</option>
              <option value="Carro">Carros</option>
              <option value="Moto">Motos</option>
              <option value="Apartamento">Apartamentos</option>
              <option value="Sítio/Fazenda">Sítios/Fazendas</option>
            </select>
            <button className="bg-amber-600 hover:bg-amber-500 text-black font-black uppercase text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <RefreshCw size={16}/> Sincronizar Varredura
            </button>
          </div>
        </div>

        {/* Grid de Cards Super Trunfo */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-amber-500 mb-4" size={48} />
            <p className="text-slate-500 font-mono">VASCULHANDO BANCO DE DADOS...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {lotesFiltrados.map((lote) => (
              <CardSuperTrunfo key={lote.id} lote={lote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente Interno do Card "Super Trunfo"
function CardSuperTrunfo({ lote }) {
  const imagens = lote.imagens?.split(',') || ['https://via.placeholder.com/400x300?text=Sem+Imagem'];

  return (
    <div className="group bg-slate-900 border-2 border-slate-800 hover:border-amber-500 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col">
      {/* Topo / Carrossel */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imagens[0]} 
          alt={lote.titulo} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-black/80 backdrop-blur-md text-amber-500 text-[9px] font-black px-2 py-1 rounded border border-amber-500/30 uppercase italic">
            {lote.tipo_bem}
          </span>
          <span className="bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded uppercase">
            {lote.categoria}
          </span>
        </div>
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-900 p-4">
           <p className="text-white font-black text-sm leading-tight uppercase line-clamp-2">{lote.titulo}</p>
        </div>
      </div>

      {/* Corpo / Stats */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Lance Inicial</span>
            <span className="text-white font-black text-xs">R$ {lote.lance_inicial}</span>
          </div>
          <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[9px] text-amber-500 uppercase block font-bold">Lance Atual</span>
            <span className="text-amber-500 font-black text-xs">R$ {lote.lance_atual}</span>
          </div>
        </div>

        <div className="space-y-1 text-[10px] text-slate-400 font-medium">
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-red-500"/> Local</span>
            <span className="text-slate-200">{lote.praca}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1"><Award size={12} className="text-blue-500"/> Matrícula/Placa</span>
            <span className="text-slate-200">{lote.matricula || lote.placa || '---'}</span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><Calendar size={12} className="text-amber-500"/> Lote</span>
            <span className="text-slate-200">#{lote.numero_lote}</span>
          </div>
        </div>

        <a 
          href={lote.site_leilao} 
          target="_blank" 
          rel="noreferrer"
          className="mt-auto bg-slate-800 group-hover:bg-amber-500 text-white group-hover:text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase italic"
        >
          Dar Lance <ExternalLink size={14}/>
        </a>
      </div>
    </div>
  );
}
