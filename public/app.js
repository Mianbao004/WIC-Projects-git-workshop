const form = document.querySelector('#coords-form');
const errorEl = document.querySelector('#error');
const resultEl = document.querySelector('#result');
const cityEl = document.querySelector('#city');
const clockEl = document.querySelector('#clock');
const tempEl = document.querySelector('#temp');
const descriptionEl = document.querySelector('#description');

let clockTimer;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const lat = form.lat.value;
  const lon = form.lon.value;
  errorEl.hidden = true;

  try {
    const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    render(data);
  } catch (err) {
    resultEl.hidden = true;
    errorEl.textContent = `Could not step in: ${err.message}`;
    errorEl.hidden = false;
  }
});

function render(weather) {
  cityEl.textContent = weather.city;
  tempEl.textContent = `${Math.round(weather.temp)}°C`;
  descriptionEl.textContent = weather.description;
  document.body.dataset.condition = weather.condition.toLowerCase();
  startClock(weather.timezone);
  resultEl.hidden = false;
}

// timezoneOffset is the location's offset from UTC, in seconds.
function startClock(timezoneOffset) {
  clearInterval(clockTimer);
  const tick = () => {
    // Shift "now" by the offset, then format as UTC so the browser's own timezone is ignored.
    const localTime = new Date(Date.now() + timezoneOffset * 1000);
    clockEl.textContent = localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };
  tick();
  clockTimer = setInterval(tick, 1000);
}
