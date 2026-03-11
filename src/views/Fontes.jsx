import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  UserPlus, Search, Globe, Phone, Mail, MapPin, 
  Loader2, RefreshCw, Plus, ShieldCheck 
} from "lucide-react";

export default function Leiloeiros() {
  const [leiloeiros, setLeiloeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Carrega os leiloeiros da planilha
  const carregarLeiloeiros = async () => {
    setLoading(true);
    try {
      const data = await leilaoClient.getLeiloeiros(); // Vamos criar essa função no Client
      setLeiloeiros(data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarLeiloeiros(); }, []);

  // Chama a busca automática (Gemini)
  const handleBuscaAutomatica = async () => {
    setIsSearching(true);
    try {
      await leilaoClient.executarBuscaAutomatica();
      alert("Busca em Juntas Comerciais e TJs iniciada em segundo plano!");
      carregarLeiloeiros();
    } catch (error) {
      alert("Erro ao iniciar busca.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header com Ações */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-amber-500 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8" />
              GESTÃO DE LEILOEIROS
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-tighter">Homologados e Monitoramento de Juntas Comerciais</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleBuscaAutomatica}
              disabled={isSearching}
              className="flex items-center gap-2 bg-slate-900 border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-all px-4 py-2 rounded-lg font-bold text-xs"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              BUSCA AUTOMÁTICA (IA)
            </button>
            <button className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-400 transition-all">
              <Plus className="w-4 h-4" />
              ADICIONAR MANUAL
            </button>
          </div>
        </div>

        {/* Tabela de Leiloeiros */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-amber-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Leiloeiro / Instituição</th>
                <th className="p-4 text-center">Contato</th>
                <th className="p-4">Localização</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" /></td></tr>
              ) : leiloeiros.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-sm">{l.nome}</div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Globe className="w-3 h-3" /> {l.site}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-center justify-center">
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-800 px-2 py-1 rounded">
                        <Phone className="w-3 h-3 text-amber-500" /> {l.telefone}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <Mail className="w-3 h-3 text-slate-500" /> {l.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin className="w-3 h-3 text-red-500" /> {l.localizacao}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-900/30 text-green-500 text-[9px] font-black rounded-full border border-green-500/30 uppercase">
                      {l.status || "Ativo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-amber-500 hover:text-black rounded-lg transition-all">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
