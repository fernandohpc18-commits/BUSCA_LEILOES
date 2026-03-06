import React, { useState } from "react";
import {
  Car, Building2, FileText, MapPin, Hash, ChevronDown, ChevronUp,
  Scale, Gavel, Calendar, DollarSign, AlertCircle, CheckCircle2, Trash2
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIPO_ICON = {
  placa: Car,
  chassi: Hash,
  matricula: Building2,
  processo: FileText,
  cidade_estado: MapPin,
};

const TIPO_LABEL = {
  placa: "Placa",
  chassi: "Chassi",
  matricula: "Matrícula",
  processo: "Processo",
  cidade_estado: "Cidade/Estado",
};

function InfoItem({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}

function Moeda({ valor }) {
  if (!valor) return <span className="text-gray-400 text-sm">—</span>;
  return <span className="text-sm font-bold text-gray-900">R$ {Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>;
}

export default function CardRastreamento({ rastreamento, onRemovido }) {
  const [expandido, setExpandido] = useState(true);
  const Icon = TIPO_ICON[rastreamento.tipo_busca] || FileText;
  const bem = rastreamento.bem || {};
  const processo = rastreamento.processo || {};

  const excluir = async () => {
    if (!confirm("Remover este rastreamento?")) return;
    await base44.entities.Rastreamento.delete(rastreamento.id);
    onRemovido(rastreamento.id);
  };

  const valorBusca = rastreamento.placa || rastreamento.chassi || rastreamento.matricula ||
    rastreamento.numero_processo || rastreamento.cidade || "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpandido(e => !e)}
      >
        <div className={`p-2.5 rounded-xl ${rastreamento.tem_processo ? "bg-orange-100" : "bg-indigo-50"}`}>
          <Icon className={`w-4 h-4 ${rastreamento.tem_processo ? "text-orange-600" : "text-indigo-600"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
              {TIPO_LABEL[rastreamento.tipo_busca]}
            </span>
            {rastreamento.tem_processo && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Scale className="w-3 h-3" /> Processo Vinculado
              </span>
            )}
          </div>
          <div className="font-semibold text-gray-900 mt-0.5">{valorBusca}</div>
          {bem.descricao && <div className="text-sm text-gray-500 truncate">{bem.descricao}</div>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); excluir(); }}
            className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expandido ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {expandido && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-50">
          {/* Resumo */}
          {rastreamento.resultado_busca && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
              {rastreamento.resultado_busca}
            </div>
          )}

          {/* Dados do Bem */}
          {Object.values(bem).some(v => v) && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Car className="w-3.5 h-3.5" /> Dados do Bem
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoItem label="Descrição" value={bem.descricao} />
                <InfoItem label="Marca" value={bem.marca} />
                <InfoItem label="Modelo" value={bem.modelo} />
                <InfoItem label="Ano" value={bem.ano} />
                <InfoItem label="Cor" value={bem.cor} />
                <InfoItem label="Situação" value={bem.situacao} />
                <InfoItem label="Proprietário" value={bem.proprietario} />
                <InfoItem label="Endereço" value={bem.endereco} />
              </div>
            </div>
          )}

          {/* Processo */}
          {rastreamento.tem_processo && Object.values(processo).some(v => v) && (
            <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
              <h4 className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4" /> Processo Judicial/Extrajudicial
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <InfoItem label="Número do Processo" value={processo.numero} />
                <InfoItem label="Tipo do Processo" value={processo.tipo} />
                <InfoItem label="Vara" value={processo.vara} />
                <InfoItem label="Comarca" value={processo.comarca} />
                <InfoItem label="Estado" value={processo.estado} />
                <InfoItem label="Partes" value={processo.partes} />
                <InfoItem label="Data de Distribuição" value={processo.data_distribuicao} />
                <InfoItem label="Data do Leilão" value={processo.data_leilao} />
                <InfoItem label="Situação do Processo" value={processo.situacao_processo} />
                <InfoItem label="Fase" value={processo.fase} />
                <InfoItem label="Leiloeiro" value={processo.leiloeiro} />
              </div>

              {/* Valores */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-orange-200 pt-4">
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Valor da Causa</div>
                  <Moeda valor={processo.valor_causa} />
                </div>
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Valor do Débito</div>
                  <Moeda valor={processo.valor_debito} />
                </div>
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Avaliação</div>
                  <Moeda valor={processo.valor_avaliacao} />
                </div>
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Mínimo 1ª Praça</div>
                  <Moeda valor={processo.valor_minimo_1_praca} />
                </div>
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Mínimo 2ª Praça</div>
                  <Moeda valor={processo.valor_minimo_2_praca} />
                </div>
                {processo.valor_avaliacao && processo.valor_minimo_2_praca && (
                  <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                    <div className="text-xs text-green-600 mb-1">Desconto (2ª Praça)</div>
                    <span className="text-sm font-bold text-green-700">
                      {Math.round((1 - processo.valor_minimo_2_praca / processo.valor_avaliacao) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {processo.observacoes && (
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <div className="text-xs text-gray-400 mb-1">Observações</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{processo.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
