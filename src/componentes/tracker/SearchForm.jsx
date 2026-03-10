import React, { useState } from "react";
import { leilaoClient } from "@/API/leilaoClient"; 
import { Search, Loader2, Car, Building2, FileText, Hash, ShieldCheck } from "lucide-react";

const TIPOS = [
  { value: "placa", label: "Placa", icon: Car, placeholder: "Ex: ABC1D23" },
  { value: "chassi", label: "Chassi", icon: Hash, placeholder: "Ex: 9BWZZZ..." },
  { value: "matricula", label: "Matrícula", icon: Building2, placeholder: "Ex: 12.345" },
  { value: "processo", label: "Processo", icon: FileText, placeholder: "Ex: 0001234..." },
];

export default function FormRastreamento({ onResultado }) {
  const [tipo, setTipo] = useState("placa");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  const tipoAtual = TIPOS.find(t => t.value === tipo);

  const buscar = async () => {
    if (!valor.trim()) return;
    setLoading(true);

    try {
      const resultadoInvestigacao = await leilaoClient.rastrearVeiculo(valor, "");
      onResultado(resultadoInvestigacao);
      setValor("");
    } catch (error) {
      console.error("Erro na investigação:", error);
      alert("Erro ao conectar com o servidor de busca.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6">
      <h3 className="font-semibold text-amber-500 mb-5 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5" />
        Nova Investigação Avançada
      </h3>

      <div className="flex flex-wrap gap-2 mb-5">
        {TIPOS.map(t => (
          <button
            key={t.value}
            onClick={() => { setTipo(t.value); setValor(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tipo === t.value 
                ? "bg-amber-500 text-black" 
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          value={valor}
          onChange={(e) => setValor(e.target.value.toUpperCase())}
          placeholder={tipoAtual.placeholder}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-amber-500 outline-none transition-all"
        />
        <tipoAtual.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <button
          onClick={buscar}
          disabled={loading || !valor}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          BUSCAR
        </button>
      </div>
    </div>
  );
}
