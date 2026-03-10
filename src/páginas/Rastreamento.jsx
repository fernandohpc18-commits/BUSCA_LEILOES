import React, { useState, useEffect } from "react";
// Trocamos o base44 pelo seu novo cliente
import { leilaoClient } from "@/API/leilaoClient"; 
import { Radar, RefreshCw, Loader2 } from "lucide-react";
import FormRastreamento from "@/components/rastreamento/FormRastreamento";
import { CardRastreamento } from "@/components/rastreamento/CardRastreamento";

export default function Rastreamento() {
  const [rastreamentos, setRastreamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar o histórico que está na sua Planilha Google
  const carregar = async () => {
    setLoading(true);
    try {
      // Aqui buscamos os dados da aba "Lotes" ou uma lógica de histórico que você tenha
      const data = await leilaoClient.getLotes(); 
      setRastreamentos(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const handleNovoResultado = (novo) => {
    // Adiciona o novo resultado de investigação no topo da lista
    setRastreamentos(prev => [novo, ...prev]);
  };

  const handleRemovido = (id) => {
    setRastreamentos(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header - Visual mais Dark/Profissional */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-gold-400">
              <Radar className="w-7 h-7 text-gold-500 animate-pulse" />
              Busca Leilões: Investigação
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Módulo de rastreamento avançado via IA (Recall, Donos e Localidade)
            </p>
          </div>
          <button
            onClick={carregar}
            className="p-2.5 text-slate-400 hover:text-gold-400 hover:bg-slate-900 rounded-xl border border-slate-800 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>

        {/* Formulário de Busca - Onde o usuário digita a Placa */}
        <div className="mb-8">
          <FormRastreamento onResultado={handleNovoResultado} />
        </div>

        {/* Listagem de Resultados */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-900/50 rounded-2xl h-32 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : rastreamentos.length === 0 ? (
          <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-14 text-center">
            <div className="text-5xl mb-4 opacity-50">🕵️‍♂️</div>
            <h3 className="font-semibold text-slate-300 mb-1">Pronto para investigar</h3>
            <p className="text-sm text-slate-500">Insira uma placa ou chassi para iniciar a varredura nacional.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-slate-500 font-medium flex justify-between items-center">
              <span>Investigações Recentes ({rastreamentos.length})</span>
            </div>
            {rastreamentos.map((r, index) => (
              <CardRastreamento
                key={r.id || index}
                dados={r} // Passamos os dados para o novo CardInvestigacao
                onRemovido={handleRemovido}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
