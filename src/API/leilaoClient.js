// IMPORTANTE: Toda vez que fizer Deploy, verifique se esta URL é a mesma!
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      const url = `${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`;
      
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow" // CRUCIAL para o Google Script
      });

      if (!response.ok) throw new Error("Erro na rede");
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return [];
    }
  },

  executarVarreduraLotes: async () => {
    try {
      // Usamos no-cors para disparar a ação sem travar o site
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
