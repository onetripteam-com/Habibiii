# MAHA — A Little Escape

**PROMPT A — Opening experience + permanent home room**

A lovingly illustrated, iPhone-first micro-site for Maha. This is the **complete Phase A**: virtual hug, seven-flower bouquet, and a Kuwait-time room. Letters, Music, Mini movies, Travel, Games and Rest are intentionally **coming-soon doors** rather than unfinished or fake functional experiences.

## Running the site

No npm packages, bundler, framework, account or build step needed. Because ES modules and JSON loading use Fetch, **do not double-click `index.html`** / open as `file://`. Serve it over local HTTP:

```bash
# From the project directory
python3 -m http.server 8000
```

Open `http://localhost:8000/` in a browser. For iPhone, publish over HTTPS using the deploy instructions below; on-device offline and Home Screen support require HTTPS. The animations work without GSAP via Web Animations and CSS: the pinned GSAP 3.12.5 CDN script is an optional enhancement, not a functional dependency.

## Deployment: GitHub Pages

1. Create a new **public** GitHub repository for this project (or a separate branch/directory on an existing website); upload the entire **contents** of this folder, including `.nojekyll`, `manifest.json`, and `sw.js`.
2. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main`, set directory to `/ (root)`, then Save.
3. Once Pages finishes, open the HTTPS URL of the form `https://YOUR-USERNAME.github.io/YOUR-REPO/`.
4. Test it once with Wi‑Fi, then enable Airplane Mode and reopen it. Service worker caching should make the site available after its first fully loaded online visit.
5. If you change the project later, update `VERSION` in `sw.js` (e.g. `v1.0.1`), commit, and load the page online once to install the new cache.

**Important privacy reality:** `noindex`, `robots.txt`, and an unlisted URL discourage indexing but **do not make a GitHub Pages website private**. Anyone holding the link can open it. If the content becomes truly personal, add real access controls with a hosting platform rather than trusting `noindex`.

## Deployment: Cloudflare Pages

1. Open Cloudflare dashboard → **Workers & Pages** → **Create application → Pages**.
2. Use **Connect to Git** and choose the new repository. For this plain HTML project, choose **no framework**, leave build command blank, and use repository root as the output directory (or use **Direct Upload** by uploading the extracted folder as website files).
3. Deploy and open the provided `*.pages.dev` HTTPS address.
4. Test Home Screen and offline behavior from that address. Cloudflare Pages needs no server config or SPA rewrite: this is a one-page site and all paths are relative.

## Personalising content

| Edit | File |
| --- | --- |
| Opening dialogue, 12 No replies, hug ending | `content/hug.json` |
| Flower names and witty meanings | `content/flowers.json` |
| Thirty daily messages | `content/today.json` |
| Room door names and temporary lines | `js/doors.js` |
| Kuwait greeting and date logic | `js/time.js` |
| Illustrated flower species, paper, bow, export | `js/botanical.js` |
| Painted layered room | `assets/room-back.svg`, `assets/room-front.svg` |
| Main look, dimensions, reduced-motion handling | `css/style.css` |

JSON must remain valid (escape quotation marks). Flower IDs are keys in the illustration engine; keep the thirteen IDs unchanged unless adding an SVG species. The Malayalam botanical labels rely on a Malayalam-capable system fallback font such as Noto Serif Malayalam or Manjari; no font binaries are bundled.

## Behaviour and local state

- On a first visit, she sees **Hug → Seven Flowers → Room**. The NO responses are each different, in order, and culminate in a silly final send. The YES path completes immediately.
- After picking **exactly seven different flowers**, the selection saves in `localStorage` and appears in the vase. Undo/reset work while picking. Her image downloads as a **960×1200 PNG**.
- Returns skip the opening and enter the room. **Replay the opening** always works and lets her pick a fresh bouquet.
- The Today card selects one of 30 messages based on the current **date in Kuwait**, not her browser timezone. Kuwait-time window lighting and the note automatically advance while the page remains open. Rain/clouds are **illustrative loops, not a live forecast**.
- First-visit flags, flower choices, visit count, last visit, sound choice and one-time installation nudge are kept only in browser storage. If storage is blocked, it falls back to in-memory state (refresh will restart the opening). Visiting in another browser or adding to Home Screen may initially have separate storage depending on iOS version.
- WebAudio makes gentle synthesized ambient tones and small sound effects **only after a user gesture**. The mute choice persists. There are no music files to fetch and no external media licenses.
- No analytics, pixels, analytics SDKs, forms, emails, account records or third-party tracking. The optional GSAP script is requested from cdnjs when online; remove its `<script>` tag in `index.html` if you prefer zero third-party requests. CSS/WAAPI animation remains fully functional.

## Room extension points (later phases; not built now)

Each physical room object maps to an ID: `letters`, `music`, `movies`, `travel`, `games`, `rest`. The object layout and art will not need rebuilding when future scenes are added.

```js
// Example for a *future* feature module (not currently installed):
import { registerDoor } from './doors.js';
registerDoor('letters', ({ close, root }) => {
  // Mount a self-contained letters experience, provide its own close button.
}, { isNew: true });
```

The `isNew` option controls the small glowing dot; placeholder doors do not falsely claim to contain unread content. They currently open accessible, dismissible coming-soon cards.

## Offline implementation

`sw.js` precaches **all required same-origin HTML, CSS, JavaScript, content JSON, illustrations and icons** under a versioned name. The CDN script is not required offline. Navigating offline uses the cached entry page; older versions are deleted on activation. After changing a cacheable file, bump the service worker version. Private browsing, cleared site data, storage pressure or browser settings can remove offline data, so offline persistence isn't guaranteed forever.

## iPhone QA checklist

See `IPHONE-QA.md` for 30 checks, including viewport matrix 360×740, 393×852, 402×874, 440×956; first visit, bouquet export, reinstall, mute, reduced motion and offline.

## Assets to supply next (optional enhancement, not blockers)

- **Art**: 2–3 painted transparent layers matching the room artwork’s 400×780 coordinate system; hand-painted flower heads or textures if you want a more bespoke organic look; keep interactive target positions the same.
- **Audio**: a personal, original or licensed soft loop if preferred over the built-in ambient synth; gentle tape clicks, paper-fold, and radio-tuning sounds. Any audio still requires an initial tap.
- **Copy**: your favourite inside jokes; Maha's favourite flowers; one affectionate natural Malayalam phrase she actually says; a few travel memories to hint at in the room without making a timeline.

**Scope note:** No surgery/health references, no other rooms, no space-themed visuals, no stock-template UI.

## One Room, Many Places (portal architecture)

This release adds seven themed, full-frame portal previews. See `PORTAL-ARCHITECTURE-QA.md` for object mapping, navigation implementation and iPhone QA. Source files: `js/places.js` (independent palettes/art metaphors) and `js/portal.js` (View Transitions with GSAP / Web Animations fallback). The Room stays mounted throughout a portal trip, including its saved bouquet, selected room theme and Kuwait-clock window.

These are intentionally **preview environments** for unbuilt rooms, not completed mini-movies, games, letters or travel features.