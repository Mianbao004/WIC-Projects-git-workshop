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

// Open-Meteo returns WMO weather codes. Map them to the conditions the frontend styles.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
function describeWeatherCode(code) {
  if (code === 0) return { condition: 'clear', description: 'clear sky' };
  if (code <= 3) return { condition: 'clouds', description: 'partly cloudy' };
  if (code <= 48) return { condition: 'fog', description: 'fog' };
  if (code <= 57) return { condition: 'drizzle', description: 'drizzle' };
  if (code <= 67) return { condition: 'rain', description: 'rain' };
  if (code <= 77) return { condition: 'snow', description: 'snow' };
  if (code <= 82) return { condition: 'rain', description: 'rain showers' };
  if (code <= 86) return { condition: 'snow', description: 'snow showers' };
  return { condition: 'thunderstorm', description: 'thunderstorm' };
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
