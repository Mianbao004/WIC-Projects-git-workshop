# Intro: Git basics and your first merge conflict
Start here! Before fixing any bugs, you'll learn the common Git commands and practice a merge conflict with your team.

---

## Step 1: Set up your team's repo (fork)
Your team works in its **own copy** of this repo, called a **fork**. The Build Master makes it, and everyone else joins it.

**Build Master:**
1. Sign in to GitHub and open the workshop repo.
2. Click **Fork** (top-right) → **Create a new fork**.
3. ⚠️ **Uncheck "Copy the `main` branch only"**, so the `feature/...` branches come too. You'll need them later!
4. Rename your repo to `WIC-ProjectTeam(#)-git-workshop` (or whatever your team wants). You can do this in **Settings → General → Repository name**.
5. Click **Create fork**. You now have `https://github.com/YOUR-USERNAME/WIC-ProjectTeam(#)-git-workshop`.
6. **Turn on Issues:** In your fork, go to **Settings → General → Features** and check **Issues**. (Forks turn them off by default.)
7. **Add your teammates:** **Settings → Collaborators → Add people**, and invite each teammate by their GitHub username. 

**Everyone else:**
1. Accept the invite. Check your email, or go to the Build Master's fork on GitHub.
2. Clone **the Build Master's fork** (not the original repo):
   ```
   git clone https://github.com/BUILD-MASTER-USERNAME/WIC-Projects-git-workshop.git
   cd WIC-Projects-git-workshop
   ```

**Everyone:** finish the rest of **Setup** in [README.md](README.md) (`npm install`, `npm start`).

> ⚠️ **When you open a Pull Request:** GitHub may set the **base repository** to the *original* workshop repo. Change it to **your team's fork** (`BUILD-MASTER-USERNAME/WIC-Projects-git-workshop`), with base branch `main`. Otherwise your PR goes to the wrong place!

### ✋ Checkpoint: raise your hand!
When your whole team is done, **raise your hand** so I can check you off. We'll look for:
- [ ] The Build Master's fork has the `feature/...` branches (click the branch dropdown on GitHub)
- [ ] **Issues** are turned on in the fork
- [ ] Every teammate is a collaborator and has cloned the fork onto their computer
- [ ] Everyone has run `npm install`

---

## Git basics
The commands you'll use today:

| Command | What it does |
|---|---|
| `git status` | Shows what branch you're on and which files changed. **Run it often!** |
| `git branch -a` | Shows all available branches|
| `git switch <branch-name>` | Moves to an existing branch |
| `git switch -c <branch-name>` | Creates a new branch and moves onto it |
| `git checkout <branch-name>` | Older way to switch branches (We won't be using this but recognize this) |
| `git add <file_name>` or `git add .` | Stages a file/all edited files: "include this in my next commit" |
| `git commit -m "enter your message"` | Saves a snapshot of your staged changes, with a message |
| `git push origin <your-branch-name>` | Uploads your branch to GitHub (`-u` is only needed the first time) |
| `git fetch` | Downloads what's new on GitHub, **without** changing your files |
| `git pull` | Downloads what's new **and** merges it into your current branch. AKA, `git fetch` + `git merge` |
| `git merge <other-branch-name>` | Merges the other branch into the one you're on |
| `git log <--oneline>/<--all>` | Shows one line or all history of commits |
| `git diff` | Shows exactly what you changed but haven't committed yet |

**`fetch` vs `pull`:** `fetch` is "checks out the mail", `pull` is "checks out the mail **and** opens it". You would typically use `pull` to get your teammates' merged work onto your computer.

**Resolving a conflict in VS Code:** open the file with the conflict. Above each conflict you'll see clickable options:
**Accept Current Change** | **Accept Incoming Change** | **Accept Both Changes** | **Compare Changes**
- **Current** = what's on your branch, **Incoming** = what you're merging in.
- For `team.txt`, choose **Accept Both Changes** to keep everyone's name.
- Then stage the file (`git add team.txt`) and commit (`git commit -m "Resolve merge conflict"`) to finish the merge.

**Remember, your teammates can't see your changes until you push them to GitHub.** So if you fix a bug, push it so your teammates can pull from it.
---

## Exercise 0: Your first merge conflict (everyone, 10 min)
Before fixing bugs, your whole team will cause, and solve, a merge conflict on purpose.

**Everyone except the Build Master:**
1. Make sure you have the latest `main`:
   ```
   git switch main
   git pull
   ```
2. Make a branch with your name (lowercase, dashes, no spaces):
   ```
   git switch -c yourname/team-intro
   ```
3. Open `team.txt` and replace the existing content with your name, role, and favorite weather.
- Example: Alex - Frontend - thunderstorms

4. Save, then commit and push:
   ```
   git add team.txt
   git commit -m "Add yourname to team roster"
   git push -u origin yourname/team-intro
   ```
5. On GitHub, open a **Pull Request** from your branch into `main`. Double-check that the **base repository** is your team's fork, not the original repo.

**Build Master:**
1. Merge the **first** PR. It merges cleanly. 🎉
2. Open the **next** PR. GitHub says **"This branch has conflicts that must be resolved."** Everyone added a line in the same spot, so Git can't tell whose line goes first.
3. Click **Resolve conflicts**. You'll see something like:
   ```
   <<<<<<< yourname/team-intro
   Sam - Backend - snowy
   =======
   Alex - Frontend - thunderstorms
   >>>>>>> main
   ```
4. **Keep everyone's line:** delete the three marker lines (`<<<<<<<`, `=======`, `>>>>>>>`) so both names remain.
5. Click **Mark as resolved**, then **Commit merge**, then **Merge pull request**.
6. Repeat for each remaining PR.

**Everyone, when it's done:**
Option 1: Pull the latest `main` to your computer and merge into your branch:
```
git switch main
git pull
git switch yourname/team-intro
git merge main
```
Option 2:
```
(on your branch) git pull origin main
```
Open `team.txt`. Every teammate's name should be there!

**Talk about it:** Why did the first PR merge cleanly, but every one after it conflicted?

### ✋ Checkpoint: raise your hand!
When your whole team is done, **raise your hand** so an instructor can check you off. We'll look for:
- [ ] `team.txt` on your fork's `main` has **every** teammate's line, with no `<<<<<<<` markers left
- [ ] Every PR is **merged** (the Pull requests tab shows none open)
- [ ] Everyone has run `git pull` and sees all the names locally
- [ ] Your team can answer the "Talk about it" question

---

**Done?** Head back to [README.md](README.md) and pick your first issue!
