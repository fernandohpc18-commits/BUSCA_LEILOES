import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Loader2, Car, Building2, FileText, MapPin, Hash } from "lucide-react";

const TIPOS = [
  { value: "placa", label: "Placa", icon: Car, placeholder: "Ex: ABC-1234" },
  { value: "chassi", label: "Chassi", icon: Hash, placeholder: "Ex: 9BWZZZ377VT004251" },
  { value: "matricula", label: "Matrícula", icon: Building2, placeholder: "Ex: 12.345" },
  { value: "processo", label: "Processo", icon: FileText, placeholder: "Ex: 0001234-12.2023.8.26.0001" },
  { value: "cidade_estado", label: "Cidade/Estado", icon: MapPin, placeholder: "Ex: São Paulo, SP" },
];

export default function FormRastreamento({ onResultado }) {
  const [tipo, setTipo] = useState("placa");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  const tipoAtual = TIPOS.find(t => t.value === tipo);

  const buscar = async () => {
    if (!valor.trim()) return;
    setLoading(true);

    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um assistente especializado em rastreamento de bens e processos judiciais no Brasil.

Realize uma busca AMPLA e COMPLETA sobre o bem/processo abaixo, consultando TODAS as fontes públicas disponíveis na internet:

Tipo de busca: ${tipo}
Valor buscado: ${valor}

FONTES A CONSULTAR (pesquise em todas):
- Sites de leilões: Banco do Brasil Leilões, Caixa, Santander, Itaú, Bradesco leilões, leilões judiciais, sites de leiloeiros
- Tribunais de Justiça: TJ de todos os estados, CNJ, JusBrasil, PJe, PROJUDI, e-SAJ, TJSP, TJRJ, TJMG etc.
- DETRAN e DENATRAN: situação veicular, restrições, roubo/furto, gravame
- Registros de imóveis e cartórios
- Receita Federal e SINTEGRA
- Instagram, Facebook e redes sociais (perfis públicos relacionados ao leiloeiro ou ao processo)
- Diário Oficial da União e dos Estados
- Portais de transparência pública
- Qualquer outra fonte pública relevante encontrada

Retorne um JSON estruturado com:
1. "bem": objeto com dados do bem (descricao, marca, modelo, ano, cor, situacao, proprietario, endereco)
2. "tem_processo": boolean indicando se há processo associado
3. "processo": se tem_processo=true, objeto com (numero, tipo, vara, comarca, estado, partes, valor_causa, valor_debito, valor_avaliacao, valor_minimo_1_praca, valor_minimo_2_praca, data_distribuicao, data_leilao, situacao_processo, fase, leiloeiro, observacoes)
4. "resultado_resumo": texto detalhado resumindo TUDO que foi encontrado em TODAS as fontes consultadas, citando cada fonte encontrada

Se não encontrar dados concretos em alguma fonte, informe claramente quais fontes foram consultadas e o que foi encontrado em cada uma.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          bem: {
            type: "object",
            properties: {
              descricao: { type: "string" },
              marca: { type: "string" },
              modelo: { type: "string" },
              ano: { type: "string" },
              cor: { type: "string" },
              situacao: { type: "string" },
              proprietario: { type: "string" },
              endereco: { type: "string" },
            }
          },
          tem_processo: { type: "boolean" },
          processo: {
            type: "object",
            properties: {
              numero: { type: "string" },
              tipo: { type: "string" },
              vara: { type: "string" },
              comarca: { type: "string" },
              estado: { type: "string" },
              partes: { type: "string" },
              valor_causa: { type: "number" },
              valor_debito: { type: "number" },
              valor_avaliacao: { type: "number" },
              valor_minimo_1_praca: { type: "number" },
              valor_minimo_2_praca: { type: "number" },
              data_distribuicao: { type: "string" },
              data_leilao: { type: "string" },
              situacao_processo: { type: "string" },
              fase: { type: "string" },
              leiloeiro: { type: "string" },
              observacoes: { type: "string" },
            }
          },
          resultado_resumo: { type: "string" }
        }
      }
    });

    // Salvar no banco
    const rastreamento = await base44.entities.Rastreamento.create({
      tipo_busca: tipo,
      [tipo === "cidade_estado" ? "cidade" : tipo]: valor,
      estado: tipo === "cidade_estado" ? valor.split(",")[1]?.trim() : undefined,
      bem: resultado.bem,
      processo: resultado.processo,
      tem_processo: resultado.tem_processo || false,
      resultado_busca: resultado.resultado_resumo,
    });

    setLoading(false);
    onResultado({ ...rastreamento, _extra: resultado });
    setValor("");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-5 flex items-center gap-2">
        <Search className="w-5 h-5 text-indigo-500" />
        Nova Consulta de Rastreamento
      </h3>

      {/* Tipo de busca */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TIPOS.map(t => (
          <button
            key={t.value}
            onClick={() => { setTipo(t.value); setValor(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tipo === t.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <tipoAtual.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={tipoAtual.placeholder}
            value={valor}
            onChange={e => setValor(e.target.value)}
            onKeyDown={e => e.key === "Enter" && buscar()}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50"
          />
        </div>
        <button
          onClick={buscar}
          disabled={loading || !valor.trim()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
      {loading && (
        <p className="text-xs text-gray-400 mt-2.5 flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Consultando bases públicas e registros disponíveis...
        </p>
      )}
    </div>
  );
}
