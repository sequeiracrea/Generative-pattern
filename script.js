const cursor = document.getElementById("cursor");
const debug = document.getElementById("debug");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let moving = false; // indique si on doit bouger

const evtSource = new EventSource("https://protopie-bridge.onrender.com/events");

evtSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (typeof data.x === "number" && typeof data.y === "number") {
      targetX = data.x;
      targetY = data.y;
      moving = true; // nouvelle donnée, on doit bouger
      debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
    }
  } catch (err) {
    console.warn("Erreur de parsing SSE :", err);
  }
};

function animate() {
  if (moving) {
    const maxStep = 30;
    let dx = targetX - currentX;
    let dy = targetY - currentY;

    // Limiter le pas
    if (Math.abs(dx) > maxStep) dx = dx > 0 ? maxStep : -maxStep;
    if (Math.abs(dy) > maxStep) dy = dy > 0 ? maxStep : -maxStep;

    currentX += dx;
    currentY += dy;

    cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

    // Vérifier si on a atteint la cible
    if (Math.abs(targetX - currentX) < 0.5 && Math.abs(targetY - currentY) < 0.5) {
      moving = false; // arrêt du mouvement
      currentX = targetX;
      currentY = targetY;
    }
  }

  requestAnimationFrame(animate);
}

animate();
