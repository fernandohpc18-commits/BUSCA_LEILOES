import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft, ExternalLink, Calendar, MapPin, Car, Building2,
  Package, Edit2, Trash2, Plus, Check, X, ChevronLeft, ChevronRight
} from "lucide-react";

const STATUS_STYLE = {
  monitorando: "bg-blue-100 text-blue-700",
  arrematado: "bg-green-100 text-green-700",
  nao_arrematado: "bg-red-100 text-red-600",
  cancelado: "bg-gray-100 text-gray-500",
};

const SITUACAO_LABEL = {
  pequena_avaria: "Pequena Avaria",
  monta: "Monta",
  recuperado_financiamento: "Recuperado de Financiamento",
  venda_antecipada: "Venda Antecipada",
  repasse: "Repasse",
  no_estado: "No Estado que se Encontra",
};

export default function DetalheLote() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const [lote, setLote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoIdx, setFotoIdx] = useState(0);
  const [novoLance, setNovoLance] = useState({ valor: "", observacao: "" });
  const [adicionandoLance, setAdicionandoLance] = useState(false);
  const [editandoStatus, setEditandoStatus] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [editandoNotas, setEditandoNotas] = useState(false);
  const [notas, setNotas] = useState("");

  useEffect(() => {
    if (!id) return;
    base44.entities.Lote.filter({ id }).then(data => {
      if (data.length > 0) {
        setLote(data[0]);
        setNotas(data[0].notas || "");
      }
      setLoading(false);
    });
  }, [id]);

  const salvarLance = async () => {
    if (!novoLance.valor) return;
    const historico = [...(lote.historico_lances || []), {
      valor: parseFloat(novoLance.valor),
      data: new Date().toISOString(),
      observacao: novoLance.observacao,
    }];
    const updated = await base44.entities.Lote.update(lote.id, {
      historico_lances: historico,
      lance_atual: parseFloat(novoLance.valor),
    });
    setLote(updated);
    setNovoLance({ valor: "", observacao: "" });
    setAdicionandoLance(false);
  };

  const salvarStatus = async (status) => {
    const updated = await base44.entities.Lote.update(lote.id, { status });
    setLote(updated);
    setEditandoStatus(false);
  };

  const salvarNotas = async () => {
    const updated = await base44.entities.Lote.update(lote.id, { notas });
    setLote(updated);
    setEditandoNotas(false);
  };

  const excluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este lote?")) return;
    setDeletando(true);
    await base44.entities.Lote.delete(lote.id);
    window.location.href = createPageUrl("Lotes");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 dark:text-gray-500">Carregando...</div>
    </div>
  );

  if (!lote) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">🔍</div>
        <div className="text-gray-600 dark:text-gray-300">Lote não encontrado.</div>
        <Link to={createPageUrl("Lotes")} className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 block">← Voltar</Link>
      </div>
    </div>
  );

  const fotos = lote.fotos || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-10 transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={createPageUrl("Lotes")}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Lotes
          </Link>
          <div className="flex items-center gap-2">
            {lote.link_original && (
              <a
                href={lote.link_original}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Ver Original
              </a>
            )}
            <button
              onClick={excluir}
              disabled={deletando}
              className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 dark:border-red-900 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Fotos + Info */}
          <div className="lg:col-span-3 space-y-5">
            {/* Fotos */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="relative h-64 sm:h-72 bg-gray-50 dark:bg-gray-800">
                {fotos.length > 0 ? (
                  <>
                    <img
                      src={fotos[fotoIdx]}
                      alt={lote.titulo}
                      className="w-full h-full object-cover"
                    />
                    {fotos.length > 1 && (
                      <>
                        <button
                          onClick={() => setFotoIdx(i => (i - 1 + fotos.length) % fotos.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setFotoIdx(i => (i + 1) % fotos.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {fotos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setFotoIdx(i)}
                              className={`w-2 h-2 rounded-full transition-colors ${i === fotoIdx ? "bg-white" : "bg-white/50"}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Informações do Bem</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {[
                  ["Placa", lote.placa],
                  ["Chassi", lote.chassi],
                  ["Matrícula", lote.matricula],
                  ["Banco", lote.banco],
                  ["Marca", lote.marca],
                  ["Modelo", lote.modelo],
                  ["Ano", lote.ano],
                  ["Cor", lote.cor],
                  ["Número do Lote", lote.numero_lote],
                  ["Site do Leilão", lote.site_leilao],
                  ["Data do Leilão", lote.data_leilao ? new Date(lote.data_leilao).toLocaleDateString("pt-BR") : null],
                  ["Hora", lote.hora_leilao],
                  ["Cidade", lote.cidade],
                  ["Estado", lote.estado],
                ].filter(([, v]) => v).map(([label, valor]) => (
                  <div key={label}>
                    <span className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">{label}</span>
                    <div className="font-medium text-gray-800 dark:text-gray-100 mt-0.5">{valor}</div>
                  </div>
                ))}
              </div>

              {lote.situacao_bem && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">Situação</span>
                  <div className="font-medium text-gray-800 dark:text-gray-100 mt-1">
                    {SITUACAO_LABEL[lote.situacao_bem]}
                  </div>
                </div>
              )}

              {lote.descricao && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide">Descrição</span>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">{lote.descricao}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Status, Valores, Lances */}
          <div className="lg:col-span-2 space-y-5">
            {/* Título e Status */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{lote.site_leilao}</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-4">{lote.titulo}</h1>

              {editandoStatus ? (
                <div className="space-y-2">
                  {["monitorando", "arrematado", "nao_arrematado", "cancelado"].map(s => (
                    <button
                      key={s}
                      onClick={() => salvarStatus(s)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${STATUS_STYLE[s]} hover:opacity-80`}
                    >
                      {s === "monitorando" ? "Monitorando" :
                        s === "arrematado" ? "Arrematado" :
                        s === "nao_arrematado" ? "Não Arrematado" : "Cancelado"}
                    </button>
                  ))}
                  <button onClick={() => setEditandoStatus(false)} className="text-xs text-gray-400 dark:text-gray-500 mt-1">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLE[lote.status]}`}>
                    {lote.status === "monitorando" ? "Monitorando" :
                      lote.status === "arrematado" ? "Arrematado" :
                      lote.status === "nao_arrematado" ? "Não Arrematado" : "Cancelado"}
                  </span>
                  <button onClick={() => setEditandoStatus(true)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Alterar
                  </button>
                </div>
              )}
            </div>

            {/* Valores */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Valores</h3>
              <div className="space-y-3">
                {lote.lance_inicial && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lance Inicial</span>
                    <span className="font-bold text-gray-900 dark:text-white">R$ {lote.lance_inicial.toLocaleString("pt-BR")}</span>
                  </div>
                )}
                {lote.lance_atual && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lance Atual</span>
                    <span className="font-bold text-indigo-700 dark:text-indigo-400 text-lg">R$ {lote.lance_atual.toLocaleString("pt-BR")}</span>
                  </div>
                )}
                {lote.valor_avaliacao && (
                  <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Avaliação</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">R$ {lote.valor_avaliacao.toLocaleString("pt-BR")}</span>
                  </div>
                )}
                {lote.valor_avaliacao && lote.lance_inicial && (
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-3 text-center">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">Desconto em relação à avaliação</div>
                    <div className="text-xl font-bold text-green-700 dark:text-green-400 mt-0.5">
                      {Math.round((1 - lote.lance_inicial / lote.valor_avaliacao) * 100)}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Histórico de Lances */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Histórico de Lances</h3>
                <button
                  onClick={() => setAdicionandoLance(true)}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar
                </button>
              </div>

              {adicionandoLance && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3 space-y-2">
                  <input
                    type="number"
                    placeholder="Valor do lance (R$)"
                    value={novoLance.valor}
                    onChange={e => setNovoLance(p => ({ ...p, valor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <input
                    type="text"
                    placeholder="Observação (opcional)"
                    value={novoLance.observacao}
                    onChange={e => setNovoLance(p => ({ ...p, observacao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={salvarLance}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={() => setAdicionandoLance(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {(!lote.historico_lances || lote.historico_lances.length === 0) ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3">Nenhum lance registrado.</p>
              ) : (
                <div className="space-y-2">
                  {[...lote.historico_lances].reverse().map((lance, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                          R$ {lance.valor?.toLocaleString("pt-BR")}
                        </div>
                        {lance.observacao && (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lance.observacao}</div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(lance.data).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notas */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">Notas Pessoais</h3>
                {!editandoNotas && (
                  <button onClick={() => setEditandoNotas(true)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> Editar
                  </button>
                )}
              </div>
              {editandoNotas ? (
                <div className="space-y-2">
                  <textarea
                    value={notas}
                    onChange={e => setNotas(e.target.value)}
                    rows={4}
                    placeholder="Adicione observações sobre este lote..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={salvarNotas}
                      className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => { setNotas(lote.notas || ""); setEditandoNotas(false); }}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {lote.notas || <span className="italic text-gray-300 dark:text-gray-600">Sem notas...</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
