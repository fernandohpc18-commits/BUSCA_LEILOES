const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar:", error);
      return [];
    }
  },

  executarVarreduraLotes: async () => {
    try {
      // Usamos no-cors para evitar os avisos chatos do console que você viu
      await fetch(GOOGLE_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'varrer_todos_lotes' })
      });
      return { status: "sucesso" };
    } catch (e) {
      throw e;
    }
  }
};
