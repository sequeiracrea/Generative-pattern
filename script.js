const cursor = document.getElementById("cursor");
const debug = document.getElementById("debug");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// 🟢 Connexion SSE
const evtSource = new EventSource("https://protopie-bridge.onrender.com/events");

evtSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (typeof data.x === "number" && typeof data.y === "number") {
      // On ne garde que la dernière position reçue
      targetX = data.x;
      targetY = data.y;
      debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
    }
  } catch (err) {
    console.warn("Erreur de parsing SSE :", err);
  }
};

// 🌀 Animation catch-up (skip positions intermédiaires si trop rapides)
function animate() {
  const maxStep = 30; // déplacement max par frame (px)

  let dx = targetX - currentX;
  let dy = targetY - currentY;

  // Limiter le déplacement pour éviter les “sauts”
  if (Math.abs(dx) > maxStep) dx = dx > 0 ? maxStep : -maxStep;
  if (Math.abs(dy) > maxStep) dy = dy > 0 ? maxStep : -maxStep;

  currentX += dx;
  currentY += dy;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}

animate();
