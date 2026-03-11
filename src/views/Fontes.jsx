import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  Search, Globe, Phone, Mail, MapPin, 
  Loader2, RefreshCw, Plus, ShieldCheck, AlertCircle 
} from "lucide-react";

export default function Fontes() {
  const [leiloeiros, setLeiloeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Carrega os leiloeiros da planilha
  const carregarLeiloeiros = async () => {
    setLoading(true);
    try {
      const data = await leilaoClient.getLeiloeiros();
      // Garante que 'data' seja sempre um array
      setLeiloeiros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar leiloeiros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    carregarLeiloeiros(); 
  }, []);

  // Chama a busca automática (Gemini via POST)
  const handleBuscaAutomatica = async () => {
    setIsSearching(true);
    try {
      await leilaoClient.executarBuscaAutomatica();
      alert("Comando enviado! A IA está processando e os dados aparecerão na planilha em breve.");
      // Dá um tempo para o Google processar antes de recarregar
      setTimeout(carregarLeiloeiros, 3000);
    } catch (error) {
      alert("Erro ao iniciar busca automática.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-amber-500 flex items-center gap-2 tracking-tighter">
              <ShieldCheck className="w-8 h-8" />
              GESTÃO DE LEILOEIROS
            </h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">
              Homologados e Monitoramento de Juntas Comerciais
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={carregarLeiloeiros}
              className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all"
              title="Atualizar Lista"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleBuscaAutomatica}
              disabled={isSearching}
              className="flex items-center gap-2 bg-slate-900 border border-amber-500/50 hover:bg-amber-500 hover:text-black transition-all px-4 py-2 rounded-lg font-bold text-xs"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              BUSCA AUTOMÁTICA (IA)
            </button>
            <button className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
              <Plus className="w-4 h-4" />
              ADICIONAR MANUAL
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
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
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-amber-500 mb-2" />
                      <p className="text-slate-500 text-sm">Acessando Planilha Google...</p>
                    </td>
                  </tr>
                ) : leiloeiros.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <AlertCircle className="w-10 h-10 mx-auto text-slate-700 mb-2" />
                      <p className="text-slate-500 text-sm">Nenhum dado encontrado na planilha.</p>
                    </td>
                  </tr>
                ) : (
                  leiloeiros.map((l, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-sm text-slate-100">{l.nome || "Não informado"}</div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <Globe className="w-3 h-3 text-amber-500/50" /> 
                          <a href={l.site} target="_blank" rel="noreferrer" className="hover:text-amber-400 truncate max-w-[200px]">
                            {l.site || "Sem site"}
                          </a>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-950/50 px-2 py-1 rounded border border-slate-800 w-full justify-start">
                            <Phone className="w-3 h-3 text-amber-500" /> {l.telefone || "N/D"}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 w-full justify-start px-2">
                            <Mail className="w-3 h-3 text-slate-600" /> {l.email || "N/D"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-red-500/70" /> {l.localizacao || "Brasil"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[9px] font-black rounded-full border uppercase ${
                          l.status === 'Inativo' ? 'bg-red-900/20 text-red-500 border-red-500/30' : 'bg-green-900/20 text-green-500 border-green-500/30'
                        }`}>
                          {l.status || "Ativo"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-500 hover:bg-amber-500 hover:text-black rounded-lg transition-all">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
