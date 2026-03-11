const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycby3kY7VnH_CyUpTMQykgt6k8SJEtf6FamX6VXLJxrd7LqT3VkJm34DqnyLHmNTCMAEjUw/exec";

export const leilaoClient = {
  getLotes: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  },

  getLeiloeiros: async () => {
    try {
      const response = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
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
    } catch (e) { throw e; }
  }
};
