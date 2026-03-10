import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, User, MapPin, History } from "lucide-react";

export const CardRastreamento = ({ dados }) => {
  if (!dados) return null;

  return (
    <Card className="bg-slate-900 border-gold-500 text-white shadow-xl">
      <CardHeader className="border-b border-slate-800">
        <CardTitle className="text-gold-400 flex items-center gap-2">
          <History className="w-5 h-5" /> Relatório de Investigação: {dados.placa}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* RECALL */}
        <div className={`p-4 rounded-lg flex items-start gap-3 ${dados.recall ? 'bg-red-900/30 border border-red-500' : 'bg-green-900/20 border border-green-500'}`}>
          <AlertTriangle className={dados.recall ? 'text-red-500' : 'text-green-500'} />
          <div>
            <p className="font-bold">Status de Recall</p>
            <p className="text-sm">{dados.recall_info || "Nenhum recall pendente localizado para este chassi."}</p>
          </div>
        </div>

        {/* ÚLTIMOS DONOS */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-start gap-3">
          <User className="text-blue-400" />
          <div>
            <p className="font-bold">Histórico de Propriedade</p>
            <p className="text-sm">{dados.historico_donos || "Informação sendo processada via portais de transparência..."}</p>
          </div>
        </div>

        {/* LOCALIDADE E PASSAGENS */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-start gap-3">
          <MapPin className="text-orange-400" />
          <div>
            <p className="font-bold">Última Localidade / Pátio</p>
            <p className="text-sm">{dados.localidade || "Localizado em: Aguardando cruzamento de editais..."}</p>
          </div>
        </div>

        {/* OUTRAS INFORMAÇÕES RELEVANTES */}
        <div className="text-xs text-slate-400 italic">
          * Dados obtidos via varredura em tempo real (Detran, TJ, Diários Oficiais e Gemini IA).
        </div>
      </CardContent>
    </Card>
  );
};
