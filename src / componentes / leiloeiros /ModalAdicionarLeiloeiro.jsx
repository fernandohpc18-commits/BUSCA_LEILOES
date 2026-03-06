import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Globe, Loader2, Plus } from "lucide-react";

export default function ModalAdicionarLeiloeiro({ onClose, onSalvo }) {
  const [form, setForm] = useState({
    nome: "",
    site: "",
    site2: "",
    site3: "",
    estado: "",
    cidade: "",
    telefone: "",
    email: "",
    especialidades: [],
  });
  const [salvando, setSalvando] = useState(false);

  const campo = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key] || ""}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
      />
    </div>
  );

  const salvar = async () => {
    if (!form.nome) return;
    setSalvando(true);
    const { site2, site3, ...rest } = form;
    const dados = { ...rest, ativo: true };
    // Inclui sites extras nas especialidades ou como campo extra se preenchidos
    if (site2) dados.site2 = site2;
    if (site3) dados.site3 = site3;
    const criado = await base44.entities.Leiloeiro.create(dados);
    setSalvando(false);
    onSalvo(criado);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-yellow-600" />
            Adicionar Leiloeiro Manualmente
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {campo("Nome do Leiloeiro *", "nome", "text", "Ex: João Silva Leilões")}
          {campo("Site *", "site", "url", "https://...")}
          {campo("Site 2", "site2", "url", "https://...")}
          {campo("Site 3", "site3", "url", "https://...")}
          <div className="grid grid-cols-2 gap-3">
            {campo("Estado (UF)", "estado", "text", "SP")}
            {campo("Cidade", "cidade", "text", "São Paulo")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {campo("Telefone", "telefone", "tel", "(11) 99999-9999")}
            {campo("E-mail", "email", "email", "contato@...")}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando || !form.nome}
              className="flex-1 bg-yellow-500 text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {salvando ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
