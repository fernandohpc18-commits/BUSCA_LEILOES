import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Gavel, Car, Building2, Package, Hash, Banknote, ExternalLink, Flag, ImageOff } from "lucide-react";

const TIPO_ICON = { veiculo: Car, imovel: Building2, maquinario: Package, eletronico: Hash, outro: Package };
const STATUS_COLOR = {
  monitorando: { bg: "bg-blue-500", text: "Monitorando" },
  arrematado: { bg: "bg-green-500", text: "Arrematado" },
  nao_arrematado: { bg: "bg-red-500", text: "Não Arrematado" },
  cancelado: { bg: "bg-gray-500", text: "Cancelado" },
};
const PRACA_LABEL = {
  praca_unica: "Praça Única",
  primeira_praca: "1ª Praça",
  segunda_praca: "2ª Praça",
  terceira_praca: "3ª Praça",
};

function FotoCarrossel({ fotos, TipoIcon }) {
  const [idx, setIdx] = useState(0);
  const [erros, setErros] = useState({});

  const prev = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i - 1 + fotos.length) % fotos.length); };
  const next = (e) => { e.preventDefault(); e.stopPropagation(); setIdx(i => (i + 1) % fotos.length); };

  const fotoAtual = fotos[idx];
  const temErro = erros[idx];

  // Proxy para carregar imagens externas que bloqueiam CORS
  const proxyUrl = (url) => {
    if (!url) return url;
    if (url.startsWith("data:")) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=800&output=jpg`;
  };

  if (fotos.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-950">
        <TipoIcon className="w-14 h-14 text-gray-700" />
        <span className="text-gray-600 text-xs">Sem fotos</span>
      </div>
    );
  }

  return (
    <>
      {temErro ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-950">
          <ImageOff className="w-12 h-12 text-gray-700" />
          <span className="text-gray-600 text-xs">Imagem indisponível</span>
        </div>
      ) : (
        <img
          src={proxyUrl(fotoAtual)}
          alt=""
          className="w-full h-full object-cover opacity-90"
          onError={() => setErros(prev => ({ ...prev, [idx]: true }))}
        />
      )}

      {fotos.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 z-10">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 z-10">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {fotos.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
                className={`rounded-full transition-all ${i === idx ? "bg-yellow-400 w-3 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full z-10">
        {idx + 1}/{fotos.length}
      </div>
    </>
  );
}

export default function CardLoteSupertrunfo({ lote }) {
  const fotos = lote.fotos?.filter(Boolean) || [];
  const TipoIcon = TIPO_ICON[lote.tipo_bem] || Package;
  const status = STATUS_COLOR[lote.status] || STATUS_COLOR.monitorando;
  const desconto = lote.valor_avaliacao && lote.lance_inicial
    ? Math.round((1 - lote.lance_inicial / lote.valor_avaliacao) * 100)
    : null;

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/40 flex flex-col" style={{ minHeight: 520 }}>

      {/* Carrossel de Fotos */}
      <div className="relative bg-gray-950 flex-shrink-0" style={{ height: 220 }}>
        <FotoCarrossel fotos={fotos} TipoIcon={TipoIcon} />

        {/* Badges sobre a foto */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
          <span className={`${status.bg} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
            {status.text}
          </span>
          {desconto !== null && desconto > 0 && (
            <span className="bg-yellow-500 text-gray-900 text-xs font-black px-2.5 py-1 rounded-full">
              -{desconto}%
            </span>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </div>

      {/* Título */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start gap-2">
          <TipoIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <h3 className="text-white font-black text-sm leading-snug line-clamp-2">{lote.titulo}</h3>
        </div>
        {lote.site_leilao && (
          <p className="text-yellow-400 text-xs mt-1 font-semibold">{lote.site_leilao}</p>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-3" />

      {/* Stats */}
      <div className="px-4 space-y-2 flex-1">
        {lote.lance_inicial && (
          <StatRow icon={<Gavel className="w-3.5 h-3.5 text-yellow-400" />}
            label="Lance Inicial" value={`R$ ${Number(lote.lance_inicial).toLocaleString("pt-BR")}`} highlight />
        )}
        <StatRow
          icon={<Flag className="w-3.5 h-3.5 text-orange-300" />}
          label="Praça"
          value={lote.praca ? (PRACA_LABEL[lote.praca] || lote.praca) : "—"}
        />
        {lote.valor_avaliacao && (
          <StatRow icon={<Banknote className="w-3.5 h-3.5 text-green-400" />}
            label="Avaliação" value={`R$ ${Number(lote.valor_avaliacao).toLocaleString("pt-BR")}`} />
        )}
        {lote.placa && (
          <StatRow icon={<Car className="w-3.5 h-3.5 text-blue-400" />}
            label="Placa" value={lote.placa} />
        )}
        {lote.banco && (
          <StatRow icon={<Building2 className="w-3.5 h-3.5 text-purple-400" />}
            label="Banco" value={lote.banco} />
        )}
        {lote.data_leilao && (
          <StatRow icon={<Calendar className="w-3.5 h-3.5 text-orange-400" />}
            label="Data" value={new Date(lote.data_leilao).toLocaleDateString("pt-BR")} />
        )}
        {(lote.cidade || lote.estado) && (
          <StatRow icon={<MapPin className="w-3.5 h-3.5 text-red-400" />}
            label="Local" value={[lote.cidade, lote.estado].filter(Boolean).join(", ")} />
        )}
      </div>

      {/* Footer */}
      <div className="p-4 pt-3 flex gap-2">
        <Link
          to={createPageUrl(`DetalheLote?id=${lote.id}`)}
          className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-xs font-black py-2.5 rounded-xl text-center transition-colors"
        >
          Ver Detalhes
        </Link>
        {lote.link_original && (
          <a
            href={lote.link_original}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-xl transition-colors flex items-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${highlight ? "bg-yellow-500/15 border border-yellow-500/30" : "bg-white/5"}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-gray-400 font-medium">{label}</span>
      </div>
      <span className={`font-bold text-sm truncate max-w-[55%] text-right ${highlight ? "text-yellow-400" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
