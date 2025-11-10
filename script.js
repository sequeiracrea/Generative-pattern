
const circle = document.getElementById("circle");

// Connexion SSE
const evtSource = new EventSource("https://protopie-bridge.onrender.com/events");
evtSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    circle.style.left = `${data.x - circle.offsetWidth / 2}px`;
    circle.style.top = `${data.y - circle.offsetHeight / 2}px`;
  } catch (e) {
    console.error('Erreur JSON SSE :', e);
  }
};
