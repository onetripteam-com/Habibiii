# MAHA — iPhone acceptance checklist (PROMPT A)

Run on **Safari on a physical iPhone** whenever possible, then Chrome Android and a desktop browser. Safari dev tools / responsive simulators don't perfectly reproduce iOS safe areas or home-screen storage.

## Device and layout

- [ ] At **393×852** (iPhone 16), intro text, both hug buttons, thirteen-flower scroll rail and room all fit without page scrolling.
- [ ] At **402×874** (16 Pro / 17), no clipping at Dynamic Island or home indicator.
- [ ] At **440×956** (Pro Max), art and touch areas scale naturally, no giant blank section.
- [ ] At **360×740**, the buttons remain at least 44px high and don't overlap content.
- [ ] Rotate iPhone and return to portrait; room remains usable. Desktop displays centered phone mockup.
- [ ] Zoom/pinch is allowed in browser (no disabled user scaling); the room itself does not accidentally select labels or pull-refresh.

## Hug

- [ ] In a clean browser, three opening lines appear in order; YES is available in the thumb zone.
- [ ] Tap **No** 12 times: each of the 12 distinct dry replies appears once, no repeating and no shaming.
- [ ] Tap **No** a 13th time: receive the final “Hug sent anyway. No refunds.” line.
- [ ] In a clean browser (or via replay), tap **Yes**: get hug animation and “Receiving... received. Handle with care.”
- [ ] Both paths end in “Okay, wait. Take these flowers first.” and proceed into the flower scene.

## Flowers

- [ ] Horizontally swipe through **all thirteen flowers**, including Jasmine (മുല്ല) and Hibiscus (ചെമ്പരത്തി). Labels remain legible.
- [ ] Select three: counter shows **3 of 7**, the arrangement includes those three, selected items cannot be picked twice.
- [ ] Undo one pick; Reset to zero; choose a different sequence.
- [ ] Exactly **seven** selections trigger the paper-fold, bow, handwritten “For Maha” tag and petals; eighth pick impossible.
- [ ] Tap **Save as picture**; confirm a PNG file (960×1200) with the exact seven species and tag. On Safari, check Downloads/Files; if Safari opens the picture instead, long-press and save it.
- [ ] Tap **Take them inside**; bouquet slides toward window and appears in vase with the correct species.

## Room and memory

- [ ] Kuwait time and daypart are correct even when the iPhone is set to India time or another timezone. Weather is decorative, not actual weather.
- [ ] Tap the **radio, letter box, projector, suitcase, controller, lamp and bed**; each produces the matching coming-soon card and the close button works.
- [ ] Today card shows one of the 30 lines, changing on a new Kuwait calendar day. Replay opening is discoverable.
- [ ] Close and return to the site: **skip Hug/Flowers**, retained vase, appropriate welcome-back wording.
- [ ] On the **second visit on iPhone Safari** (outside standalone mode), see the one-time **Add to Home Screen** nudge; close it, check it doesn't reappear.
- [ ] In Safari, choose **Share → Add to Home Screen → Open as Web App (if offered) → Add**, then launch from the icon; no browser bars in standalone mode.
- [ ] Open online once to let the service worker install, disconnect network, reopen: core page, interactions, sounds, illustrations and flower choices still work (subject to device storage persistence).

## Accessibility, audio and health of the build

- [ ] **No sound before first user gesture**. Then ambient tones and tap notes play quietly; mute button works and remembers choice.
- [ ] With **Settings → Accessibility → Motion → Reduce Motion** enabled, there is no drifting/looping motion, but all text, bow, flower choices and controls remain visible.
- [ ] VoiceOver can reach controls by meaningful labels; focus does not get lost when a modal opens. Close with button; on desktop Escape also works.
- [ ] Check Safari console for JS errors; test normal/low battery and brief network interruption. Phone remains responsive while interacting.

## Editing QA

- [ ] Modify an editable line in `content/today.json`, ensure JSON stays valid, increase `VERSION` in `sw.js`, deploy and refresh once while online.
- [ ] No trackers, external requests other than optional GSAP pinned cdnjs; `robots.txt`/noindex are present but **do not enforce private access**.
