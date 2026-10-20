# Step Into the Weather 🌦️
Starter code for WIC Projects' Git/GitHub workshop.

Drop a pin anywhere on the map (or type a latitude and longitude) and "step into" that place: see its local time, temperature, and weather, with the background animating to match.

**But it's broken!** Your team's job is to find and fix the bugs using Git and GitHub like a real dev team.

> **New to Git? Start with [INTRO.md](INTRO.md)**: it covers the common commands and a warm-up merge conflict exercise.

---

## Setup
1. Clone **your team's fork** (see [INTRO.md](INTRO.md) Step 1), then move into it:
   ```
   git clone https://github.com/BUILD-MASTER-USERNAME/YOUR-TEAM-REPO.git
   cd YOUR-TEAM-REPO
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the app:
   ```
   npm start
   ```

   To restart the server, on the terminal, run `Ctrl+C` to stop it, then `npm start` again.
   > If this fails, don't panic: that's the **Build Master's** first issue. Tell them! Read your own issue while they fix it.
4. Open http://localhost:3000

---

## Team roles
Each team has 3 to 5 people:

| Role | You own | Your job |
|---|---|---|
| **Frontend developer** | `public/` (HTML, CSS, JS) | What the user sees and clicks |
| **Backend developer** | `src/server.js` | The API that fetches the weather |
| **Build Master** | `package.json`, project files, `main` | Keeps the project running and merges everyone's work |
| **Project Manager** | GitHub Issues and labels | Creates and labels the issues, tracks who's working on what, and reviews PRs. *(Team of 3? The Build Master does this too.)* |

---

## How we use GitHub Issues
Every bug is a **GitHub Issue** in the repo's **Issues** tab.

> **Build Master and Project Manager, do this first:** Forks start with no Issues, so set them up together.
> 1. **Create the labels:** In your fork's **Issues** tab, click **Labels → New label** and make `frontend`, `backend`, and `build master`.
> 2. **Create the issues:** Click **Issues tab --> New issue** and make one issue for each item in [Issues](#issues-split-amongst-your-group-but-feel-free-to-help-each-other-and-ask-for-help) below. Copy its title and "What you see", and add its label.
>
> **Tip:** split the list so you're both creating issues at the same time!

1. **Pick an issue** with your role's label (`frontend`, `backend`, `build master`).
2. **Assign yourself:** open the issue, click **Assignees** on the right, and choose yourself. Now your team knows who's on it.
3. **Make a new branch for each issue**, starting from the latest `main`. Use your name and a short description (lowercase, dashes, no spaces):
   ```
   git switch main
   git pull
   git switch -c gloria/hidden-map
   ```
4. **Fix the bug, then commit and push:**
   ```
   git add public/style.css    # add only the files you changed
   git commit -m "Fixes #3: show the hidden map"    # closes issue #3 once merged into main
   git push -u origin gloria/hidden-map
   ```
   (`git add .` adds **every** changed file at once. Run `git status` first to make sure that's what you want.)
5. **Open a Pull Request** and write `Fixes #3` in the description to auto-close the issue. Ask a teammate or the Build Master to review it on GitHub, in the PR's **Files changed** tab.
6. The **Build Master merges** it into `main`, and GitHub **closes Issue #3 automatically**.

> ⚠️ **Use the number GitHub gives your issue**, not the "BUG #" in this README. GitHub counts issues and Pull Requests together, so after Exercise 0's PRs, the map bug might be issue **#6** on GitHub. Check the number next to the issue title.

**Found a new bug?** Click **New issue** and describe **what happened**, **what you expected**, and **the steps to make it happen again**. Writing a clear bug report is a real skill!

---

## How to use Inspect (DevTools)
Your best debugging tool is already in your browser.

1. Right-click anything on the page → **Inspect** (or `Cmd+Option+I` on Mac, `F12` on Windows)
2. **Elements**: The page's HTML. Click an element to see its CSS in the **Styles** panel
3. **Console**: Run JavaScript and see error messages (in red). This is where you can debug and write print statements like `console.log(...)` to see what your code is doing.
4. **Network**: See every request the page makes. 
5. **Dimensions**: See how the page looks on phones and tablets. First turn on the **device toolbar**: click the phone/tablet icon at the top-left of DevTools (or press `Cmd+Shift+M` on Mac, `Ctrl+Shift+M` on Windows). Then pick a device from the **Dimensions** dropdown at the top of the page.

**Tip:** You can test any weather to test the animations. Type this in the **Console**:
```js
document.body.dataset.condition = 'rain';   
// try: sunny, clouds, drizzle, rain, thunderstorm, light snow, snow
```
**To close Inspect**, press the same keys again:
- Windows / Linux: `F12` or `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

---

## Issues: Split amongst your group! But feel free to help each other and ask for help!

### 🛠️ Build Master
You keep the project running and you **merge everyone's Pull Requests** into `main`.

#### BUG #1: `npm start` crashes
**What you see:** running `npm start` shows `Error: Cannot find module` and the app doesn't start.

**Questions to ask yourself:**
- What command does `npm start` actually run?
- Which file is it trying to run? Does that file exist at that path?

<details><summary>Hint 1:</summary> 

Open `package.json` and look at `"scripts"`. Then look at the project's folders: where does `server.js` actually live?
</details>

<details><summary>Hint 2:</summary> 

The path in the `start` script must match where the file really is, folder included.
</details>

**Check your fix:** `npm start` should print `Weather app running at http://localhost:3000`. **Tell your team, since they're waiting on you!**

---
#### BUG #2: The favicon (tab icon) doesn't show
**What you see:** The browser tab shows a blank or default icon instead of the app's icon.

**Questions to ask yourself:**
- Where does the index.html file say the icon is?
- Can the browser actually reach that file? Which folder does the server share with the browser?

<details><summary>Hint 1:</summary> 

Open **Network**, refresh, and look for a red `favicon` request. What status code does it get? What does it mean?
</details>

<details><summary>Hint 2:</summary> 

Look at the `express.static(...)` line in `src/server.js`. The server only shares files from **one** folder. Is the `images` folder inside it?
</details>

**Check your fix:** hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`). The icon should appear in the tab.

---
### 🎨 Frontend developer

#### BUG #3: The map disappeared
**What you see:** There's no map! The form shows up right under the title.

**Questions to ask yourself:**
- Is the map element on the page at all, or is it there but invisible?
- If it's in the HTML, what CSS could be hiding it?

<details><summary>Hint 1:</summary>

Right-click the page → **Inspect**. In the Elements panel, find `<div id="map">`. Notice it looks greyed out?
</details>

<details><summary>Hint 2:</summary>

Click `<div id="map">` and look at the `#map` rule in the **Styles** panel. Which property tells the browser not to show it at all?
</details>

**Check your fix:** refresh the page. The map should show up.

---

#### BUG #4: Thunderstorms don't look stormy
**What you see:** drizzle and rain have falling drops and dark skies, but a thunderstorm has no rain, no lightning, and the default purple background.

Test it in the Console:
```js
document.body.dataset.condition = 'thunderstorm';
```

**Questions to ask yourself:**
- What value does `<body>` have for `data-condition` right now?
- Which CSS rules are supposed to match that value?
- Why do `drizzle` and `rain` work, but not this one?

<details><summary>Hint 1:</summary>

Inspect `<body>` and look at its `data-condition` attribute. Then look at the **Styles** panel: are any thunderstorm rules listed?
</details>

<details><summary>Hint 2:</summary>

Search `public/style.css` for "thunder". Compare each match letter by letter with the value in `<body>`. CSS selectors must match **exactly**.
</details>

**Check your fix:** refresh, run the Console command again, and you should see heavy rain and lightning flashes.

---

#### BUG #5: Tokyo gives an error
**What you see:** pressing **Go!** with the default coordinates (Tokyo: latitude `35.68`, longitude `139.69`) shows *"lat must be between -90 and 90..."*.

**Questions to ask yourself:**
- What latitude did the page *actually* send to the server?
- Is `139.69` a valid latitude? (Latitude only goes from -90 to 90.)
- Where in the code is the request URL built?

<details><summary>Hint 1:</summary>

Open the **Network** tab, press Go!, and click the red `weather?...` request. Read the URL closely.
</details>

<details><summary>Hint 2:</summary>

In `public/app.js`, find the line with `/api/weather?`. Which variable goes after `lat=`, and which after `lon=`?
</details>

**Check your fix:** press Go!. You should see Tokyo's weather in a card above the pin.

---

### ⚙️ Backend developer
> **Tip:** until the frontend's "Tokyo gives an error" issue is fixed, test the API directly in your browser:
> http://localhost:3000/api/weather?lat=35.68&lon=139.69

#### BUG #6: The temperature shows NaN°C
**What you see:** the weather card says `NaN°C`.

**Questions to ask yourself:**
- Does the server's response include a temperature at all?
- What does `NaN` mean, and what kind of value would produce it?
- What name does Open-Meteo use for the temperature field?

<details><summary>Hint 1:</summary>

Open the API URL above (or Network → the `weather?...` request → **Response**). Is there a `temp` field?
</details>

<details><summary>Hint 2:</summary>

In `src/server.js`, look at `toWeather()`. Compare the field it reads for `temp` with the field name requested in `current: '...'` near the top of the route.
</details>

**Check your fix:** restart the server (`Ctrl+C`, then `npm start`). The card should show a real temperature.

---

#### BUG #7: The weather description is blank
**What you see:** the card shows the city, clock, and temperature, but the line underneath (like "rain" or "sunny") is empty.

**Questions to ask yourself:**
- Is the description in the server's response?
- What field name does the server send? What field name does the frontend read?

<details><summary>Hint 1:</summary>

Look at the JSON response. Find the field that contains a weather word like "clouds". Read its name letter by letter.
</details>

<details><summary>Hint 2:</summary>

The frontend (`public/app.js`) reads `weather.description`. In `src/server.js`, find `describeWeatherCode()` and check what it returns. The frontend and backend must agree on field names **exactly**.
</details>

**Check your fix:** restart the server. The description should appear on the card.

---

#### Feature: add a health check endpoint
Real servers have a simple URL that says "I'm alive" so other tools can check on them.

**Goal:** visiting http://localhost:3000/api/health should show:
```json
{ "status": "ok" }
```

**Questions to ask yourself:**
- How is the existing `/api/weather` route written? Which parts would you copy?
- Does this route need to call Open-Meteo?

<details><summary>Hint 1:</summary>

Copy the shape of `app.get('/api/weather', ...)` in `src/server.js`. Your route doesn't need `async`: it can respond right away with `res.json({ ... })`.
</details>

---


## Stretch goals
Finished early? Pick and add a new feature, open issues for it, and build it!
(Examples:)
- [frontend] Show a night-time background between sunset and sunrise (the API already sends `isDay`)
- [frontend] Add a fog style
- [backend] Add the "feels like" temperature (`apparent_temperature` from Open-Meteo)
