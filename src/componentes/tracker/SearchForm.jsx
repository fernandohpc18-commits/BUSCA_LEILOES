import React, { useState } from "react";
// Importamos o seu novo cliente gratuito
import { leilaoClient } from "@/API/leilaoClient"; 
import { Search, Loader2, Car, Building2, FileText, MapPin, Hash, ShieldCheck } from "lucide-react";

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
      // Chamamos a função de investigação que criamos no leilaoClient
      // Ela vai enviar a placa para o seu Google Script que usa o Gemini
      const resultadoInvestigacao = await leilaoClient.rastrearVeiculo(valor, "");

      // Envia o resultado para a tela principal
      onResultado(resultadoInvestigacao);
      
      // Limpa o campo após a busca
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
      <h3 className="font-semibold text-gold-400 mb-5 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-gold-500" />
        Nova Investigação Avançada (Grátis via Gemini)
      </h3>

      {/* Tipo de busca */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TIPOS.map(t => (
          <button
            key={t.value}
            onClick={() => { setTipo(t.value); setValor(""); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
