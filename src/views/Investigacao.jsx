import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient"; 
import { Radar, RefreshCw, Loader2, ShieldAlert } from "lucide-react";

// CORREÇÃO: Adicionado o "e" em componentEs conforme sua pasta no GitHub
import FormRastreamento from "@/componentes/tracker/SearchForm.jsx";
import { CardRastreamento } from "@/componentes/tracker/ResultCard.jsx";


export default function Rastreamento() {
  const [rastreamentos, setRastreamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega o histórico de investigações da aba "Lotes" ou da sua planilha
  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const data = await leilaoClient.getLotes(); 
      // Filtramos apenas os que possuem placa ou chassi preenchidos para o histórico
      const historico = data.filter(item => item.placa || item.chassi);
      setRastreamentos(historico);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    carregarHistorico(); 
  }, []);

  const handleNovoResultado = (novo) => {
    // Quando o Gemini termina a busca, o novo card aparece no topo
    setRastreamentos(prev => [novo, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho de Investigação */}
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-amber-500">
              <Radar className="w-8 h-8 animate-pulse text-amber-600" />
              CENTRAL DE INVESTIGAÇÃO
            </h1>
            <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest font-medium">
              Varredura de Recall • Histórico de Donos • Localidade
            </p>
          </div>
          <button
            onClick={carregarHistorico}
            className="p-3 bg-slate-900 border border-slate-800 rounded-full hover:border-amber-500 hover:text-amber-500 transition-all shadow-lg"
            title="Atualizar Banco de Dados"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          </button>
        </div>

        {/* Formulário de Busca (O motor que aciona o Gemini) */}
        <div className="mb-12">
          <FormRastreamento onResultado={handleNovoResultado} />
        </div>

        {/* Listagem de Resultados da Investigação */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" />
            Dossiês Recentes ({rastreamentos.length})
          </div>

          {loading && rastreamentos.length === 0 ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : rastreamentos.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
              <div className="text-6xl mb-4 opacity-20">🕵️‍♂️</div>
              <h3 className="text-slate-400 font-medium italic">Nenhum dossiê gerado ainda. Digite uma placa acima.</h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {rastreamentos.map((resultado, index) => (
                <CardRastreamento
                  key={resultado.id || index}
                  dados={resultado}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Marca d'água de Sistema Ativo */}
      <div className="fixed bottom-4 right-4 text-[10px] text-slate-800 font-mono rotate-90 origin-bottom-right">
        SECURE_ACCESS_GRANTED // AI_INVESTIGATOR_V2
      </div>
    </div>
  );
}
