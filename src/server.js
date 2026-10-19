import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const app = express();
app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));

// GET /api/weather?lat=35.68&lon=139.69
app.get('/api/weather', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!isValidCoordinate(lat, 90) || !isValidCoordinate(lon, 180)) {
    return res.status(400).json({ error: 'lat must be between -90 and 90 and lon between -180 and 180' });
  }

  const params = new URLSearchParams({ lat, lon, units: 'metric', appid: API_KEY });
  const url = `${OPENWEATHER_URL}?${params}`;

  try {
    const raw = API_KEY ? await fetchOpenWeather(url) : mockOpenWeather(params);
    res.json(toWeather(raw));
  } catch (err) {
    // Full details stay in the server log; the URL contains the API key.
    console.error(err);
    res.status(502).json({ error: 'Weather service is unavailable, please try again' });
  }
});

function isValidCoordinate(value, max) {
  return Number.isFinite(value) && Math.abs(value) <= max;
}

async function fetchOpenWeather(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenWeather request failed (${response.status}): ${url}`);
  }
  return response.json();
}

// Used when OPENWEATHER_API_KEY is not set. Behaves like the real API
// (Kelvin unless units=metric) but always returns Tokyo.
function mockOpenWeather(params) {
  const kelvin = 288.15;
  const now = Math.floor(Date.now() / 1000);
  return {
    name: 'Tokyo (mock data)',
    timezone: 9 * 3600,
    main: { temp: params.get('units') === 'metric' ? kelvin - 273.15 : kelvin },
    weather: [{ main: 'Clouds', description: 'scattered clouds' }],
    sys: { sunrise: now - 6 * 3600, sunset: now + 6 * 3600 },
  };
}

// Only send the browser the fields it needs.
function toWeather(raw) {
  return {
    city: raw.name,
    temp: raw.main.temp,
    condition: raw.weather[0].main,
    description: raw.weather[0].description,
    timezone: raw.timezone,
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
  };
}

app.listen(PORT, () => {
  console.log(`Weather app running at http://localhost:${PORT}`);
});
