const evtSource = new EventSource("https://protopie-bridge.onrender.com/events");

const cursor = document.getElementById("cursor");
let lastUpdate = 0;

evtSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const now = Date.now();

  if (now - lastUpdate < 16) return; // 60 fps
  lastUpdate = now;

  if (data.x !== undefined) cursor.style.left = `${data.x}px`;
  if (data.y !== undefined) cursor.style.top = `${data.y}px`;
};

evtSource.onerror = () => {
  console.warn("⚠️ Connexion SSE perdue");
};
