# Prompt D — QA and iPhone checklist

## What is implemented

1. Projector: four JSON-driven movies, hand-drawn poster wall, curtain-opening transition, custom play/pause, time readout and scrubber, UTF-8 `.en.vtt` and `.ml.vtt` caption switch, `Picture-in-Picture` disabled on the video element, fullscreen with iOS CSS fallback, 30–45-second timed painted footage if no clip is supplied, and an Episode 1 checklist after the fake trailer.
2. HABIBII FM: five stations, swipe or arrow/range tuning, original synthesized radio static, caption for each optional voice note, AAC support on user tap, Spotify/YouTube external links (disabled until configured), no copyrighted songs bundled, shared single-media control with iOS gesture restrictions honored.
3. Suitcase: inline SVG illustrated world atlas (no external map APIs), six starting location pins and six empty configurable destinations, stone/wood gate animations, flip postcards and video-or-painted fallback, personal vlog prompts, locally stored dream pins with notes, persisted postcard stamps and Arcade stamps in passport.
4. Portal integration: `portal.js` mounts/unmounts each destination and returns to the same living room; on return the room evidence is refreshed.

## Automated verification

- `npm test`: 22 passing Node tests, including previous phases and 4 Prompt-D content/timeline tests.
- `node --check`: cinema, radio, travel, media arbiter, portal and audio scripts passed.
- Isolated Chromium rendering and interaction: 360x740, 393x852, 402x874, all three destinations. Film selection/play/pause/seek/subtitle/trailer checklist; radio station switch via button and slider; travel postcard gate/flip/keep/passport and one custom dream pin. No page JS errors.
- The local browser prevents direct navigation to `file://` or localhost via `ERR_BLOCKED_BY_ADMINISTRATOR`. Isolated module UI tests do **not** establish full end-to-end Pages performance, native audio behavior or physical iPhone Safari support.

## iPhone Safari test

1. From the room tap projector, radio, suitcase; check arrival and back-to-room transitions. The room should not be re-created.
2. Cinema: tap all four posters; play, pause and scrub; cycle **CC EN → മലയാളം → OFF**; enter fullscreen, exit; try the trailer's Episode 1 checklist.
3. Try a film before any video has been installed. The painted title-card timeline and subtitles must work without 404s for missing media.
4. Radio: swipe the radio or tap the dial arrows. Confirm static isn't loud or harsh; turn device mute on/off. Empty external link buttons must be disabled, not send her to an invented playlist. After you supply AAC voice files, verify tap-to-play on actual Safari.
5. Travel: open Kerala and Kuwait postcards, flip, keep; open Passport and see each stamp. Add a dream pin with a note, reload, confirm it remains. Play an optional uploaded clip only if configured.
6. Accessibility: 44-point touch targets, voiceover labels, Reduce Motion; verify no horizontal scrolling or controls below the safe area.
7. Global mute and single-media: start a recorded intro, switch stations; no overlapping voices. Open Cinema/Travel afterward; prior audio should stop.
8. Return to the room and check postcard wall evidence; check previously collected arcade passport stamps remain.

## Cautions

- Place pins on the atlas are approximate illustrative positions, not precise cartography or route planning.
- Exactly six starter travel locations are enabled; the six additional place slots intentionally remain placeholders for you to complete.
- **No real clips, images, voice recordings or playlist links were supplied or bundled.** Follow `MEDIA-MANIFEST.md` for exact paths and license guidance.
- GitHub Pages is public. Do not publish private recorded memories or personal material without access controls on the deployed site.
