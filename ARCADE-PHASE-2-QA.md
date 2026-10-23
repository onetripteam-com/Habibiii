# MAHA — PROMPT C: Arcade Phase 2

Phase 2 adds playable **Decode the Doctor**, **Where in the World**, **Vlog Director** to the Phase 1 Chai, Sadya and Airport Baggage cabinets. The room remains the only home screen.

## Verified in this build
- 18 pure Node rules/unlock tests passed (11 preexisting + 7 new; run the command in README).
- Isolated Chromium gameplay tested at 393×852, 402×874 and 360×740. Each new game played through its winning path, displayed results, awarded the correct local completion flag, and returned to the cabinet selector, with no page errors.
- Pause and Resume used during every new game. Keyboard/touch uses accessible HTML buttons; Vlog also supports pointer dragging.
- Safe-area height now explicitly bounds the full Games portal, so pause/restart buttons stay inside the portrait viewport instead of sitting below the screen.
- 6 cabinets in one carousel, new marquee colors, offline scene art, all existing Phase 1 games remain registered.
- No real medical terms, drug names, doses, or medical advice in the Doctor game.
- No network or video requirement for World or Vlog artwork.

## iPhone Safari quick check
1. Room → game console. Swipe through **six cabinets**, one at a time; both arrows work. Rotate the phone back to portrait if needed.
2. **Decode the Doctor**: open, choose three of the five absurd answers correctly, try Hint once, confirm result and passport stamp. Confirm copy is obviously fictional.
3. **Where in the World**: wait through a six-second moving illustration; three choices then unlock. Try a paid hint and a wrong answer. Complete five clips.
4. **Vlog Director**: tap two cards to swap. Then drag a shot onto another. Arrange **Wide → Walking → Close-up → Food → Sunset**, press Premiere, and let all five × 4-second scenes play. Check opening title and progress bar.
5. **Pause, Resume, Restart, Mute** in each game. Global site mute should also silence arcade chimes.
6. Exit by **‹ Cabinets**, then back to **Room**; the room must not rebuild or lose its flowers/theme.
7. Return to Arcade: new stamps and best scores should remain; refresh and verify again. Existing Chai win must still unlock the matching game-sealed letter.
8. Enable iOS **Settings → Accessibility → Motion → Reduce Motion** and try World and Vlog again. They should be readable without parallax/zooming; World still shows the destinations.
9. On small screens (360×740, 393×852, 402×874) confirm all controls are visible, especially the bottom Pause/Restart row and the first/last storyboard shots.

## Author edits
Edit `/js/games/phase2-rules.js` to replace silly case wording, travel hints/choices and the five storyboard shot labels. Keep Doctor **strictly fictional** and avoid real medical instructions. You may supply original/licensed illustrations in `/assets/` and update each game's `sketch`/`landscape` function to use them; the current generated CSS/SVG artwork is self-contained and fully offline.

## Caveats
- Browser tests were run in an isolated Chromium test harness because local HTTP navigation is blocked in this environment. These are UI/functional checks, not real device performance measurements.
- All three games use synthesized site sound; the same global mute logic applies.
- Vlog preview is an animated storyboard montage, **not** generated real-world video footage.
- Real iPhone Safari and mid-range performance testing are still required before calling this a production-polished release.