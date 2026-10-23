# PROMPT C — Arcade Phase 1: QA and authoring guide

## Scope and architecture

The room remains the only home. The existing Games object and the Letter Box's "Take me to the games" link open the full-screen Arcade place through `js/portal.js`; reversing a portal transition returns to the already-mounted room. **Phase 1 includes only Chai Maker, Sadya Builder and Airport Baggage.** The other three cabinet games are intentionally absent until Phase 2.

The arcade shell lives at `js/arcade.js`: a **single center cabinet** with a marquee, left/right arrows, swipe and keyboard arrows, coin-drop animation, Play, per-game pause/restart/mute, results, best score, and passport progress. Each game module lives in `js/games/<id>.js` and exports `start(root, ctx)`, `stop()` and `result()`. Game modules use DOM/CSS and a small `requestAnimationFrame` ticker, no game libraries. Score/rule helpers are in `js/games/rules.js` and `js/games/common.js`.

### Mechanics

- **Chai Maker** — pointer hold to pour milk, let go near 68%; tap to stop boiling near 72%; tap twice to add ginger/cardamom when the indicator meets its marker. Scores all three stages. Pointer-release synthetic clicks are ignored so milk release cannot skip a stage. Ends after stage three or at the 72-second deadline.
- **Sadya Builder** — nine draggable/tappable servings on the banana leaf; place each in the illustrated traditional serving layout. Tap an item then a leaf spot as a full one-thumb alternative. The timer is 76 seconds; nine plates correctly served, or seven of nine with the Done button, earns a stamp. Wrong drops give feedback but are not punitive.
- **Airport Baggage** — pack 8 selectable items onto a 5×6 suitcase grid. Shapes occupy contiguous multi-cell regions, rotation can fit a shape differently; overlaps, edges and the 14 kg weight limit are checked. Tap an item then a grid cell, or drag. The timer is 80 seconds; 5 or more items legally packed earns a stamp. The limit alarm is audible if sound is on and visual always.

Best scores live under `arcadeBest:<id>`, completion flags under `gameCompletions` and `game:<id>:completed`, passport stamps under `passportStamps`, and arcade mute under `arcadeMuted`. All use `store.js` / localStorage. Winning the chai game makes Letters' `{ "type": "game", "id": "chai" }` rule pass. Losing does not mark it complete.

**Sadya accuracy note.** Kerala Tourism's traditional layout has the banana-leaf tip at the diner's left, rice nearer the diner, and vegetable accompaniments across the other half. Exact order differs by region/family. This is one simplified illustrated layout, not a claim about one universal correct ordering. Sambar goes with rice, payasam is a sweet course.

References: [Kerala Tourism — Onasadya](https://www.keralatourism.org/kerala-article/2015/onasadya-kerala/553), [Kerala Tourism — Taste of Sadya](https://www.keralatourism.org/kerala-article/2020/sadya-kerala/1002), [Onmanorama — serving order](https://www.onmanorama.com/food/features/2020/08/28/kerala-onasadya-order-dishes-style.html).

## Exactly which illustrations to generate later

Every game **already works without images**; SVG/CSS artwork is intentionally self-contained. Replace with original commissioned pieces when ready:

1. Three original hand-lettered, transparent arcade marquees: `chai-marquee.webp` ("CHAAYA CHAMPION"), `sadya-marquee.webp` ("SADYA EXPRESS"), `baggage-marquee.webp` ("KWI BAGGAGE"), each approximately 1200×330 px.
2. Chai Maker: transparent isolated ceramic chai cup and saucer, transparent milk stream, tea liquid surface, steam wisps, one ginger root, one cardamom pod, all as individual 2× transparent WebP or SVG assets (6 distinct pieces; steam optional sprite sheet).
3. Sadya Builder: **one** clean banana leaf, tapered tip on the **left** (1400×650 transparent), plus **nine** distinct overhead food art sprites: banana chips, pappadam, mango pickle, pachadi, thoran, avial, red matta rice, sambar bowl/pour, payasam bowl (10 assets total).
4. Airport Baggage: **one** open top-down suitcase frame (1200×1500 transparent) and **eight** transparent overhead item illustrations: jhumkas, shawl, camera, home-snack tin, book, family gift bundle, pressure cooker, coconut (9 assets total).
5. One small brass game coin, faces and rim, optional 8-frame transparent coin rotation strip (either SVG or WebP).

Keep a single painted picture-book aesthetic with a cream/terracotta/sage palette, readable at 360 px, and own or license every asset. Use compressed WebP or optimized SVG; avoid blurry raster text in marquees by keeping alternate live text.

## Automated QA

Run `npm test`: eleven Node tests cover Sadya positions, baggage overlap/weight/rotation, letter game rewards, and prior Kuwait letter-unlock logic. The isolated-browser regression in `tests/ui_isolated.py` uses Playwright, Chromium, and manually composed source to avoid this workspace's blocked HTTP navigation. It runs the full game loop, pause/restart, winning results and local game-completion flags at 393×852, 402×874, and 360×740. This is not a substitute for physical Safari testing.

## Physical iPhone Safari checklist

1. Open room → Games. Swipe left/right and use both arrows; there should be **one** cabinet in the center at any time.
2. Press **Insert Coin & Play**. Hear the coin when audio is enabled, and see its drop. With reduced motion, it should be nearly instant.
3. Chai: hold to pour, release at the mark; tap the boil at the golden mark; tap ginger and cardamom at the beat. Test that release does **not** double-tap to the next stage.
4. Sadya: drag food to a slot, then try tap-then-tap. Open the Tradition Cheat Card. Check leaf tip faces left.
5. Baggage: rotate a piece, overlap another item, try packing the cooker when near 14 kg and check alarm; inspect multi-cell footprint.
6. Use Pause, Resume, Restart and the local sound toggle during all games; leaving the cabinet should stop timers.
7. Win Chai; revisit Letter Box. A letter with game unlock rule `chai` should now open. Check the room passport stamp and that Best scores survive reopening.
8. Test 360×740, 393×852 and 402×874, Safari's address bar expanded/collapsed, Reduced Motion and global mute. Ensure buttons aren't hidden under the home indicator.