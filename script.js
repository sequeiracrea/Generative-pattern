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
      targetX = data.x;
      targetY = data.y;
      debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
    }
  } catch (err) {
    console.warn("Erreur de parsing SSE :", err);
  }
};

// 🌀 Animation fluide avec easing + vitesse maximale
function animate() {
  const easing = 0.2; // plus petit = plus fluide mais plus lent
  const maxStep = 50;   // limite déplacement par frame pour éviter "sauts" si backlog SSE

  // Calcul delta
  let dx = targetX - currentX;
  let dy = targetY - currentY;

  // Limiter le pas maximal
  if (Math.abs(dx) > maxStep) dx = dx > 0 ? maxStep : -maxStep;
  if (Math.abs(dy) > maxStep) dy = dy > 0 ? maxStep : -maxStep;

  currentX += dx * easing;
  currentY += dy * easing;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}
animate();
