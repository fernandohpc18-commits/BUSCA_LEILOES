import React, { useState, useEffect } from "react";
import { leilaoClient } from "@/API/leilaoClient";
import { 
  TrendingUp, Users, Package, AlertCircle, 
  Map, Activity, Clock, ShieldCheck, ArrowUpRight
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLotes: 0,
    totalLeiloeiros: 0,
    investigacoes: 0,
    valorTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [lotes, leiloeiros] = await Promise.all([
          leilaoClient.getLotes(),
          leilaoClient.getLeiloeiros()
        ]);

        const valor = lotes.reduce((acc, curr) => acc + (Number(curr.lance_atual) || 0), 0);

        setStats({
          totalLotes: lotes.length,
          totalLeiloeiros: leiloeiros.length,
          investigacoes: lotes.filter(l => l.categoria === "Dossiê Gerado").length,
          valorTotal: valor
        });
      } catch (e) {
        console.error("Erro no Dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const cards = [
    { 
      label: "Lotes Ativos", 
      value: stats.totalLotes, 
      icon: Package, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      desc: "Veículos e Imóveis"
    },
    { 
      label: "Leiloeiros", 
      value: stats.totalLeiloeiros, 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      desc: "Fontes Homologadas"
    },
    { 
      label: "Dossiês IA", 
      value: stats.investigacoes, 
      icon: ShieldCheck, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      desc: "Investigações Realizadas"
    },
    { 
      label: "Volume em Lances", 
      value: `R$ ${stats.valorTotal.toLocaleString('pt-BR')}`, 
      icon: TrendingUp, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      desc: "Oportunidades de Mercado"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-amber-500 italic tracking-tighter uppercase">Painel de Controle</h1>
            <p className="text-slate-500 font-mono text-xs flex items-center gap-2">
              <Activity size={14} className="text-green-500 animate-pulse" /> 
              SISTEMA DE VARREDURA OPERACIONAL
            </p>
          </div>
          <div className="text-right">
             <p className="text-slate-400 text-[10px] uppercase font-bold">Última Atualização</p>
             <p className="text-white font-mono text-sm">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className={`${card.bg} absolute top-0 right-0 p-4 rounded-bl-3xl transition-transform group-hover:scale-110`}>
                <card.icon className={card.color} size={24} />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase mb-1">{card.label}</p>
              <h2 className="text-2xl font-black text-white">{loading ? "..." : card.value}</h2>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <ArrowUpRight size={10} className="text-green-500"/> {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Seção Inferior: Monitoramento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feed de Atividades */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-amber-500 font-bold text-sm uppercase mb-6 flex items-center gap-2">
              <Clock size={16} /> Status da Varredura IA
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-white">Gemini 1.5 Flash: Operacional</p>
                  <p className="text-[10px] text-slate-500">Conectado à API do Google Cloud para análise de editais.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-white">Google Sheets: Sincronizado</p>
                  <p className="text-[10px] text-slate-500">Banco de dados remoto atualizado com {stats.totalLotes} registros.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <div>
                  <p className="text-xs font-bold text-white">Crawler: Aguardando Gatilho</p>
                  <p className="text-[10px] text-slate-500">Varredura de novos sites disponível na aba de lotes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dica de Especialista */}
          <div className="bg-amber-500 rounded-2xl p-6 text-black flex flex-col justify-between">
            <div>
              <AlertCircle size={32} className="mb-4" />
              <h3 className="font-black text-xl leading-tight uppercase mb-2">Dica do Sistema</h3>
              <p className="text-sm font-medium leading-snug">
                Veículos com lance atual abaixo de 40% da avaliação têm 85% mais chance de lucro em revenda rápida.
              </p>
            </div>
            <button className="mt-6 bg-black text-white text-[10px] font-black py-2 px-4 rounded-lg uppercase">
              Ver Oportunidades
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
