const cursor = document.getElementById("cursor");
const debug = document.getElementById("debug");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let connected = false;

// URL du bridge
const BRIDGE_URL = "https://protopie-bridge.onrender.com";

// 🧩 Essaie d’abord en WebSocket
function connectWS() {
  try {
    const ws = new WebSocket(BRIDGE_URL.replace("https", "wss"));
    ws.onopen = () => {
      connected = true;
      console.log("✅ Connecté via WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.x !== undefined && data.y !== undefined) {
        targetX = data.x;
        targetY = data.y;
        debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
      }
    };

    ws.onerror = (err) => {
      console.warn("⚠️ Erreur WebSocket :", err);
      ws.close();
    };

    ws.onclose = () => {
      if (!connected) {
        console.log("🔄 Échec WebSocket, passage en SSE...");
        connectSSE(); // fallback
      }
    };
  } catch (err) {
    console.warn("⚠️ Échec WebSocket, fallback SSE :", err);
    connectSSE();
  }
}

// 🪄 Fallback : SSE
function connectSSE() {
  const evtSource = new EventSource(`${BRIDGE_URL}/events`);

  evtSource.onopen = () => console.log("✅ Connecté via SSE");
  evtSource.onerror = (err) => console.warn("⚠️ Erreur SSE :", err);

  evtSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.x !== undefined && data.y !== undefined) {
        targetX = data.x;
        targetY = data.y;
        debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
      }
    } catch (err) {
      console.warn("⚠️ Parsing SSE :", err);
    }
  };
}

// 🌀 Animation fluide
function animate() {
  const easing = 0.2;
  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animate);
}

animate();
connectWS(); // Lance la connexion
