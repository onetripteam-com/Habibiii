# PROMPT B — Letter Box: Test and authoring checklist

## Implemented

- Letterbox is a full place through the existing Letters portal, not a room popup.
- Top-level tabs: Inbox, Open When, Keepsakes. The list is stacked paper envelopes, not a card grid.
- Five sample inbox letters: two open immediately; three sealed by 5 visits, 30 Kuwait-calendar days after first visit, and 7 July 2027 respectively.
- Fourteen witty but editable **DRAFT** Open When letters. They contain `[BRACKETS]` for real shared memories.
- Optional quiet letter exists in letters.json and is hidden until `content/config.json` defines a real `quietLetterDate`.
- Typed letters page forward/back with paper-turn animations, P.S., and optional Malayalam line.
- Handwritten letter has an intentionally neutral SVG placeholder, lazy-loaded `images` array, pinch/double-tap/plus/minus zoom, and typed transcription switch.
- Per-letter Keep heart; kept letters appear under Keepsakes. Future Me note stays in localStorage.
- Computed Kuwait calendar date, count of visits, first visit, game flag, and optional quiet-letter unlocking.
- Write back works when `senderEmail` is filled with a valid address in config; until then, shows a configuration hint.
- If lastVisit was at least 30 days ago, a returning shelf appears with unlocks since the previous visit.
- Games CTA goes via the hub to the existing Arcade portal (which remains a placeholder).

## Automated checks

- `npm test` — pure unlock date/day/visits/game/quiet/return tests.
- UI smoke tests at `393x852`, `402x874`, `360x740`: five inbox / two open / three sealed; no open-on-seal; open typed letter; page turn; Keep, Keepsakes; device note; 14 Open When; games CTA; no page errors.
- Browser screenshots examined at 393 wide (Inbox + Reader) and 360 wide (Open When).
- Handwritten, 30-day shelf and quiet-letter config are covered by supplemental test scenarios; a physical iPhone remains necessary for real pinch-zoom testing.

## Physical iPhone Safari checklist

1. Open MAHA → room → letter box. The zoom transition must land in the letter inbox, not the old placeholder.
2. Inbox: two New letters, three Sealed letters. Tapping a seal must not expose its contents. Check countdown/status.
3. Open a new envelope: flap → letter → page. Press Next and Earlier, then ♡ Keep.
4. Go to Keepsakes; check saved letter and type a private Future Me note; refresh, verify it remains.
5. Open When: scroll all 14 drafts. Check readability, line breaks, and screen safe areas.
6. For test builds only, temporarily set a past firstVisitAt and open the handwritten entry. Zoom with two fingers, double tap, use plus/minus and Read as text.
7. In test builds, set quietLetterDate to a chosen day: verify reveal 7 days before and migration after +14 days.
8. Return to room with ← Room, verify the exact room/theme/bouquet and a kept-letter wall stamp.
9. From Inbox, tap 'Take me to the games': Arcade placeholder opens and its back button returns to room.
10. With Reduce Motion enabled, opening and page turning should fade quickly without large movement.

**Privacy:** The packaged sample content contains no authentic personal letters. Never add real handwriting or private memories to the current public Habibiii repository or publicly accessible GitHub Pages URL. See README private deployment guide.