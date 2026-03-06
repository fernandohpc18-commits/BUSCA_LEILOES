import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Loader2, RefreshCw } from "lucide-react";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function BuscaLeiloeiros({ onResultados }) {
  const [estado, setEstado] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    setLoading(true);
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em leiloeiros oficiais do Brasil cadastrados nas Juntas Comerciais.

Busque e liste leiloeiros oficiais cadastrados nas Juntas Comerciais brasileiras${estado ? ` do estado ${estado}` : " de todos os estados"}${nome ? ` com nome contendo "${nome}"` : ""}.

Para cada leiloeiro, forneça o máximo de informações disponíveis.
Liste pelo menos 8 a 15 leiloeiros com dados reais dos registros públicos das Juntas Comerciais do Brasil (JUCESP, JUCERJ, JUCEMG, etc).

Retorne dados estruturados de leiloeiros cadastrados oficialmente.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          leiloeiros: {
            type: "array",
            items: {
              type: "object",
              properties: {
                nome: { type: "string" },
                cpf_cnpj: { type: "string" },
                matricula: { type: "string" },
                junta_comercial: { type: "string" },
                estado: { type: "string" },
                cidade: { type: "string" },
                telefone: { type: "string" },
                email: { type: "string" },
                site: { type: "string" },
                especialidades: { type: "array", items: { type: "string" } },
                data_registro: { type: "string" },
                ativo: { type: "boolean" }
              }
            }
          }
        }
      }
    });

    // Salvar no banco
    if (resultado?.leiloeiros?.length > 0) {
      await base44.entities.Leiloeiro.bulkCreate(resultado.leiloeiros);
    }

    onResultados(resultado?.leiloeiros || []);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-500" />
        Buscar Leiloeiros nas Juntas Comerciais
      </h3>
      <div className="flex flex-wrap gap-3">
        <select
          value={estado}
          onChange={e => setEstado(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="">Todos os estados</option>
          {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
        </select>
        <input
          type="text"
          placeholder="Nome do leiloeiro (opcional)"
          value={nome}
          onChange={e => setNome(e.target.value)}
          onKeyDown={e => e.key === "Enter" && buscar()}
          className="flex-1 min-w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={buscar}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
      {loading && (
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Consultando Juntas Comerciais de todo o Brasil...
        </p>
      )}
    </div>
  );
}
