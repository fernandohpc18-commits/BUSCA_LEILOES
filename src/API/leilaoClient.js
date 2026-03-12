const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbz2M_FMdZKkhR-VLcN2sftoMn-roSo06uK3mO37Jw_EhO2YI-SkWcVmyjtqXiOCGtlGgg/exec";

export const leilaoClient = {
  getLotes: async () => {
    const res = await fetch(`${GOOGLE_API_URL}?sheet=Lotes&t=${Date.now()}`, { redirect: "follow" });
    return await res.json();
  },

  getLeiloeiros: async () => {
    const res = await fetch(`${GOOGLE_API_URL}?sheet=Leiloeiros&t=${Date.now()}`, { redirect: "follow" });
    return await res.json();
  },

  executarBuscaAutomatica: async () => {
    // Usamos mode: 'no-cors' para disparar o gatilho sem travar no navegador
    return await fetch(GOOGLE_API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "varrer_todos_lotes" })
    });
  }
};
