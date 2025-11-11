const cursor = document.getElementById("cursor");
const debug = document.getElementById("debug");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// 🟢 Connexion WebSocket (remplace l'ancien EventSource)
const socket = new WebSocket("wss://protopie-bridge.onrender.com");

socket.onopen = () => console.log("✅ Connecté au serveur WebSocket");
socket.onerror = (err) => console.error("⚠️ Erreur WebSocket :", err);

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.x !== undefined && data.y !== undefined) {
      targetX = data.x;
      targetY = data.y;
      debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
    }
  } catch (err) {
    console.warn("⚠️ Message non valide :", event.data);
  }
};

// 🌀 Animation fluide (60 fps)
function animate() {
  // interpolation douce pour fluidifier le mouvement
  const easing = 0.25; // un peu plus fluide que 0.2
  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}
animate();
