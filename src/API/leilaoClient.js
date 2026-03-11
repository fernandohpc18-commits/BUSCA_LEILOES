const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbzrQnnglmf0EzqJWY1M-Q6E-NkTTbZZb1ulHiOExwKz5ROovgbic1cqjtxY5p5aQzHAuw/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      const url = `${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`;
      console.log("Tentando buscar dados de:", url);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro na resposta da rede");
      
      const data = await response.json();
      console.log("Dados que chegaram no site:", data);
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("ERRO CRÍTICO NO SITE:", error);
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
    } catch (e) { console.error(e); throw e; }
  }
};
