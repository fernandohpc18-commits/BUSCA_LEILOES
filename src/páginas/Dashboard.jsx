import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Car, Building2, Gavel, TrendingUp, RefreshCw, Loader2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import VarreduraProgress from "@/components/leiloeiros/VarreduraProgress";

export default function Dashboard() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [progresso, setProgresso] = useState([]);
  const [mostrarProgresso, setMostrarProgresso] = useState(false);
  const progressoRef = useRef([]);

  const carregarLotes = () => {
    base44.entities.Lote.list("-created_date", 100).then((data) => {
      setLotes(data);
      setLoading(false);
    });
  };

  useEffect(() => { carregarLotes(); }, []);

  const varrerEmSegundoPlano = async () => {
    const todosLeiloeiros = await base44.entities.Leiloeiro.list("-created_date", 500);
    const comSite = todosLeiloeiros.filter(l => l.site && l.site !== "N/D" && l.site.trim() !== "");
    if (comSite.length === 0) return;

    const MAX_POR_VEZ = 5;
    const leiloeiros = comSite.slice(0, MAX_POR_VEZ);

    const prog = leiloeiros.map(l => ({ leiloeiro: l, status: "aguardando", lotes: 0 }));
    progressoRef.current = prog;
    setProgresso([...prog]);
    setAtualizando(true);
    setMostrarProgresso(true);

    for (let i = 0; i < leiloeiros.length; i++) {
      const l = leiloeiros[i];
      progressoRef.current[i].status = "varrendo";
      setProgresso([...progressoRef.current]);

      const site = l.site?.startsWith("http") ? l.site : `https://${l.site}`;

      let resultado = null;
      try {
        resultado = await base44.integrations.Core.InvokeLLM({
          prompt: `Acesse o site "${site}" do leiloeiro "${l.nome}" e liste os lotes disponíveis para leilão. Retorne no máximo 20 lotes com: título, placa, chassi, marca, modelo, ano, cor, cidade, estado, lance_inicial, valor_avaliacao, data_leilao (YYYY-MM-DD), link_original, numero_lote, banco, situacao_bem (pequena_avaria|monta|recuperado_financiamento|venda_antecipada|repasse|no_estado), tipo_bem (veiculo|imovel|maquinario|eletronico|outro), descrição resumida.`,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              lotes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    titulo: { type: "string" }, placa: { type: "string" }, chassi: { type: "string" },
                    marca: { type: "string" }, modelo: { type: "string" }, ano: { type: "string" }, cor: { type: "string" },
                    cidade: { type: "string" }, estado: { type: "string" }, lance_inicial: { type: "number" },
                    valor_avaliacao: { type: "number" }, data_leilao: { type: "string" }, link_original: { type: "string" },
                    numero_lote: { type: "string" }, banco: { type: "string" }, situacao_bem: { type: "string" },
                    tipo_bem: { type: "string" }, descricao: { type: "string" }
                  }
                }
              }
            }
          }
        });
      } catch (err) {
        progressoRef.current[i].status = "erro";
        setProgresso([...progressoRef.current]);
        continue;
      }

      const lotesExtraidos = resultado?.lotes || [];
      if (lotesExtraidos.length > 0) {
        await base44.entities.Lote.bulkCreate(lotesExtraidos.map(lote => ({
          ...lote, site_leilao: l.nome, status: "monitorando", tipo_bem: lote.tipo_bem || "outro",
        })));
        progressoRef.current[i].status = "ok";
        progressoRef.current[i].lotes = lotesExtraidos.length;
      } else {
        progressoRef.current[i].status = "vazio";
      }
      setProgresso([...progressoRef.current]);
    }

    setAtualizando(false);
    carregarLotes();
  };

  const iniciarVarredura = () => {
    if (atualizando) return;
    varrerEmSegundoPlano();
  };

  const total = lotes.length;
  const monitorando = lotes.filter(l => l.status === "monitorando").length;
  const arrematados = lotes.filter(l => l.status === "arrematado").length;
  const veiculos = lotes.filter(l => l.tipo_bem === "veiculo").length;
  const imoveis = lotes.filter(l => l.tipo_bem === "imovel").length;

  const recentes = lotes.slice(0, 5);

  const situacaoLabel = {
    pequena_avaria: "Pequena Avaria",
    monta: "Monta",
    recuperado_financiamento: "Rec. Financiamento",
    venda_antecipada: "Venda Antecipada",
    repasse: "Repasse",
    no_estado: "No Estado",
  };

  const statusColor = {
    monitorando: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
    arrematado: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    nao_arrematado: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
    cancelado: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-10 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Painel de Lotes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Visão geral dos leilões monitorados</p>
          </div>
          <button
            onClick={iniciarVarredura}
            disabled={atualizando}
            className="flex items-center gap-2 bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-yellow-400 transition-all disabled:opacity-60 self-start sm:self-auto"
          >
            {atualizando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {atualizando ? "Varrendo..." : "Varrer Sites"}
          </button>
        </div>

        {/* Progresso em segundo plano */}
        {progresso.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setMostrarProgresso(p => !p)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {atualizando ? (
                <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {atualizando ? "Varredura em andamento (segundo plano)..." : "Varredura concluída"}
              {mostrarProgresso ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {mostrarProgresso && <VarreduraProgress progresso={progresso} />}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: "Total de Lotes", value: total, icon: Package, color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" },
            { label: "Monitorando", value: monitorando, icon: TrendingUp, color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" },
            { label: "Arrematados", value: arrematados, icon: Gavel, color: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400" },
            { label: "Veículos", value: veiculos, icon: Car, color: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? "—" : stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Lots */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-800 dark:text-white">Lotes Recentes</h2>
            <Link to={createPageUrl("Lotes")} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">Carregando...</div>
          ) : recentes.length === 0 ? (
            <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm">Nenhum lote cadastrado ainda.</div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentes.map((lote) => (
                <Link
                  key={lote.id}
                  to={createPageUrl(`DetalheLote?id=${lote.id}`)}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    {lote.fotos?.[0] ? (
                      <img src={lote.fotos[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">{lote.titulo}</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {lote.site_leilao} {lote.placa && `• ${lote.placa}`}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 flex-shrink-0">
                    {lote.lance_inicial && (
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                        R$ {lote.lance_inicial.toLocaleString("pt-BR")}
                      </span>
                    )}
                    <span className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusColor[lote.status]}`}>
                      {lote.status === "monitorando" ? "Monitorando" :
                        lote.status === "arrematado" ? "Arrematado" :
                        lote.status === "nao_arrematado" ? "Não Arrematado" : "Cancelado"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
