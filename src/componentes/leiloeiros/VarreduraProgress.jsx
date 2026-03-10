import React from "react";
import { CheckCircle2, Loader2, AlertCircle, Globe } from "lucide-react";

export default function VarreduraProgress({ progresso }) {
  // progresso: [{ leiloeiro, status: 'aguardando'|'varrendo'|'ok'|'vazio'|'erro', lotes: number }]
  if (!progresso || progresso.length === 0) return null;

  const concluidos = progresso.filter(p => ["ok", "vazio", "erro"].includes(p.status));
  const total = progresso.length;
  const totalLotes = progresso.reduce((acc, p) => acc + (p.lotes || 0), 0);
  const pct = Math.round((concluidos.length / total) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      {/* Barra de progresso */}
      <div className="h-2 bg-gray-100">
        <div
          className="h-2 bg-yellow-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Resumo */}
      <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700">
          {concluidos.length === total
            ? `✅ Concluído — ${totalLotes} lote(s) importado(s) de ${total} site(s)`
            : `Varrendo sites... ${concluidos.length}/${total} — ${totalLotes} lote(s) encontrado(s)`}
        </span>
        <span className="text-gray-400 font-mono">{pct}%</span>
      </div>

      {/* Lista de itens */}
      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        {progresso.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-2.5 text-sm">
            {item.status === "varrendo" && <Loader2 className="w-4 h-4 text-yellow-500 animate-spin flex-shrink-0" />}
            {item.status === "ok" && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
            {item.status === "vazio" && <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            {item.status === "erro" && <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {item.status === "aguardando" && <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />}

            <span className={`flex-1 truncate ${item.status === "varrendo" ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
              {item.leiloeiro.nome}
            </span>
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{item.leiloeiro.site}</span>
            {item.status === "ok" && (
              <span className="text-xs bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                +{item.lotes} lote(s)
              </span>
            )}
            {item.status === "vazio" && (
              <span className="text-xs text-gray-400 flex-shrink-0">sem lotes</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
