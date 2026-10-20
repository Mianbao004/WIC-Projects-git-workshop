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

// Map: drag the person (or click the map) to pick where to step in.
const map = L.map('map').setView([35.68, 139.69], 3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const personIcon = L.divIcon({
  className: 'person',
  html: '📍',
  iconSize: [32, 32],
  iconAnchor: [16, 30],   // the pin's tip touches the location
  popupAnchor: [0, -40],  // the card's tip sits 40px above that: above the pin with a small gap
});
const person = L.marker([35.68, 139.69], { draggable: true, icon: personIcon }).addTo(map);

// Bigger screens: the weather card floats above the pin. Phones: it sits below the map.
const phoneQuery = window.matchMedia('(max-width: 600px)');
const popupOptions = { className: 'weather-popup', closeButton: false, autoClose: false, closeOnClick: false };

function placeCard() {
  if (phoneQuery.matches) {
    person.unbindPopup();
    errorEl.after(resultEl); // put the card back in the page, under the map
  } else {
    person.bindPopup(resultEl, popupOptions);
    if (!resultEl.hidden) person.openPopup();
  }
}

placeCard();
phoneQuery.addEventListener('change', placeCard); // re-check when the window is resized or a phone rotates

function stepInAt(latlng) {
  // wrap() keeps longitude within -180..180 even if the map was scrolled around the world.
  const { lat, lng } = latlng.wrap();
  form.lat.value = lat.toFixed(2);
  form.lon.value = lng.toFixed(2);
  form.requestSubmit();
}

person.on('dragend', () => stepInAt(person.getLatLng()));
map.on('click', (event) => {
  person.setLatLng(event.latlng);
  stepInAt(event.latlng);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const lat = form.lat.value;
  const lon = form.lon.value;
  errorEl.hidden = true;
  const button = form.querySelector('button');
  button.disabled = true;

  try {
    const response = await fetch(`/api/weather?lat=${lon}&lon=${lat}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    person.setLatLng([Number(lat), Number(lon)]);
    map.panTo([Number(lat), Number(lon)]);
    render(data);
  } catch (err) {
    resultEl.hidden = true;
    person.closePopup();
    errorEl.textContent = `Could not step in: ${err.message}`;
    errorEl.hidden = false;
  } finally {
    // Runs after success OR error, so the button always comes back.
    button.disabled = false;
  }
});

function render(weather) {
  cityEl.textContent = weather.city;
  tempEl.textContent = `${Math.round(weather.temp)}°C`;
  descriptionEl.textContent = weather.description;
  document.body.dataset.condition = weather.condition.toLowerCase();
  startClock(weather.timezone);
  resultEl.hidden = false;
  person.openPopup();
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
