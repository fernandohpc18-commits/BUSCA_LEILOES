import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

const TIPOS_BEM = [
  { value: "", label: "Todos os Tipos" },
  { value: "veiculo", label: "Veículo" },
  { value: "imovel", label: "Imóvel" },
  { value: "maquinario", label: "Maquinário" },
  { value: "eletronico", label: "Eletrônico" },
  { value: "outro", label: "Outro" },
];

const SITUACOES = [
  { value: "", label: "Todas as Situações" },
  { value: "pequena_avaria", label: "Pequena Avaria" },
  { value: "monta", label: "Monta" },
  { value: "recuperado_financiamento", label: "Recuperado de Financiamento" },
  { value: "venda_antecipada", label: "Venda Antecipada" },
  { value: "repasse", label: "Repasse" },
  { value: "no_estado", label: "No Estado que se Encontra" },
];

const STATUS = [
  { value: "", label: "Todos os Status" },
  { value: "monitorando", label: "Monitorando" },
  { value: "arrematado", label: "Arrematado" },
  { value: "nao_arrematado", label: "Não Arrematado" },
  { value: "cancelado", label: "Cancelado" },
];

export default function FiltrosLote({ filtros, onChange, onClear }) {
  const temFiltroAtivo = Object.values(filtros).some(v => v !== "");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </div>
        {temFiltroAtivo && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            <X className="w-3.5 h-3.5" /> Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Busca geral */}
        <div className="relative lg:col-span-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, descrição, banco..."
            value={filtros.busca}
            onChange={e => onChange("busca", e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50"
          />
        </div>

        <input
          type="text"
          placeholder="Placa"
          value={filtros.placa}
          onChange={e => onChange("placa", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50 uppercase"
        />

        <input
          type="text"
          placeholder="Chassi"
          value={filtros.chassi}
          onChange={e => onChange("chassi", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50"
        />

        <input
          type="text"
          placeholder="Matrícula"
          value={filtros.matricula}
          onChange={e => onChange("matricula", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50"
        />

        <input
          type="text"
          placeholder="Banco"
          value={filtros.banco}
          onChange={e => onChange("banco", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50"
        />

        <select
          value={filtros.tipo_bem}
          onChange={e => onChange("tipo_bem", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50 text-gray-700"
        >
          {TIPOS_BEM.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select
          value={filtros.situacao_bem}
          onChange={e => onChange("situacao_bem", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50 text-gray-700"
        >
          {SITUACOES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <select
          value={filtros.status}
          onChange={e => onChange("status", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-gray-50 text-gray-700"
        >
          {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}
