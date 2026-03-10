import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ExternalLink, Car, Building2, Package, Calendar, MapPin } from "lucide-react";

const STATUS_STYLE = {
  monitorando: "bg-blue-100 text-blue-700 border-blue-200",
  arrematado: "bg-green-100 text-green-700 border-green-200",
  nao_arrematado: "bg-red-100 text-red-600 border-red-200",
  cancelado: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_LABEL = {
  monitorando: "Monitorando",
  arrematado: "Arrematado",
  nao_arrematado: "Não Arrematado",
  cancelado: "Cancelado",
};

const SITUACAO_LABEL = {
  pequena_avaria: "Pequena Avaria",
  monta: "Monta",
  recuperado_financiamento: "Rec. Financiamento",
  venda_antecipada: "Venda Antecipada",
  repasse: "Repasse",
  no_estado: "No Estado",
};

const TIPO_ICON = {
  veiculo: Car,
  imovel: Building2,
};

export default function CardLote({ lote }) {
  const Icon = TIPO_ICON[lote.tipo_bem] || Package;

  return (
    <Link
      to={createPageUrl(`DetalheLote?id=${lote.id}`)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {/* Foto */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {lote.fotos?.[0] ? (
          <img
            src={lote.fotos[0]}
            alt={lote.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Icon className="w-12 h-12" />
          </div>
        )}
        <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[lote.status]}`}>
          {STATUS_LABEL[lote.status]}
        </div>
        {lote.situacao_bem && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {SITUACAO_LABEL[lote.situacao_bem]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-indigo-600 font-medium mb-1">{lote.site_leilao || "Leilão"}</div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{lote.titulo}</h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {lote.placa && <Tag label={`🚗 ${lote.placa.toUpperCase()}`} />}
          {lote.chassi && <Tag label={`Chassi: ${lote.chassi.slice(-6)}`} />}
          {lote.banco && <Tag label={`🏦 ${lote.banco}`} />}
          {(lote.cidade || lote.estado) && (
            <Tag label={`📍 ${[lote.cidade, lote.estado].filter(Boolean).join(", ")}`} />
          )}
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            {lote.lance_inicial && (
              <div className="text-lg font-bold text-gray-900">
                R$ {lote.lance_inicial.toLocaleString("pt-BR")}
              </div>
            )}
            {lote.data_leilao && (
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                {new Date(lote.data_leilao).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
          {lote.link_original && (
            <a
              href={lote.link_original}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}

function Tag({ label }) {
  return (
    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg whitespace-nowrap">
      {label}
    </span>
  );
}
