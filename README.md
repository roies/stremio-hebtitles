# HebTitles — Stremio Hebrew Subtitles Addon

Stremio addon that **automatically fetches English subtitles and translates them to Hebrew** for any movie or series. Optionally fixes subtitle timing using [ffsubsync](https://github.com/smacke/ffsubsync).

> No API key required. Translation is free via Google Translate.

---

## Install (Windows)

**Prerequisites — install these first if you don't have them:**
- [Node.js](https://nodejs.org) (LTS version)
- [Python](https://python.org/downloads) ✔ check "Add to PATH" during install

**Steps:**

1. [Download ZIP](https://github.com/roies/stremio-hebtitles/archive/refs/heads/master.zip) → extract it
2. Double-click **`install.bat`** — installs all dependencies (run once)
3. Double-click **`start.bat`** — starts the server and shows your URL:
   ```
   Add this URL to Stremio: http://192.168.1.X:7000/manifest.json
   ```
4. Open Stremio on any device → **Settings → Add-ons** → paste the URL → **Install**

> Keep `start.bat` running while you watch. The PC must be on the same Wi-Fi as your TV.

---

## What it does

1. Stremio asks for subtitles for whatever you're watching
2. HebTitles fetches English subtitles from OpenSubtitles (set `OPENSUBS_API_KEY` for this)
3. Translates them to Hebrew automatically
4. Delivers the Hebrew `.srt` back to Stremio
5. Results are cached — each subtitle is translated only once

**Bonus:** register the video URL before playing and HebTitles will also fix subtitle timing offset using `ffsubsync`:

```bash
curl -X POST "http://localhost:7000/register?imdbId=tt1234567&videoUrl=http%3A%2F%2Fstream.example.com%2Fvideo.mkv"
```

---

## Direct endpoint

Translate any subtitle URL on demand:

```
GET http://localhost:7000/sync.srt?subUrl=https%3A%2F%2Fexample.com%2Fsub.srt
```

Optional params: `videoUrl` (for timing sync), `lang` (default: `he`).

---

## Environment variables

| Variable           | Default | Description                                      |
|--------------------|---------|--------------------------------------------------|
| `PORT`             | `7000`  | HTTP port                                        |
| `BASE_URL`         | auto    | Public URL if running behind a proxy             |
| `TARGET_LANG`      | `he`    | Translation target (`he` = Hebrew)               |
| `OPENSUBS_API_KEY` | —       | Free API key from [opensubtitles.com](https://www.opensubtitles.com) |

---

## Tests

```bash
npm test   # 22 tests, all mocked — no network or video files needed
```


