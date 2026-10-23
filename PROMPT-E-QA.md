# Prompt E QA · Garden and Rest

## Automated results
- Existing project suite: `npm test` (22 tests, all passing before Prompt E).
- Isolated Chromium module gameplay checks at 393×852, 360×740 and 402×874: garden mount, switch prompt, write a destination, save a travel dream pin, let-go clear, garden unmount; rest mount, lamp adjustment, breathing start, comfort tabs, bored-in-bed navigation, rest cleanup. All passed, no browser JS errors.
- HTTP navigation to local test server is blocked in this environment by Chromium (`net::ERR_BLOCKED_BY_ADMINISTRATOR`), so this is not a fully integrated on-device test of the GitHub Pages site or an iOS keyboard test.

## Physical iPhone Safari check (recommended before sharing)
1. Open Room → potted plant. Tap the canvas and type `MAHA`, erase a letter; verify its stem droops for ~700ms. Paste a longer place name and test autocorrect; hit space and Enter.
2. Change among Marigold, Peony, Mint, Saffron, Monsoon. Try `Let it go`; verify the line appears after the last stem withers, and that typed text does not survive reload.
3. Type a dream place, press `Pin in Travel`; enter Travel via the Suitcase and confirm a new dream pin. Reload to confirm only the pin persists.
4. Save wallpaper; confirm dimensions 1179×2556 and the date is Kuwait-local. Confirm iOS keyboard does not scale the page or hide the canvas. Try Rotate/zoom if needed.
5. Open Room → lamp or bed. Slide lamp from 0 to 100 and back. Start rain (only after tapping), change volume, then use the header mute control; no rain should be audible when muted.
6. Start the breathing circle: inhale 4 sec, hold 4 sec, exhale 6 sec. Pause then resume; switch Comfort categories.
7. Tap `Press to hear me`: caption fallback should appear until private audio is added. Tap `Bored in bed?` to enter one randomly selected existing Arcade game directly.
8. Exit from Rest; rain/audio and the breathing loop should stop. Test with iOS Reduce Motion enabled; growth/wither remains discernible and breathing animation minimal.

## Constraints
No claims of verified physical iPhone frame rate. Both modules use local-only state, except optional user-supplied audio/video URLs if configured later. Personal voice notes do not belong on a public GitHub Pages site.
