# The Dad Issue 🎂

A birthday website for Dad, designed as a one-of-a-kind printed magazine made for one reader.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Motion (Framer Motion) · Lenis smooth scroll · canvas-confetti · Web Audio API

## Run it
- **Easiest:** double-click `Start Website.bat`
- **Or in a terminal:** `npm run dev`, then open http://localhost:5173
- Add `?skip` to the URL (e.g. `http://localhost:5173/?skip`) to jump past the envelope while editing.

## Personalise it (everything is in ONE file)
Open **`src/content.ts`**. It holds:
- `music` → the background song (a YouTube video ID, title, artist, start time, volume)
- `dad` → his name, **birthday** (drives the age, the counters, the "Limited edition" sticker and the countdown), your name, and the cover photo
- `letter` → **your message** (one string per paragraph)
- `photos` → the scrapbook wall
- `timeline`, `reasons`, `coupons`, `jokes`, `balloonNotes`, `wishes`, `candleCount`

### Adding pictures
1. Copy the photos into **`public/photos/`** (e.g. `public/photos/beach.jpg`)
2. In `content.ts`, set `src: "/photos/beach.jpg"` (or `coverPhoto: "/photos/..."`)
3. Leave `src` empty to keep the "photo goes here" frame
4. Timeline entries can take a photo too: add `photo: "/photos/..."`

## What's inside
1. **Sealed envelope intro**: break the wax seal, the card slides out, and the background song starts ("Your Universe (Acoustic)" by Rico Blanco, streamed from YouTube, with a small now-playing card)
2. **Magazine cover**: kinetic headline whose weight follows your cursor, a live "seconds of being awesome" counter and a birthday countdown
3. **The Letter**: handwritten words that fill in as you scroll
4. **Scrapbook**: draggable polaroids with shuffle and a lightbox (arrow keys work)
5. **Through the Years**: a pinned timeline that scrolls sideways
6. **By the Numbers**: animated stats computed from his birthday
7. **Reasons deck**: swipe or toss cards
8. **The Cake**: tap the flames or **blow into your microphone** to put them out, then confetti
9. **Joke Machine**: pull the lever, reveal the punchline, hear a rimshot, rate the groan
10. **Scratch-off gift coupons**
11. **Balloon pop**: each balloon holds a hidden note
12. **Wish Wall**: visitors pin sticky-note wishes (saved in that browser)
13. Extras: index rail, sound controls, paper-grain texture, reduced-motion support, and a Konami-code easter egg (↑↑↓↓←→←→BA)

## Live site
https://szae444.github.io/daddys-birthday/

After changing anything (text, photos, music), publish the update with:

```
npm run deploy
```

This builds the site and uploads it to the `gh-pages` branch. GitHub Pages refreshes within a minute or two.
Only the small, location-free photo copies in `src/assets/photos/` are uploaded. Your originals in `Photos/` stay on this computer.

## About the music
- The song streams from YouTube, so the viewer needs an internet connection. Browsers only allow sound after a tap, which is why it starts when the envelope is opened.
- If YouTube can't load, the site automatically switches to a built-in music-box "Happy Birthday".
- The cake's **Sing Happy Birthday** button pauses the song, plays the birthday tune once, then resumes the song.
