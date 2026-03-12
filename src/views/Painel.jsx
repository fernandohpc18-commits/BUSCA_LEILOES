import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  TrendingUp, Users, Package, AlertCircle, 
  Activity, Clock, ShieldCheck, ArrowUpRight, Search, Loader2
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalLotes: 0, totalLeiloeiros: 0, investigacoes: 0, valorTotal: 0 });
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [lotes, leiloeiros] = await Promise.all([
        leilaoClient.getLotes(),
        leilaoClient.getLeiloeiros()
      ]);
      const valor = lotes.reduce((acc, curr) => acc + (Number(curr.lance_atual) || 0), 0);
      setStats({
        totalLotes: lotes.length,
        totalLeiloeiros: leiloeiros.length,
        investigacoes: lotes.filter(l => l.status === "investigando").length,
        valorTotal: valor
      });
    } catch (e) { console.error("Erro no Dashboard:", e); } finally { setLoading(false); }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleVarrerLotes = async () => {
    if (isScanning) return;
    setIsScanning(true);
    try {
      await leilaoClient.executarBuscaAutomatica();
      alert("Varredura iniciada! O robô do Google está processando os sites. Aguarde um minuto e recarregue a página para ver os novos lotes.");
      setTimeout(carregarDados, 10000); // Tenta atualizar após 10 segundos
    } catch (error) {
      alert("Erro ao conectar com o serviço de varredura.");
    } finally { setIsScanning(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-amber-500 italic tracking-tighter uppercase">Painel de Controle</h1>
            <p className="text-slate-500 font-mono text-xs flex items-center gap-2">
              <Activity size={14} className="text-green-500 animate-pulse" /> SISTEMA DE VARREDURA OPERACIONAL
            </p>
          </div>
          <button 
            onClick={handleVarrerLotes}
            disabled={isScanning}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-xs transition-all ${
              isScanning ? "bg-slate-800 text-slate-500" : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {isScanning ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            {isScanning ? "Varrendo Sites..." : "Iniciar Varredura IA"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Cards de estatísticas aqui... (mantendo seu estilo anterior) */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-amber-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
              <Clock size={16} /> Status da Varredura IA
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-500 animate-ping' : 'bg-green-500'}`}></div>
                <p className="text-xs font-bold">{isScanning ? "IA Analisando sites de leilão agora..." : "Gemini 1.5 Flash: Pronto para operar"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
