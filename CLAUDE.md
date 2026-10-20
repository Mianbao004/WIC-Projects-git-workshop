# Step Into the Weather (WIC Git workshop)

## About
A example website for a 60-90 min Git/GitHub lab. Students will enter a latitude/longitude or drop a pin on a map and see that location's local time and weather there.

The website will allow students to practice working in teams of frontend developers, backend developers, and build masters to fix issues listed in the README and, if time permits, implement a new feature of their choosing.

## Stack
- Node + Express 5 (`src/server.js`), ES modules
- Plain HTML/CSS/JS in `public/` (served by `express.static`)
- Weather data: Open-Meteo (free to use, no API key needed)
- `dotenv` only for `PORT`

## Commands
- `npm start`: run the server at http://localhost:3000
- `npm run dev`: same, restarts on file changes

## Structure
- `src/server.js`: `GET /api/weather?lat=&lon=` proxies Open-Meteo and returns `{ city, temp, condition, description, timezone, isDay }`
- `public/`: everything the browser can see (HTML, CSS, JS, `images/`)

## Branches
- `solution`: the working answer key. Never push it to the student-facing repo.
- `main`: will hold the student starter repo (with planted bugs).

## Coding Standards
- Show me the exact change (code block or diff) and explain why before editing any file. Wait for my OK.
- I sometimes make changes myself (moving files, small edits). Re-read files before editing them.
- Keep changes small and focused. Don't refactor unrelated code.
- No new dependencies (npm or CDN) without asking.
- Keep code simple enough for beginners to read in a 60 min workshop.
- Never put secrets (API keys, `.env` contents) in code, logs, or chat.

## Design direction
- Background will have animated weather (rain, sun, wind) based on the API response and our defined parameters. 
- In landing page, the user will be able to enter a lat/lon or drop a pin on a map. 
- The map will be implemented with Leaflet and OpenStreetMap tiles.
- Weather animations in CSS only (rain, sunny, windy), driven by `data-*` attributes set from the API response.

