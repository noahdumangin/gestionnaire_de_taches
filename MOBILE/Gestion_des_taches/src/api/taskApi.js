const BASE_URL = "http://localhost:3000/task"; 

export const getTask = async ({ after, signal } = {}) => {
  try {
    let url = BASE_URL;
    if (after) {
      const encoded = encodeURIComponent(after);
      url = `${BASE_URL}?after=${encoded}`;
    }

    const res = await fetch(url, { signal });
    if (!res.ok) {
      console.log("Erreur réseau, status:", res.status);
      return [];
    }
    const data = await res.json();
    return data || [];
  } 
  catch (err) {
    if (err.name == 'AbortError') {
      return [];
    }
    console.log("Erreur getTask:", err);
    return [];
  }
};

  export async function simulateTasks() {
    const url = `${BASE_URL}/simulate`;
    try {
      const res = await fetch(url, { method: 'POST' });
      return res.ok;
    } 
    catch (err) {
      console.log('simulateTasks failed', err);
      return false;
    }
  }

  export async function createTask({ title, status }) {
  const url = `${BASE_URL}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });

    if (!res.ok) {
      throw new Error("Erreur lors de la création de la tâche");
    }

    return await res.json(); 
  }
  catch (err) {
    console.log("createTask failed", err);
    return null;
  }
}


