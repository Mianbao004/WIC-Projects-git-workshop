import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const PORT = process.env.PORT || 3000;

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

const app = express();
app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));

// GET /api/weather?lat=35.68&lon=139.69
app.get('/api/weather', async (req, res) => {
  const lat = toCoordinate(req.query.lat);
  const lon = toCoordinate(req.query.lon);
  if (!isValidCoordinate(lat, 90) || !isValidCoordinate(lon, 180)) {
    return res.status(400).json({ error: 'lat must be between -90 and 90 and lon between -180 and 180' });
  }

  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'auto',
  });

  try {
    const raw = await fetchOpenMeteo(`${OPEN_METEO_URL}?${params}`);
    res.json(toWeather(raw));
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Weather service is unavailable, please try again' });
  }
});

// Number('') is 0, so a missing or blank value must be rejected before converting.
function toCoordinate(raw) {
  return typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
}

function isValidCoordinate(value, max) {
  return Number.isFinite(value) && Math.abs(value) <= max;
}

async function fetchOpenMeteo(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`Open-Meteo request failed (${response.status}): ${body.reason ?? 'no details'}`);
  }
  return response.json();
}

// Open-Meteo returns WMO weather codes. Map each one to a condition the frontend styles.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
const WEATHER_CODES = {
  0: 'sunny',          1: 'sunny',            // clear sky, mainly clear
  2: 'clouds',         3: 'clouds',
  45: 'clouds',        48: 'clouds',          // fog
  51: 'drizzle',       53: 'drizzle',         55: 'drizzle',
  56: 'drizzle',       57: 'drizzle',         // freezing drizzle
  61: 'rain',          63: 'rain',            65: 'rain',
  66: 'rain',          67: 'rain',            // freezing rain
  71: 'light snow',    73: 'snow',            75: 'snow',
  77: 'light snow',                           // snow grains
  80: 'rain',          81: 'rain',            82: 'rain',    // rain showers
  85: 'light snow',    86: 'snow',            // snow showers
  95: 'thunderstorm',  96: 'thunderstorm',    99: 'thunderstorm',
};

function describeWeatherCode(code) {
  // Fallback in case Open-Meteo ever sends a code that isn't in the table.
  const condition = WEATHER_CODES[code] ?? 'clouds';
  return { condition, description: condition };
}

// Only send the browser the fields it needs.
function toWeather(raw) {
  return {
    city: raw.timezone,
    temp: raw.current.temperature_2m,
    ...describeWeatherCode(raw.current.weather_code),
    timezone: raw.utc_offset_seconds,
    isDay: raw.current.is_day === 1,
  };
}

app.listen(PORT, () => {
  console.log(`Weather app running at http://localhost:${PORT}`);
});
