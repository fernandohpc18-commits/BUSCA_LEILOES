import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, LayoutGrid, List, Trophy } from "lucide-react";
import FiltrosLote from "@/components/lotes/FiltrosLote";
import CardLote from "@/components/lotes/CardLote";
import CardLoteSupertrunfo from "@/components/lotes/CardLoteSupertrunfo";
import ModalAdicionarLote from "@/components/lotes/ModalAdicionarLote";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const FILTROS_INICIAL = {
  busca: "", placa: "", chassi: "", matricula: "",
  banco: "", tipo_bem: "", situacao_bem: "", status: ""
};

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState(FILTROS_INICIAL);
  const [modalAberto, setModalAberto] = useState(false);
  const [visualizacao, setVisualizacao] = useState("supertrunfo");

  const carregarLotes = async () => {
    setLoading(true);
    const data = await base44.entities.Lote.list("-created_date", 500);
    setLotes(data);
    setLoading(false);
  };

  useEffect(() => {
    carregarLotes();
    // Ao carregar, encerrar lotes com data passada
    base44.entities.Lote.filter({ status: "monitorando" }).then(ativos => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      ativos.forEach(lote => {
        if (lote.data_leilao) {
          const dataLote = new Date(lote.data_leilao);
          dataLote.setHours(0, 0, 0, 0);
          if (dataLote < hoje) {
            base44.entities.Lote.update(lote.id, { status: "nao_arrematado" });
          }
        }
      });
    });
  }, []);

  const handleFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const lotesFiltrados = lotes.filter(lote => {
    // Mostrar apenas lotes ativos (monitorando)
    if (lote.status !== "monitorando") return false;

    const busca = filtros.busca.toLowerCase();
    if (busca && ![lote.titulo, lote.descricao, lote.banco, lote.marca, lote.modelo, lote.site_leilao]
      .filter(Boolean).join(" ").toLowerCase().includes(busca)) return false;

    if (filtros.placa && !lote.placa?.toLowerCase().includes(filtros.placa.toLowerCase())) return false;
    if (filtros.chassi && !lote.chassi?.toLowerCase().includes(filtros.chassi.toLowerCase())) return false;
    if (filtros.matricula && !lote.matricula?.toLowerCase().includes(filtros.matricula.toLowerCase())) return false;
    if (filtros.banco && !lote.banco?.toLowerCase().includes(filtros.banco.toLowerCase())) return false;
    if (filtros.tipo_bem && lote.tipo_bem !== filtros.tipo_bem) return false;
    if (filtros.situacao_bem && lote.situacao_bem !== filtros.situacao_bem) return false;
    if (filtros.status && lote.status !== filtros.status) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 md:p-10 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Lotes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {loading ? "Carregando..." : `${lotesFiltrados.length} lote${lotesFiltrados.length !== 1 ? "s" : ""} encontrado${lotesFiltrados.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setVisualizacao("supertrunfo")}
                title="Supertrunfo"
                className={`p-2.5 transition-colors ${visualizacao === "supertrunfo" ? "bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisualizacao("grid")}
                title="Grid"
                className={`p-2.5 transition-colors ${visualizacao === "grid" ? "bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVisualizacao("lista")}
                title="Lista"
                className={`p-2.5 transition-colors ${visualizacao === "lista" ? "bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setModalAberto(true)}
              className="flex items-center gap-2 bg-gray-900 dark:bg-yellow-500 text-white dark:text-gray-900 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-yellow-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              Adicionar Lote
            </button>
          </div>
        </div>

        {/* Filtros */}
        <FiltrosLote
          filtros={filtros}
          onChange={handleFiltro}
          onClear={() => setFiltros(FILTROS_INICIAL)}
        />

        {/* Lista */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : lotesFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-16 text-center">
            <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4">🔍</div>
            <h3 className="text-gray-700 dark:text-gray-200 font-semibold text-lg mb-2">Nenhum lote encontrado</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Tente ajustar os filtros ou adicione novos lotes.</p>
          </div>
        ) : visualizacao === "supertrunfo" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {lotesFiltrados.map(lote => (
              <CardLoteSupertrunfo key={lote.id} lote={lote} />
            ))}
          </div>
        ) : visualizacao === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lotesFiltrados.map(lote => (
              <CardLote key={lote.id} lote={lote} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {lotesFiltrados.map(lote => (
              <Link
                key={lote.id}
                to={createPageUrl(`DetalheLote?id=${lote.id}`)}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                  {lote.fotos?.[0] ? (
                    <img src={lote.fotos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">{lote.titulo}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap gap-1 sm:gap-2">
                    {lote.site_leilao && <span>{lote.site_leilao}</span>}
                    {lote.placa && <span>• {lote.placa}</span>}
                    {lote.banco && <span>• {lote.banco}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {lote.lance_inicial && (
                    <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">R$ {lote.lance_inicial.toLocaleString("pt-BR")}</span>
                  )}
                  {lote.data_leilao && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(lote.data_leilao).toLocaleDateString("pt-BR")}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <ModalAdicionarLote
          onClose={() => setModalAberto(false)}
          onSalvo={(lote) => {
            setModalAberto(false);
            carregarLotes();
          }}
        />
      )}
    </div>
  );
}
