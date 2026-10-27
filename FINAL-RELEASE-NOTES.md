# MAHA — The Director's Cut · Release Notes

Released 27 October 2026, GitHub Pages. This is the **complete website**, not a template or a source patch.

## What changed
- New layered illustrated bedroom with functioning Kuwait sky, seven real chosen flowers in a vase, and the four original home themes.
- Keepsakes from Letters, Travel, Garden, and Arcade reappear as room souvenirs.
- Four original illustrated cinematic shorts, moving art scenes and poster wall; posters and Travel postcards share original themed artwork. These are animation-driven illustrated stories, **not recorded video clips**.
- Five functioning atmospheric radio frequencies with original sounds generated on-device, after a tap. Mute and leaving Radio stop the sound.
- Twenty personal-feeling letters rewritten without invented shared events or authoring placeholders; forty rotating daily notes and five polished radio introductions.
- An optional hug that can be declined or skipped. Declining never triggers the hug animation.
- Cleaner Travel and Rest interface copy, no dangling promise of media that isn't there, and Nepal as an additional travel postcard destination.
- Offline service-worker cache version updated to `maha-opening-v2.0.1`.

## Quality checks
- `npm test`: **37 passed, 0 failed** (Node tests spanning original game logic, date unlocks, media manifest, garden, sound and new artwork).
- Isolated Chromium scene checks at **360 × 740**, **393 × 852**, **402 × 874**: eight room hotspots, 7-flower vase, clickable theme change, bouquet re-entry and no JavaScript errors.
- Isolated Chromium media checks: cinema poster wall, illustrated fallback player with controls, radio station changes and opt-in sound, Kerala postcard art, and no JavaScript errors.
- SVG art inspected by rendering static previews.

### Important boundaries
The automated browser's network restrictions prevent an end-to-end HTTP/Safari test of this exact deployed site. **Real iPhone Safari validation has not happened**. Please open the deployed site in actual Safari before sharing widely and verify flow, sound, keyboard, transitions and offline reload.

No photographs, real handwritten notes, licensed music, or personal voice recordings have been invented or included. For truly private memories or a voice note, move from public GitHub Pages to access-controlled hosting with consent.

## Quick deployment
Run `npm test`, then upload/commit this entire directory to a repository with GitHub Pages configured. The existing GitHub Actions workflow builds and deploys automatically. If an old service worker is controlling Safari, revisit online and reload to acquire the latest cache.