const form = document.querySelector('#coords-form');
const errorEl = document.querySelector('#error');
const resultEl = document.querySelector('#result');
const cityEl = document.querySelector('#city');
const clockEl = document.querySelector('#clock');
const tempEl = document.querySelector('#temp');
const descriptionEl = document.querySelector('#description');

let clockTimer;

// Create the raindrops once. Each gets a random spot across the screen, speed, start time, and layer.
// style.css decides how many show and how fast they fall for drizzle, rain, or thunderstorm.
const sky = document.querySelector('.sky');
for (let i = 0; i < 150; i++) {
  const drop = document.createElement('span');
  drop.className = Math.random() < 0.5 ? 'drop far' : 'drop';
  drop.style.left = `${Math.random() * 100}%`;
  drop.style.setProperty('--fall', `${0.6 + Math.random() * 0.4}s`); // 0.6s to 1s
  drop.style.setProperty('--cloud-y', `${Math.random() * 50}%`); // clouds: random height, top to middle
  drop.style.animationDelay = `${-Math.random() * 100}s`; // negative = already mid-way on load
  sky.append(drop);
}

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
