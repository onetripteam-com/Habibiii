# MAHA — Bouquet Atelier & Room Themes QA

## What changed

- Rebuilt the 13 botanical species and one shared dynamic bouquet compositor.
- Each of seven selected blooms is shown in a staggered florist dome with eucalyptus-style foliage and fine bud sprays. Stems cross toward a binding point rather than hanging in parallel.
- The wrapped bouquet and PNG use the same composition, while the vase version omits gift paper and places the stems behind the glass vase.
- The finished gift remains in view until Maha chooses “Take them in.”
- In the room, tapping the bouquet opens seven-flower selection again without replaying the hug.
- Four persistent appearance choices under **Make it yours**: Little Hideaway, Kerala Rain, Sunlit Sunday, Terracotta Travels.
- Kuwait time and light remain automatic under all four themes. Only the illustrated room style changes.
- Updating the service-worker cache version makes returning visitors fetch the new release.

## iPhone Safari manual QA

1. Open the website and replay the opening if you previously completed it. Confirm the Hug still works.
2. Check the flower counter starts at `0 of 7`. Subtitle and counter should have separate rows at 360×740, 393×852, 402×874, and 440×956.
3. Pick each of seven different flowers. Confirm seven recognizable focal blooms, greenery, a curved stem grip, folded paper, ribbon and “For Maha” tag.
4. Wait at least four seconds before pressing **Take them in**. Check the gift remains on screen.
5. Tap **Save as picture** and verify a readable PNG in iOS Files or Photos, depending on Safari download handling.
6. Enter the room. Check the vase sits on the sill and displays the exact selected flowers, without wrapping paper.
7. Tap the bouquet. Check flower selection restarts at `0 of 7` and the prior vase gift is replaced only after seven new picks.
8. Tap **Make it yours** and try all four choices. Confirm artwork changes and opening/saving the panel works. Relaunch and confirm the chosen theme persists.
9. Check Kuwait clock after a change in time of day; window lighting should still follow Kuwait, not the selected room palette.
10. Turn iPhone **Settings → Accessibility → Motion → Reduce Motion** on. Confirm the site is usable without sliding/pulsing sequences.
11. Test mute/unmute and confirm music doesn't start before a tap.
12. Enable Airplane Mode after first online load and confirm the site works offline. If a Home Screen app already exists, close and reopen once online after deployment so the new service worker activates.

## Automated checks and limitations

JS syntax, SVG XML and 13-species/7-flower rendering have been tested in the local build. We also rendered a reference PNG and composited a vase preview against the original room artwork. The sandbox browser rejects local navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, so responsive interaction and physical Safari behavior have **not** been verified by automation in this session.

## Reference composition principles

The dome and focal flowers, staggered heights, spiraling stems, and ring of foliage follow floral-design principles documented by Iowa State University Extension, Domestika, and florist how-tos. The actual artwork here is bespoke SVG, not a copied photograph.