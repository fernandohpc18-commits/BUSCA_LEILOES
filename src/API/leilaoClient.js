// ATENÇÃO: Verifique se essa URL termina com /exec
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbzrQnnglmf0EzqJWY1M-Q6E-NkTTbZZb1ulHiOExwKz5ROovgbic1cqjtxY5p5aQzHAuw/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      // O Date.now() impede que o navegador mostre dados velhos (cache)
      const url = `${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`;
      console.log("Conectando ao Google...");
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log("Lotes carregados com sucesso:", data.length);
      
      // Se o Google retornar um erro em vez de lista, enviamos vazio para não travar
      if (data.status === "erro") {
        console.error("Erro vindo do Google:", data.message);
        return [];
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
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
      console.error("Falha ao iniciar varredura:", e);
      throw e;
    }
  }
};
