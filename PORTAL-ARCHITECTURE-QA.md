# MAHA — One Room, Many Places (Portal System)

## Architecture

The illustrated Room is the **only hub**. `mountRoom()` creates it once; `makePortalSystem()` puts a sibling, full-frame `portal-screen` on top, leaving all room DOM, room theme, date-based daylight, selected seven flowers, and object state untouched. The back control removes the portal and focuses the exact hotspot that launched it.

- `js/places.js`: place registry, tokens, semantic art/interface per destination, little souvenir actions and visit-based lighting rules.
- `js/portal.js`: open/close orchestration, same-document View Transitions, GSAP or Web Animations fallback, reduced-motion fade, scope and focus.
- `js/room.js`: room object hotspots, evidence on the wall, calls into the portal system, cleanup.
- `js/audio.js`: destination-specific ambient chord voicings, always gated behind a user gesture and the saved global mute.
- `css/style.css`: typography, palette, textures, and bespoke destination layouts/entry keyframes.

## Destinations and portal metaphors

| Room hotspot | Destination | Motion / interface |
|---|---|---|
| Letter box and daily note | The Post Office | Paper envelope and flap lifting |
| Radio | Radio Maha | Brass tuning knob spins in |
| Projector | The Little Cinema | Theater curtains pull apart |
| Suitcase | Almost-Anywhere Club | Luggage lid reveals illustrated fold-map |
| Console | Slightly Silly Arcade | Cabinet lands with an arcade bounce |
| Lamp and bed | The Quiet Corner | Lamp and gentle dimmer |
| Potted plant | The Little Greenhouse | Seedling grows up |

Every destination currently has its own **deliberate preview** or “being built” experience; no future full rooms have been invented. They are not the same modal or repeated card layout. All seven hotspots lead to destination screens. First-visit dimmed hotspots still open a styled “this door is early” note; they light up on subsequent visits. Only seen place stamps and explicitly kept travel, post and garden items become room decoration.

## Timing and reduced motion

On supported browsers, `document.startViewTransition()` snapshots a hotspot and its full-frame destination using the same `view-transition-name`. The CSS group animation is 440ms and entry motion 245ms (under 700ms nominal, excluding frame scheduling). Without the API, GSAP (if already loaded) or native Web Animations expands the portal from its actual room object rectangle in 430ms. Reduced Motion uses a ~110ms short transition with no decorative entrance animation. Touch targets are at least 44 CSS px.

These nominal durations are **not a guarantee of 60fps**. Actual smoothness should be checked on a mid-range iPhone in Safari and on Android Chrome; performance depends on device and battery mode.

## Browser checks

- `360×740`: entered and returned from all seven places; room stayed mounted; no JS errors.
- `393×852`: same checks, plus kept-letter and postcard actions; no JS errors.
- `402×874`: same checks; no JS errors.
- `440×956`, Reduce Motion: entered and returned from all seven places; no JS errors.
- Native View Transitions and forced native-disabled fallback: both navigation paths tested.
- Theme switching persists while the same room stays mounted; room date/time behavior is retained.
- Direct navigation through localhost is blocked by the browser sandbox policy in this environment, so the checks loaded the same source code and CSS into a headless Chromium document. A real hosted-website test remains necessary.

## Short physical iPhone Safari QA checklist

1. Open the site and complete the first hug/flowers; note that **only a few objects look lit** on the first room visit.
2. Tap each hotspot: letter box, radio, projector, suitcase, console, lamp, bed and plant. Each should zoom into its own full-screen place, not a room popup.
3. Tap **← Room** in each place; confirm the animation returns to the object you tapped, and the room keeps the selected bouquet and appearance.
4. In Travel, pin a postcard; in Letters, keep a note; in Garden, water the plant. Return and check visible decorations and stamps.
5. Change the room theme and enter/exit several places: the **room theme remains unchanged** and the Kuwait window remains time-based.
6. With sound enabled after a tap, check subtle ambience differences and the mute toggle. Nothing should autoplay on first page load.
7. Enable **Settings → Accessibility → Motion → Reduce Motion**: the trip should be a quick, simple fade.
8. Test 360px / 393px / 402px portrait widths; no back button should collide with the Dynamic Island; no clipped navigation controls, page scrolling or unreachable hotspot.