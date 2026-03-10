import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Users, RefreshCw, Trash2, Search, Globe, Filter, PlayCircle, Loader2, Plus } from "lucide-react";
import CardLeiloeiro from "@/components/leiloeiros/CardLeiloeiro";
import VarreduraProgress from "@/components/leiloeiros/VarreduraProgress";
import ModalAdicionarLeiloeiro from "@/components/leiloeiros/ModalAdicionarLeiloeiro";

const ESTADOS = ["AC","AL","AM","AP","CE","MA","MT","PA","PB","PI","RN","RO","RR","SE","TO",
  "BA","ES","GO","MG","MS","PR","RJ","RS","SC","SP","DF","PB"];

export default function Leiloeiros() {
  const [leiloeiros, setLeiloeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [varrendo, setVarrendo] = useState(null); // id do leiloeiro sendo varrido
  const [varrendoTodos, setVarrendoTodos] = useState(false);
  const [progresso, setProgresso] = useState([]);
  const [buscandoLeiloeiros, setBuscandoLeiloeiros] = useState(false);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const autoUpdateRef = useRef(null);

  const carregar = async () => {
    setLoading(true);
    const data = await base44.entities.Leiloeiro.list("-created_date", 500);
    setLeiloeiros(data);
    setLoading(false);
  };

  useEffect(() => {
    carregar().then(async () => {
      // Garante que a Receita Federal está cadastrada
      const lista = await base44.entities.Leiloeiro.filter({ nome: "Receita Federal do Brasil" });
      if (lista.length === 0) {
        const rf = await base44.entities.Leiloeiro.create({
          nome: "Receita Federal do Brasil",
          site: "https://www.gov.br/receitafederal/pt-br/assuntos/leilao",
          estado: "DF",
          cidade: "Brasília",
          especialidades: ["imovel", "veiculo", "maquinario", "eletronico", "outro"],
          ativo: true,
        });
        setLeiloeiros(prev => [rf, ...prev]);
      }
    });
    // Auto-atualizar lotes a cada 6 horas
    autoUpdateRef.current = setInterval(() => {
      base44.entities.Lote.list("-created_date", 1000).then(todos => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        todos.forEach(lote => {
          if (lote.data_leilao && lote.status === "monitorando") {
            const dataLote = new Date(lote.data_leilao);
            dataLote.setHours(0, 0, 0, 0);
            if (dataLote < hoje) {
              base44.entities.Lote.update(lote.id, { status: "nao_arrematado" });
            }
          }
        });
      });
    }, 6 * 60 * 60 * 1000);
    return () => clearInterval(autoUpdateRef.current);
  }, []);

  const limparTodos = async () => {
    if (!confirm("Limpar todos os leiloeiros cadastrados?")) return;
    for (const l of leiloeiros) {
      await base44.entities.Leiloeiro.delete(l.id);
    }
    setLeiloeiros([]);
  };

  // Varrer site de um leiloeiro específico para buscar lotes
  const varrerSite = async (leiloeiro) => {
    setVarrendo(leiloeiro.id);
    const site = leiloeiro.site?.startsWith("http") ? leiloeiro.site : `https://${leiloeiro.site}`;
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Acesse o site de leilões "${site}" do leiloeiro "${leiloeiro.nome}" e extraia todos os lotes/bens disponíveis para leilão.
      Para cada lote encontrado, extraia:
      - título do bem
      - placa (se veículo)
      - chassi (se veículo)
      - marca, modelo, ano, cor (se veículo)
      - endereço/cidade/estado do bem
      - valor de avaliação ou lance inicial
      - data do leilão
      - link direto para o lote
      - número do lote
      - banco ou credor
      - situação do bem
      - tipo (veiculo, imovel, maquinario, eletronico, outro)
      
      Retorne uma lista de lotes encontrados neste site.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          lotes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titulo: { type: "string" },
                placa: { type: "string" },
                chassi: { type: "string" },
                marca: { type: "string" },
                modelo: { type: "string" },
                ano: { type: "string" },
                cor: { type: "string" },
                cidade: { type: "string" },
                estado: { type: "string" },
                lance_inicial: { type: "number" },
                valor_avaliacao: { type: "number" },
                data_leilao: { type: "string" },
                link_original: { type: "string" },
                numero_lote: { type: "string" },
                banco: { type: "string" },
                situacao_bem: { type: "string" },
                tipo_bem: { type: "string" },
                descricao: { type: "string" }
              }
            }
          },
          total_encontrado: { type: "number" }
        }
      }
    });

    if (resultado?.lotes?.length > 0) {
      // Salvar lotes no banco
      const lotesParaSalvar = resultado.lotes.map(lote => ({
        ...lote,
        site_leilao: leiloeiro.nome,
        status: "monitorando",
        tipo_bem: lote.tipo_bem || "outro",
      }));
      await base44.entities.Lote.bulkCreate(lotesParaSalvar);
      alert(`✅ ${resultado.lotes.length} lote(s) importado(s) do site de ${leiloeiro.nome}!`);
    } else {
      alert(`Nenhum lote encontrado no site de ${leiloeiro.nome}.`);
    }

    setVarrendo(null);
  };

  const buscarLotesDoSite = async (l) => {
    const site = l.site?.startsWith("http") ? l.site : `https://${l.site}`;
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Acesse o site de leilões "${site}" do leiloeiro "${l.nome}" e extraia TODOS os lotes/bens disponíveis para leilão listados no site. Para cada lote retorne: título, placa, chassi, marca, modelo, ano, cidade, estado, lance inicial, valor de avaliação, data do leilão, link direto, número do lote, banco/credor, tipo (veiculo, imovel, maquinario, eletronico, outro).`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          lotes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titulo: { type: "string" },
                placa: { type: "string" },
                chassi: { type: "string" },
                marca: { type: "string" },
                modelo: { type: "string" },
                ano: { type: "string" },
                cor: { type: "string" },
                cidade: { type: "string" },
                estado: { type: "string" },
                lance_inicial: { type: "number" },
                valor_avaliacao: { type: "number" },
                data_leilao: { type: "string" },
                link_original: { type: "string" },
                numero_lote: { type: "string" },
                banco: { type: "string" },
                situacao_bem: { type: "string" },
                tipo_bem: { type: "string" },
                descricao: { type: "string" }
              }
            }
          }
        }
      }
    });
    return resultado?.lotes || [];
  };

  // Varrer todos os leiloeiros (todos cadastrados, não apenas filtrados)
  const varrerTodos = async () => {
    const lista = leiloeiros; // sempre todos cadastrados
    if (!confirm(`Iniciar varredura de TODOS os ${lista.length} site(s) cadastrados? Isso pode levar vários minutos.`)) return;
    setVarrendoTodos(true);

    // Inicializa progresso
    const prog = lista.map(l => ({ leiloeiro: l, status: "aguardando", lotes: 0 }));
    setProgresso([...prog]);

    let totalLotes = 0;
    for (let i = 0; i < lista.length; i++) {
      const l = lista[i];
      prog[i].status = "varrendo";
      setVarrendo(l.id);
      setProgresso([...prog]);

      const lotes = await buscarLotesDoSite(l);

      if (lotes.length > 0) {
        const parseNum = (v) => { const n = parseFloat(String(v).replace(/[^\d.,]/g, "").replace(",", ".")); return isNaN(n) ? undefined : n; };
        const lotesParaSalvar = lotes.map(lote => ({
          ...lote,
          site_leilao: l.nome,
          status: "monitorando",
          tipo_bem: lote.tipo_bem || "outro",
          lance_inicial: lote.lance_inicial != null ? parseNum(lote.lance_inicial) : undefined,
          valor_avaliacao: lote.valor_avaliacao != null ? parseNum(lote.valor_avaliacao) : undefined,
          lance_atual: lote.lance_atual != null ? parseNum(lote.lance_atual) : undefined,
        }));
        await base44.entities.Lote.bulkCreate(lotesParaSalvar);
        prog[i].status = "ok";
        prog[i].lotes = lotes.length;
        totalLotes += lotes.length;
      } else {
        prog[i].status = "vazio";
      }
      setProgresso([...prog]);
    }

    setVarrendo(null);
    setVarrendoTodos(false);
  };

  const buscarLeiloeiros = async () => {
    if (!confirm("Isso irá buscar leiloeiros em todas as Juntas Comerciais do Brasil via IA. Pode levar alguns minutos. Continuar?")) return;
    setBuscandoLeiloeiros(true);

    const estados = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];

    for (const uf of estados) {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Busque leiloeiros oficiais registrados na Junta Comercial do estado ${uf} (Brasil). 
        Para cada leiloeiro encontrado, extraia: nome completo, CPF ou CNPJ, matrícula, cidade, estado, telefone, email, site oficial, especialidades (veículos, imóveis, maquinário, etc), data de registro.
        Busque em fontes públicas: site das juntas comerciais estaduais, JUCEPA, JUCERJA, JUCESP, etc, e também sites de leilões conhecidos do estado.
        Retorne apenas leiloeiros com site ativo.`,
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
                  data_registro: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (resultado?.leiloeiros?.length > 0) {
        // Evitar duplicatas pelo site
        const sitesExistentes = leiloeiros.map(l => l.site).filter(Boolean);
        const novos = resultado.leiloeiros.filter(l => l.nome && l.site && !sitesExistentes.includes(l.site));
        if (novos.length > 0) {
          const criados = await base44.entities.Leiloeiro.bulkCreate(novos.map(l => ({ ...l, ativo: true })));
          setLeiloeiros(prev => [...prev, ...criados]);
        }
      }
    }

    setBuscandoLeiloeiros(false);
  };

  const loteirosFiltrados = leiloeiros.filter(l => {
    if (estadoFiltro && l.estado !== estadoFiltro) return false;
    if (busca) {
      const b = busca.toLowerCase();
      if (![l.nome, l.site, l.estado, l.cidade].filter(Boolean).join(" ").toLowerCase().includes(b)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Users className="w-7 h-7 text-yellow-500" />
              Leiloeiros Oficiais
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Leiloeiros cadastrados nas Juntas Comerciais do Brasil
              {leiloeiros.length > 0 && ` • ${leiloeiros.length} cadastrados`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setModalAdicionar(true)}
              className="flex items-center gap-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar Manualmente
            </button>
            <button
              onClick={buscarLeiloeiros}
              disabled={buscandoLeiloeiros || varrendoTodos}
              className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {buscandoLeiloeiros ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Buscando em todas as JUCEs...</>
              ) : (
                <><Search className="w-4 h-4" /> Buscar Leiloeiros</>
              )}
            </button>
            {leiloeiros.length > 0 && (
              <button
                onClick={varrerTodos}
                disabled={varrendoTodos || varrendo !== null}
                className="flex items-center gap-1.5 text-sm bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4" />
                {varrendoTodos ? "Varrendo..." : `Varrer Todos os ${leiloeiros.length} Sites`}
              </button>
            )}
            {leiloeiros.length > 0 && (
              <button
                onClick={limparTodos}
                className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Limpar
              </button>
            )}
            <button
              onClick={carregar}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl border border-gray-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progresso da varredura */}
        {progresso.length > 0 && <VarreduraProgress progresso={progresso} />}

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou site..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={estadoFiltro}
              onChange={e => setEstadoFiltro(e.target.value)}
              className="border border-gray-200 dark:border-gray-700 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Todos os estados</option>
              {[...new Set(ESTADOS)].sort().map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-3xl h-96 animate-pulse border-2 border-yellow-500/20" />
            ))}
          </div>
        ) : loteirosFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-16 text-center">
            <div className="text-5xl mb-4">🔨</div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Nenhum leiloeiro encontrado</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">Ajuste os filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {loteirosFiltrados.map(l => (
              <CardLeiloeiro
                key={l.id}
                leiloeiro={l}
                onVarrer={() => varrerSite(l)}
                varrendo={varrendo === l.id}
              />
            ))}
          </div>
        )}
      </div>

      {modalAdicionar && (
        <ModalAdicionarLeiloeiro
          onClose={() => setModalAdicionar(false)}
          onSalvo={(novo) => {
            setLeiloeiros(prev => [novo, ...prev]);
            setModalAdicionar(false);
          }}
        />
      )}
    </div>
  );
}
