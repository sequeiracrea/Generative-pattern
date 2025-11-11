const cursor = document.getElementById("cursor");
const debug = document.getElementById("debug");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// SSE connection
const evtSource = new EventSource("https://protopie-bridge.onrender.com/events");

evtSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.x !== undefined) targetX = data.x;
    if (data.y !== undefined) targetY = data.y;

    debug.textContent = `x: ${targetX.toFixed(2)} | y: ${targetY.toFixed(2)}`;
  } catch (err) {
    console.warn("Erreur de parsing SSE :", err);
  }
};

// Smooth animation
function animate() {
  const easing = 0.2;
  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;

  cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;

  requestAnimationFrame(animate);
}

animate();
