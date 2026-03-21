# Studio BG — Setup Guide

A full step-by-step guide. No coding experience needed.

---

## What You Need First

1. **Node.js** — Go to https://nodejs.org → click "LTS" → download and install
2. **VS Code** — Go to https://code.visualstudio.com → download and install
3. A terminal (on Mac: search "Terminal", on Windows: search "Command Prompt")

---

## First Time Setup (do this once)

Open your terminal and run these commands one by one:

```bash
# Go into the project folder
cd studio-bg

# Install all dependencies
npm install

# Start the local development server
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

You should see your site running locally.

---

## Making Changes

1. Open the `studio-bg` folder in VS Code
2. Edit any file and save it
3. The browser updates automatically — no need to restart anything

---

## Building for Production (uploading to your hosting)

When you're happy with the site and want to go live:

```bash
npm run build
```

This creates an `out/` folder. Upload **everything inside** `out/` to your cPanel `public_html` folder.

---

## Folder Guide — What Goes Where

| Folder | What it is |
|--------|-----------|
| `app/page.tsx` | The homepage |
| `app/tool/[slug]/page.tsx` | Individual tool pages (SEO) |
| `components/studio/` | The main canvas app |
| `components/controls/` | Sliders, colour pickers etc. |
| `lib/tools.ts` | Add/edit tools here |
| `lib/draw/` | Drawing functions for each tool |
| `public/` | Images, favicon |

---

## Adding Your Ad Code

Search for `{/* AD SLOT */}` in any file — replace the placeholder div with your actual ad tag from Google AdSense or any network.

---

## Adding a New Tool

1. Create `lib/draw/mytool.ts` with the draw function
2. Add it to `lib/tools.ts` with name, slug, description
3. Add default params to `lib/defaults.ts`
4. It appears automatically in the UI — no other changes needed

---

## Deploying to Cloudflare Pages (recommended — free)

1. Push this folder to a GitHub repo
2. Go to https://pages.cloudflare.com
3. Connect your GitHub repo
4. Set build command: `npm run build`
5. Set output directory: `out`
6. Deploy — done, live in 60 seconds

---

## Common Problems

**"npm: command not found"** → Node.js is not installed. Go back to step 1.

**"Module not found"** → Run `npm install` again.

**White screen on hosted site** → Make sure you uploaded the contents of `out/`, not the `out/` folder itself.

**Canvas not rendering** → Check browser console (F12) for errors.
