import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Link as LinkIcon, Loader2, Wand2 } from "lucide-react";

export default function ModalAdicionarLote({ onClose, onSalvo }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const extrairDados = async () => {
    if (!link.trim()) return;
    setLoading(true);
    setDados(null);

    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Acesse e analise o conteúdo desta página de leilão: ${link}

Extraia todas as informações disponíveis e retorne um JSON estruturado com os seguintes campos (deixe em branco/null se não encontrar):
- titulo: título do lote
- site_leilao: nome do site (ex: Leilão Vip, Zukerman, Biasi, etc)
- numero_lote: número do lote
- descricao: descrição completa
- fotos: array de URLs de fotos (até 5 fotos)
- tipo_bem: "veiculo", "imovel", "maquinario", "eletronico" ou "outro"
- situacao_bem: "pequena_avaria", "monta", "recuperado_financiamento", "venda_antecipada", "repasse" ou "no_estado"
- placa: placa do veículo
- chassi: número do chassi
- matricula: matrícula do imóvel
- banco: banco responsável
- marca: marca do veículo
- modelo: modelo do veículo
- ano: ano
- cor: cor
- cidade: cidade
- estado: UF (sigla)
- lance_inicial: valor numérico do lance inicial (sem R$, sem pontos, sem vírgula)
- valor_avaliacao: valor numérico da avaliação
- data_leilao: data no formato YYYY-MM-DD
- hora_leilao: hora no formato HH:MM`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          titulo: { type: "string" },
          site_leilao: { type: "string" },
          numero_lote: { type: "string" },
          descricao: { type: "string" },
          fotos: { type: "array", items: { type: "string" } },
          tipo_bem: { type: "string" },
          situacao_bem: { type: "string" },
          placa: { type: "string" },
          chassi: { type: "string" },
          matricula: { type: "string" },
          banco: { type: "string" },
          marca: { type: "string" },
          modelo: { type: "string" },
          ano: { type: "string" },
          cor: { type: "string" },
          cidade: { type: "string" },
          estado: { type: "string" },
          lance_inicial: { type: "number" },
          valor_avaliacao: { type: "number" },
          data_leilao: { type: "string" },
          hora_leilao: { type: "string" },
        },
      },
    });

    setDados({ ...resultado, link_original: link, status: "monitorando" });
    setLoading(false);
  };

  const salvar = async () => {
    setSalvando(true);
    const lote = await base44.entities.Lote.create(dados);
    setSalvando(false);
    onSalvo(lote);
  };

  const campo = (label, valor, onChange) => (
    <div>
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      <input
        value={valor || ""}
        onChange={e => setDados(prev => ({ ...prev, [onChange]: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Adicionar Lote</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Link input */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Link do lote no site de leilão
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && extrairDados()}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                />
              </div>
              <button
                onClick={extrairDados}
                disabled={loading || !link.trim()}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {loading ? "Extraindo..." : "Extrair"}
              </button>
            </div>
            {loading && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Analisando a página, aguarde...
              </p>
            )}
          </div>

          {/* Dados extraídos */}
          {dados && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                <Wand2 className="w-4 h-4" />
                Dados extraídos com sucesso! Revise e ajuste se necessário.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campo("Título", dados.titulo, "titulo")}
                {campo("Site do Leilão", dados.site_leilao, "site_leilao")}
                {campo("Número do Lote", dados.numero_lote, "numero_lote")}
                {campo("Placa", dados.placa, "placa")}
                {campo("Chassi", dados.chassi, "chassi")}
                {campo("Matrícula", dados.matricula, "matricula")}
                {campo("Banco", dados.banco, "banco")}
                {campo("Marca", dados.marca, "marca")}
                {campo("Modelo", dados.modelo, "modelo")}
                {campo("Ano", dados.ano, "ano")}
                {campo("Cor", dados.cor, "cor")}
                {campo("Cidade", dados.cidade, "cidade")}
                {campo("Estado (UF)", dados.estado, "estado")}
                {campo("Data do Leilão", dados.data_leilao, "data_leilao")}
                {campo("Hora do Leilão", dados.hora_leilao, "hora_leilao")}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Tipo do Bem</label>
                  <select
                    value={dados.tipo_bem || ""}
                    onChange={e => setDados(prev => ({ ...prev, tipo_bem: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Selecione</option>
                    <option value="veiculo">Veículo</option>
                    <option value="imovel">Imóvel</option>
                    <option value="maquinario">Maquinário</option>
                    <option value="eletronico">Eletrônico</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Situação do Bem</label>
                  <select
                    value={dados.situacao_bem || ""}
                    onChange={e => setDados(prev => ({ ...prev, situacao_bem: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Selecione</option>
                    <option value="pequena_avaria">Pequena Avaria</option>
                    <option value="monta">Monta</option>
                    <option value="recuperado_financiamento">Recuperado de Financiamento</option>
                    <option value="venda_antecipada">Venda Antecipada</option>
                    <option value="repasse">Repasse</option>
                    <option value="no_estado">No Estado que se Encontra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Descrição</label>
                <textarea
                  value={dados.descricao || ""}
                  onChange={e => setDados(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Lance Inicial (R$)</label>
                  <input
                    type="number"
                    value={dados.lance_inicial || ""}
                    onChange={e => setDados(prev => ({ ...prev, lance_inicial: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Valor de Avaliação (R$)</label>
                  <input
                    type="number"
                    value={dados.valor_avaliacao || ""}
                    onChange={e => setDados(prev => ({ ...prev, valor_avaliacao: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <button
                onClick={salvar}
                disabled={salvando || !dados.titulo}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {salvando ? "Salvando..." : "Salvar Lote"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
