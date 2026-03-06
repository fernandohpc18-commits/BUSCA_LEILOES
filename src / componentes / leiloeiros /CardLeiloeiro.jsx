import React from "react";
import { MapPin, Phone, Mail, Globe, Award, Calendar, Package, Search, Loader2 } from "lucide-react";

export default function CardLeiloeiro({ leiloeiro, onVarrer, varrendo }) {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/40 flex flex-col"
      style={{ minHeight: 480 }}>
      
      {/* Top badge */}
      <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider z-10">
        Leiloeiro Oficial
      </div>
      {leiloeiro.ativo !== false && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
          Ativo
        </div>
      )}

      {/* Avatar / foto */}
      <div className="flex items-center justify-center pt-12 pb-5 bg-gradient-to-b from-yellow-500/10 to-transparent">
        {leiloeiro.foto ? (
          <img src={leiloeiro.foto} alt={leiloeiro.nome}
            className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500 shadow-lg" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-500 shadow-lg flex items-center justify-center">
            <span className="text-4xl font-black text-gray-900">
              {leiloeiro.nome?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Nome */}
      <div className="text-center px-5 pb-4">
        <h3 className="text-white font-black text-lg leading-tight">{leiloeiro.nome}</h3>
        {leiloeiro.junta_comercial && (
          <p className="text-yellow-400 text-xs font-semibold mt-1">{leiloeiro.junta_comercial}</p>
        )}
      </div>

      {/* Divider dourado */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4" />

      {/* Stats estilo supertrunfo */}
      <div className="px-5 space-y-2.5 flex-1">
        {leiloeiro.matricula && (
          <StatRow icon={<Award className="w-3.5 h-3.5 text-yellow-400" />}
            label="Matrícula" value={leiloeiro.matricula} highlight />
        )}
        {(leiloeiro.estado || leiloeiro.cidade) && (
          <StatRow icon={<MapPin className="w-3.5 h-3.5 text-blue-400" />}
            label="Localização" value={[leiloeiro.cidade, leiloeiro.estado].filter(Boolean).join(", ")} />
        )}
        {leiloeiro.data_registro && (
          <StatRow icon={<Calendar className="w-3.5 h-3.5 text-purple-400" />}
            label="Registro" value={leiloeiro.data_registro} />
        )}
        {leiloeiro.lotes_ativos != null && (
          <StatRow icon={<Package className="w-3.5 h-3.5 text-green-400" />}
            label="Lotes Ativos" value={leiloeiro.lotes_ativos} highlight />
        )}
        {leiloeiro.telefone && (
          <StatRow icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
            label="Telefone" value={leiloeiro.telefone} />
        )}
        {leiloeiro.email && (
          <StatRow icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
            label="E-mail" value={leiloeiro.email} small />
        )}
        {leiloeiro.site && (
          <a href={leiloeiro.site} target="_blank" rel="noopener noreferrer">
            <StatRow icon={<Globe className="w-3.5 h-3.5 text-indigo-400" />}
              label="Site" value={leiloeiro.site} small link />
          </a>
        )}
      </div>

      {/* Especialidades */}
      {leiloeiro.especialidades?.length > 0 && (
        <div className="px-5 pt-3">
          <div className="mx-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent mb-3" />
          <div className="flex flex-wrap gap-1.5">
            {leiloeiro.especialidades.map((esp, i) => (
              <span key={i} className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full font-medium">
                {esp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botão Varrer Site */}
      {onVarrer && (
        <div className="px-5 pb-5 pt-3">
          <button
            onClick={onVarrer}
            disabled={varrendo}
            className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-gray-900 font-bold text-sm py-2.5 rounded-xl transition-colors"
          >
            {varrendo ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Buscando lotes...</>
            ) : (
              <><Search className="w-4 h-4" /> Buscar Lotes no Site</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function StatRow({ icon, label, value, highlight, small, link }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${highlight ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-white/5"}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <span className={`font-bold truncate max-w-[55%] text-right ${highlight ? "text-yellow-400" : link ? "text-indigo-400 underline" : "text-white"} ${small ? "text-xs" : "text-sm"}`}>
        {value}
      </span>
    </div>
  );
}
