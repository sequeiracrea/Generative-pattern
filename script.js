const circle = document.getElementById('circle');

// Écoute le flux SSE depuis ton bridge
const evtSource = new EventSource('https://protopie-bridge.onrender.com/events');

evtSource.onmessage = function(event) {
  try {
    const data = JSON.parse(event.data);
    circle.style.left = `${data.x - circle.offsetWidth / 2}px`;
    circle.style.top = `${data.y - circle.offsetHeight / 2}px`;
  } catch(err) {
    console.error('Erreur parsing SSE :', err);
  }
};
