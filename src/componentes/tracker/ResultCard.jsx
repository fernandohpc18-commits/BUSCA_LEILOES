import React from 'react';
import { AlertTriangle, User, MapPin, History } from "lucide-react";

export const CardRastreamento = ({ dados }) => {
  if (!dados) return null;

  return (
    <div className="bg-slate-900 border border-amber-500/50 text-white shadow-xl rounded-2xl overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-amber-500 font-bold flex items-center gap-2 text-xl">
          <History className="w-5 h-5" /> 
          Relatório de Investigação: {dados.placa || "Dossiê"}
        </h3>
      </div>
      
      <div className="p-6 space-y-4">
        {/* RECALL */}
        <div className={`p-4 rounded-lg flex items-start gap-3 ${dados.recall ? 'bg-red-900/30 border border-red-500' : 'bg-green-900/20 border border-green-500'}`}>
          <AlertTriangle className={dados.recall ? 'text-red-500' : 'text-green-500'} />
          <div>
            <p className="font-bold">Status de Recall</p>
            <p className="text-sm text-slate-300">{dados.recall_info || "Nenhum recall pendente localizado para este chassi."}</p>
          </div>
        </div>

        {/* ÚLTIMOS DONOS */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-start gap-3">
          <User className="text-blue-400" />
          <div>
            <p className="font-bold">Histórico de Propriedade</p>
            <p className="text-sm text-slate-300">{dados.historico_donos || "Informação sendo processada via portais de transparência..."}</p>
          </div>
        </div>

        {/* LOCALIDADE E PASSAGENS */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-start gap-3">
          <MapPin className="text-orange-400" />
          <div>
            <p className="font-bold">Última Localidade / Pátio</p>
            <p className="text-sm text-slate-300">{dados.localidade || "Localizado em: Aguardando cruzamento de editais..."}</p>
          </div>
        </div>

        {/* OUTRAS INFORMAÇÕES RELEVANTES */}
        <div className="text-[10px] text-slate-500 italic pt-2">
          * Dados obtidos via varredura em tempo real (Detran, TJ, Diários Oficiais e Gemini IA).
        </div>
      </div>
    </div>
  );
};
