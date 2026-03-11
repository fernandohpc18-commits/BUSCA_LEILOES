// ATENÇÃO: Verifique se essa URL é a do deploy mais recente (Nova Versão)
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, {
        method: "GET",
        redirect: "follow"
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro nos Lotes:", error);
      return [];
    }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, {
        method: "GET",
        redirect: "follow"
      });
      const data = await response.json();
      
      // Se o Google retornar erro de aba, enviamos lista vazia para não quebrar o site
      if (data.status === "erro") return [];
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro nos Leiloeiros:", error);
      return [];
    }
  },

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
      console.error("Erro na varredura:", e);
      throw e;
    }
  }
};
