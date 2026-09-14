# FreeScore 🎵

FreeScore is a mobile-first music stand for musicians. It combines discovery, chord practice, transposition, favorites and setlists with an AI arrangement engine.

## What is built
- Responsive mobile-first React + TypeScript UI
- Song/artist/chord search
- Top 100 guitar-song discovery
- AI-generated chord arrangements displayed directly in the reader
- Automatic key, BPM and capo suggestions
- Easy / Standard practice mode
- Guitar chord cards and common chord shapes
- Favorites and setlists stored locally
- Light/dark theme
- PWA foundation
- MusicBrainz metadata foundation
- GitHub Actions deployment workflow

## FreeScore AI
FreeScore sends a song request to `/api/generate`. The server-side function calls the OpenAI Responses API and returns a strict structured arrangement containing the song title, artist, key, BPM, capo and section chord progressions. Structured Outputs are used so the UI receives predictable JSON. OpenAI documents the Responses API and server-side API-key usage in its official developer documentation.

The AI prompt is deliberately designed to create a **practice chord arrangement**, not to reproduce copyrighted lyrics, tabs or sheet music. Copyrighted lyrics are not requested or stored by the AI endpoint.

## AI backend deployment
GitHub Pages can host the React front end but cannot run a private API key securely. The repository therefore includes a Vercel-compatible `api/generate.ts` serverless function.

To activate live AI generation:
1. Import this repository into Vercel.
2. Add an environment variable named `OPENAI_API_KEY` in the Vercel project settings.
3. Deploy the project.
4. The app automatically calls `/api/generate` when hosted on that deployment.

For GitHub Pages, the app gracefully falls back to the built-in FreeScore chord engine if the AI endpoint is unavailable.

## Run locally
```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```

Tests:
```bash
npm test
```

## Legal/content model
FreeScore does **not** redistribute copyrighted lyrics, sheet music or tabs. AI output is presented as a practice arrangement. Public-domain, open-license, user-provided or appropriately licensed material can be added separately.

## GitHub Pages
The repository contains a deployment workflow. Enable **Settings → Pages → GitHub Actions** for the repository.

## Next engineering targets
- Connect a deployed AI backend to the GitHub Pages front end.
- Add authorized audio analysis for user-owned/licensed recordings.
- Add richer chord diagrams and original practice TAB.
- Add real metronome audio and tap tempo.
- Add practice-loop recording and playback.
- Add cloud sync/accounts and shareable setlists.
- Package for iOS/Android after the web experience is stable.
