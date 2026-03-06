import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Radar, RefreshCw } from "lucide-react";
import FormRastreamento from "@/components/rastreamento/FormRastreamento";
import CardRastreamento from "@/components/rastreamento/CardRastreamento";

export default function Rastreamento() {
  const [rastreamentos, setRastreamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const data = await base44.entities.Rastreamento.list("-created_date", 100);
    setRastreamentos(data);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  const handleNovoResultado = (novo) => {
    setRastreamentos(prev => [novo, ...prev]);
  };

  const handleRemovido = (id) => {
    setRastreamentos(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <Radar className="w-7 h-7 text-indigo-500" />
              Rastreamento
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Consulte bens por placa, chassi, matrícula, processo ou localização
            </p>
          </div>
          <button
            onClick={carregar}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl border border-gray-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Formulário */}
        <div className="mb-6">
          <FormRastreamento onResultado={handleNovoResultado} />
        </div>

        {/* Histórico */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : rastreamentos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-700 mb-1">Nenhuma consulta realizada</h3>
            <p className="text-sm text-gray-400">Use o formulário acima para rastrear um bem.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-400 font-medium">
              Histórico de consultas ({rastreamentos.length})
            </div>
            {rastreamentos.map(r => (
              <CardRastreamento
                key={r.id}
                rastreamento={r}
                onRemovido={handleRemovido}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
