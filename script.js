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

// 🌀 Animation adaptative
function animate() {
  // Calcul de la distance au target
  const dx = targetX - currentX;
  const dy = targetY - currentY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Easing adaptatif : plus loin = plus rapide, plus proche = plus lent
  const maxEasing = 0.3;  // vitesse maximale
  const minEasing = 0.05; // vitesse minimale pour ne jamais s'arrêter
  const easing = Math.min(maxEasing, Math.max(minEasing, distance / 100));

  // Déplacement
  currentX += dx * easing;
  currentY += dy * easing;

  // Appliquer la transformation
  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}

animate();
