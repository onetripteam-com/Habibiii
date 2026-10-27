# MAHA — A Little Escape · The Director's Cut

Design revision · October 27, 2026

## Creative north star
An illustrated room that accumulates souvenirs, not a home screen full of apps. Every visitor action should feel meaningful, and should return naturally to the same room.

## What this release adds
- Fully redrawn layered bedroom stage, preserving the real Kuwait-local lighting and existing room hotspots.
- Four existing atmospheres given distinct colour grading.
- Softer editorial opening/florist scene typography, tactile objects, readable hover/focus clues, and a first-time room invitation.
- Original code-drawn illustrated cinema scenes and individual travel postcard art; animated with CSS and respecting reduced motion. These are **illustrated motion cards, not recorded video footage**.
- Original, local, interactive, low-level atmospheric synthesis for all five FM stations. No commercial tracks or recorded voices are bundled.
- Realistic copy refresh: twenty letters rewritten without invented shared events, no template brackets; forty daily notes and five radio station introductions; resting-shelf draft replacements.
- Visible room souvenirs driven from her kept letters, postcards, games, gardening and travel dream pins.
- Accessible option to continue the opening without a hug, and a No response that remains a No.
- Cache version bump so existing installed visitors see the new files after reloading online.

## What is intentionally not invented
The user has not provided personal photographs, physical handwriting, voice recordings, privately shared memories, or commercial music rights. The project does **not** fabricate or republish them. The quiet health-related letter remains hidden unless a real date is configured.

## Privacy
GitHub Pages is public. `noindex` is **not** access control. Do not put sensitive stories, real voice notes, medical specifics or private photos in this public repository without consent and access control. Local notes and stamps remain in browser storage.

## Technical scope
- `css/directors-cut.css` layers atop the original stylesheet.
- `js/director.js` is progressive enhancement, observing scene mounts and decorating without owning core game/event logic.
- `js/painted-worlds.js` generates SVG art for cinema and postcards; no network requests.
- `js/fm-atmosphere.js` uses WebAudio only on a user tap, and stops on mute, visibility loss or leaving Radio.
- `assets/room-directors-cut.svg` is the room illustration; original room SVGs are retained as resilience fallback.
- Main functionality remains in original, separately testable modules.

## Final production QA required before giving the site to Maha
- Test full first visit and all seven portals on a *real* iPhone Safari at 360×740, 393×852, 402×874, and landscape.
- Test sound on iOS, with the physical mute switch; test screen reader and Reduce Motion.
- Test every Arcade game through completion, including saving passport stamps.
- Test travel postcard art and stamp updates, and revisiting the room after reopening Safari.
- Test letter opens, timed unlocks, and return navigation.
- Test service worker update and offline refresh.
- Review all private or affectionate text personally before sharing.

## Optional authentic future improvements
Replace the self-aware handwritten draft with a scan of an actual handwritten letter. Add consented original photographs, and real recorded voice notes only behind access controls. The written emotional centre should be human truth, not AI-improvised autobiography.