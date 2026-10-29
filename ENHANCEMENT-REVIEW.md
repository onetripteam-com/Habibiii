# MAHA — A Home That Remembers Her

29 October 2026. Local review build; no remote pushes or hosting changes.

## Source audit

The current relevant repository is onetripteam-com/Habibiii, main at c5a5c7b (28 October). The separate Maha repository is older: f42b27a (21 October). This build uses Habibiii, whose home source matches the 28 October saved home files. The 27 October ZIP predates that source.

Existing modules provide all seven destinations, thirteen botanical varieties, repeated picks, envelopes and keepsakes, illustrated films and VTT captions, original synthesized radio atmospheres, travel postcards, dream pins, six arcade diversions, canvas word garden and rest controls. Existing storage keys were retained.

## Changes

- Original SVG furnished interior and seven tappable objects; labelled navigation below it.
- Six home settings retain the same furniture and object geography. Preview illustrations have unique gradient IDs.
- Bouquets live on the table; jasmine now has additional petal layers and buds. Assembly waiting time reduced from over five seconds to about two seconds.
- Kept letters, postcards, dream pins and game wins add interactive room traces using existing records. Fixed a discovered postcard/plant hit-area conflict.
- Native scenery and backup dialogs. Background home becomes inert during portal visits; return restores focus to its trigger.
- Mood entry carries its accompanying line into the destination.
- JSON backup export, validation, explicit restore action and attempted rollback on storage failure. Matching records replace; unrelated records remain.
- Separate music/effect level settings. Default sound is off for new visitors; prior preferences are preserved. Ducking survives visibility changes.
- Cinema posters identify built-in illustrated films; no real footage was fabricated.
- Service-worker version bumped; new resources included.
- Storage fallback now reads failed-write memory values consistently.

## Validation performed

44 Node tests passed. These include game rules, letter unlocks/Kuwait date boundaries, content manifests, garden implementation checks and malformed/unsafe backup rejection. Structural source tests are not substitutes for browser checks.

Chrome browser, normal motion:
- Decline opening hug, select seven repeated jasmine flowers, assemble and carry bouquet into room.
- Read and keep a letter; return focus and letter souvenir observed.
- Radio station change.
- Open illustrated cinema, playback control and Malayalam caption cycle.
- Flip and keep Kerala postcard; postcard souvenir observed.
- Launch Tiny Joys, make five picks; arcade souvenir observed after return/reload.
- Garden typing, backspace and Enter clearing.
- Rest breathing start/pause control.
- Scenery picker and persisted setting across navigation/reload.
- Keepsake dialog and actual JSON backup download.
- Responsive home inspected in same-origin iframe viewports at 360×740, 393×852 and 402×874. At 360, measured content width equalled scroll width and all seven object rectangles exceeded 44px in both dimensions. Desktop browser also inspected.
- All 77 service-worker precache paths exist locally.

## Limits and next checks

This is a review build, not a claim of complete production/device verification. No real iPhone Safari, WhatsApp in-app browser, tablet device, WebKit engine, audio listening assessment or OS keyboard was available. Phone views are Chrome iframe viewports, not device emulation. Reduced-motion CSS is present; the complete reduced-motion path was not exercised live. Restore validation is tested; actual restore/file-picker flow and quota rollback need browser/device QA. Not every arcade game was played to completion. No full offline-update lifecycle or systematic network/console audit was completed.

Activities preserve existing durable records; leaving an activity can still reset its transient reader/game position. The home preserves its own DOM and scroll during portal visits. Full resume of every activity is not implemented. Mood entries carry context but do not yet select a dedicated letter or game. Home light is theme-driven; the clock follows Kuwait time, but automatic live time-of-day lighting is not implemented in this replacement home. Sound remains the existing synthesized design; volume changes apply to subsequent central audio voices, while specialized radio/rest sound beds keep their own controls.

Personal additions: real handwriting, voice introductions and optional original travel footage. Existing built-in illustrated films remain usable without those additions. Review dated/sealed letters before gifting; their dates and unlock rules were preserved.

## Run

Serve this folder over HTTP, for example `python3 -m http.server 8000`, and open http://localhost:8000. Opening index.html directly as a file does not support module/content fetching. Run `npm test` for the automated suite.
