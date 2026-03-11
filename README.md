# FitForge — Deployment Guide

## What You Have

```
fitforge/
├── public/
│   ├── index.html      ← Main app page
│   ├── style.css       ← All styles
│   ├── data.js         ← Workout data, exercises, food presets
│   ├── app.js          ← App logic, rendering, cloud sync
│   └── manifest.json   ← PWA manifest (install as app on phone)
├── package.json        ← Project config
├── vercel.json         ← Vercel deployment config
└── README.md           ← This file
```

## How Data Sync Works

- Uses **JSONBin.io** free tier (no signup needed)
- On first visit, creates a cloud storage bin automatically
- Your unique data ID is stored in the URL hash: `yoursite.vercel.app/#bin-abc123`
- **Bookmark that URL** or copy it from Profile → Copy Sync URL
- Open the same URL on ANY device/browser to access your data
- Also saves locally as fallback if cloud is temporarily unavailable

---

## Deploy to Vercel (FREE) — Step by Step

### Option A: Deploy via GitHub (Recommended)

1. **Create a GitHub account** (if you don't have one): https://github.com/signup

2. **Create a new repository:**
   - Go to https://github.com/new
   - Name it `fitforge`
   - Keep it Public or Private (either works)
   - Click "Create repository"

3. **Upload files to GitHub:**
   - On the repository page, click "uploading an existing file"
   - Drag ALL files and folders from the `fitforge` folder
   - Make sure the folder structure is preserved:
     - `public/index.html`, `public/style.css`, etc. should be inside a `public` folder
     - `package.json`, `vercel.json` should be at the root
   - Click "Commit changes"

4. **Connect to Vercel:**
   - Go to https://vercel.com and sign up with your GitHub account
   - Click "Add New → Project"
   - Select your `fitforge` repository
   - Vercel auto-detects the settings from `vercel.json`
   - Click "Deploy"
   - Wait 30-60 seconds — done!

5. **Your app is live at:** `https://fitforge-yourusername.vercel.app`

### Option B: Deploy via Vercel CLI (Terminal)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the project:
   ```bash
   cd fitforge
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Log in (it opens a browser)
   - Set up and deploy: Y
   - Scope: your account
   - Link to existing project: N
   - Project name: fitforge
   - Directory: ./
   - Auto-detected settings: Y

5. Your app URL appears in the terminal.

### Option C: Deploy via Vercel Dashboard (No GitHub)

1. Go to https://vercel.com/new
2. At the bottom, find "Import Third-Party Git Repository" or use the drag-and-drop
3. Or: Install Vercel CLI and run `vercel` in the project folder

---

## After Deployment

### First Visit
1. Open your Vercel URL on your phone
2. The app creates a cloud data bin automatically
3. Your URL changes to include `#bin-xxxxx`
4. **BOOKMARK THIS URL** — it's your data key

### Access From Another Device
1. Go to Profile tab → Copy Sync URL
2. Open that exact URL on your other device
3. All your data syncs instantly

### Install as Phone App (PWA)
- **iPhone:** Open in Safari → Tap Share → "Add to Home Screen"
- **Android:** Open in Chrome → Tap menu (⋮) → "Add to Home Screen"
- It will look and feel like a native app

---

## Alternative Free Hosting Options

### Netlify (also free)
1. Go to https://app.netlify.com/drop
2. Drag the `public` folder onto the page
3. Done — instant URL

### GitHub Pages (also free)
1. Push to GitHub (see above)
2. Go to repo Settings → Pages
3. Source: Deploy from a branch → main → /public
4. Save — live in 1-2 minutes

### Cloudflare Pages (also free)
1. Go to https://pages.cloudflare.com
2. Connect GitHub repo
3. Build output directory: `public`
4. Deploy

---

## Customization

### Change Your Name
Go to Profile tab and type your name.

### Your Schedule
The plan starts March 10, 2026:
- **Tuesday:** Upper Body A
- **Wednesday:** Lower Body A
- **Thursday:** Mobility & Recovery
- **Friday:** Upper Body B
- **Saturday:** Lower Body B
- **Sunday:** Active Recovery
- **Monday:** Full Rest

### Add More Quick Foods
Edit `data.js` → find `QUICK_FOODS` array → add entries like:
```javascript
{ name:"Your Food", calories:300, protein:20, carbs:40, fat:10, type:'healthy' },
```
Types: `healthy`, `protein`, `snack`, `junk`, `drink`, `supplement`
