// Verifique se esta URL é a do seu deploy mais recente (Nova Versão)
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  // Busca os Lotes para o Catálogo e Painel
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, {
        method: "GET",
        redirect: "follow"
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar lotes:", error);
      return [];
    }
  },

  // BUSCA OS LEILOEIROS (Essa é a que está faltando no seu erro!)
  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, {
        method: "GET",
        redirect: "follow"
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar leiloeiros:", error);
      return [];
    }
  },

  // Dispara a varredura por IA
  executarVarreduraLotes: async () => {
    try {
      await fetch(GOOGLE_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'varrer_todos_lotes' })
      });
      return { status: "sucesso" };
    } catch (e) {
      console.error("Erro no POST:", e);
      throw e;
    }
  }
};
