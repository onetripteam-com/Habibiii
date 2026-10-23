# MAHA · Prompt E — Media & artwork manifest

The Garden and Rest Room both work offline **without any external assets**. Their images and animation are drawn from original JavaScript Canvas 2D/CSS. Rest rain is **synthesized at runtime** using white noise and high/low pass filters; it is not an audio recording, and no external sound is licensed or bundled.

## Files to supply later (optional)

| File path | Use | Suggested duration and encoding | Maximum size | Rights |
| --- | --- | --- | --- | --- |
| `assets/audio/from-me-rest.m4a` | 'Press to hear me' button | 8–20 seconds, AAC-LC, mono, 44.1 kHz, 64–96 kbps | 1 MB | Your own voice and original wording |
| `assets/audio/rest-rain-loop.m4a` | Optional upgrade replacing synthesized rain (not currently used) | 15–30 seconds, AAC-LC, mono, seamless, 44.1 kHz, ~64–96 kbps | 1 MB | Your own recording or properly documented CC0. Track source URL, creator, and licence in a future `assets/audio/CREDITS.md` |

**To enable the voice note:** Put the first file at `assets/audio/from-me-rest.m4a` and set `voice.src` in `content/comfort.json` to `"./assets/audio/from-me-rest.m4a"`. Rewrite `voice.caption` in your voice as the accessible transcript. The player is user-triggered and mutually exclusive with the rain sound.

**Privacy:** MAHA is currently served from a public GitHub Pages site. A personal voice note there becomes publicly downloadable. Move private content to an access-protected site *before* uploading it. A private source repository alone does not protect published assets.

## Original artwork currently generated in code

- `js/garden.js`: botanical serif stems, leaves, five-petal flowers, the five colorways, wither/growth, wallpaper PNG rendered to 1179×2556.
- `js/rest.js`: illustrated arched rainy window, moon, hills, rain trails on glass, lamp and halo, animated breathing orb.

No illustrations are required to run Prompt E. If you later want bespoke artwork, optional replacements would be: one tall arched window frame SVG, one warm table lamp SVG with separate shade/glow layers, five palette-specific botanical flourish illustrations, and a paper grain texture with license record.

## Authoring notes

- Comfort shelf: edit `content/comfort.json`: arrays `shows`, `snacks`, `songs`; placeholder entries are deliberately impersonal.
- Garden dream pins are appended to local `dreamPins` in `store.js`, the same format as Travel's hand-drawn map, with a limit of 25.
- Garden 'Let it go' phrases are **not persisted** anywhere. Users can store a phone wallpaper manually, which will of course include the visible phrase if they export it.
- No remote fonts, cloud APIs, music, ads, or analytics are used by these features.
