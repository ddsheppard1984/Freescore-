# FreeScore 🎵

FreeScore is a mobile-first music stand for musicians. It combines discovery, chord practice, transposition, favorites and setlists while keeping copyrighted sheet music out of the repository.

## What is built
- Responsive mobile-first React + TypeScript UI
- Song/artist/chord search across the built-in catalog
- Favorites stored locally in the browser
- Setlists stored locally in the browser
- Song reader/practice screen
- Key transposition controls
- Guitar chord cards and common chord shapes
- BPM control
- Practice progression and strumming guidance
- Beginner / Easy mode toggle
- Metronome control surface
- Light/dark theme
- MusicBrainz metadata search service foundation
- PWA manifest
- Vitest test foundation
- GitHub Actions deployment workflow for GitHub Pages

## Legal/content model
FreeScore does **not** redistribute copyrighted sheet music or tabs. It is structured to show metadata and send users to lawful sources. Public-domain material, open-license material, user-provided material, or appropriately licensed content can be added later.

MusicBrainz provides music metadata through its web service; its API supports artist, recording, release and work searches. See the official documentation before commercial use. 

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

## GitHub Pages
The repository contains a deployment workflow. In GitHub, enable **Settings → Pages → GitHub Actions** for the repository. Vite's deployment guidance requires the repository path to be reflected in the app base URL when deploying under a project URL.

## Next engineering targets
- Connect additional public-domain/open-license catalogs.
- Add authorized PDF/notation viewer support.
- Add real metronome audio and tap-tempo.
- Add capo calculator and alternate tuning tools.
- Add richer chord diagrams and tablature rendering.
- Add practice-loop recording and playback.
- Add cloud sync/accounts and shareable setlists.
- Package for iOS/Android after the web experience is stable.
