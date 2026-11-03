# Kuwait Room — replacement artwork brief

> **Status — integrated 3 November 2026.** The user-approved Kuwait photograph is committed at `assets/rooms/maha-kuwait.webp`. The room scene, scene-picker thumbnail, touch targets, flower overlay and offline cache now reference it. The remaining text documents the original art direction and generation requirements, not pending instructions.

## Goal
Replace the original Kuwait/Story photograph `assets/rooms/maha-living-room.webp` with an equally photorealistic but genuinely **different** interior. It must *not* be a palette-swapped Bangalore/Kerala living room. Give this room the feeling of a private, warm, contemporary Kuwaiti apartment overlooking the Gulf. Preserve tactile, physically plausible destinations (the interactive areas are native parts of the photograph, not floating buttons).

## Production prompt (for image generation)
Create **one premium, photorealistic cinematic interior photograph**. Ultra-wide horizontal aspect 1672:941 (roughly 16:9), minimum 1672 x 941, no visible writing, no watermark, no UI, no captions, no collages or tiling. Camera fixed at approximately eye-level from a cozy corner, wide 24–28 mm interior lens, spacious living room with clean believable geometry, gentle cinematic colour grading, highly realistic material textures and shadows. Atmosphere: a warm, lived-in **contemporary Kuwait City home**, design-led rather than hotel luxury. Architecture distinct from a Kerala house and a Bengaluru bookish apartment: sculptural cream limestone and plaster arches, minimalist walnut and hand-finished brass accents, woven neutral textiles, powder blue and sand accents, softly patterned geometric rug, delicate modern mashrabiya shading details, a dramatic off-centre arch-shaped window with the Arabian Gulf, subtle waterfront and **recognisable Kuwait Towers** in the distant skyline. Dry clear Gulf atmosphere, *no monsoon rain, no vines cascading everywhere, no jungle walls, no generic New York skyline*.

Let the room feel lived in by Maha, not a showroom. A personal but restrained letter desk with sealed envelopes and postcards, a tiny independent vintage radio, small travel postcards and passport tray, a physical plant, a small projector screen, a handheld game device, a suitcase, and an inviting place to rest. Carefully placed Kuwait-specific small objects: a dallah coffee pot and two delicate cups, a subtle sadu-weave textile accent, a small Arabic geometric brass lamp, without religious iconography or stereotyped tourist souvenir overload. The style should resemble editorial architecture photography / an award-quality boutique hospitality photo, not an illustration and not AI-smoothed fantasy.

**Interactive object geography (important):**
- Leftmost x 2–37%: quiet upholstered seating / Rest hotspot
- x 39–57%, upper central: freestanding potted date palm or healthy indoor plant / Garden
- x 87–99%, upper-right: framed projection surface / Cinema
- x 60–86%, upper wall: travel wall with postcards / Travel
- x 67–84%, middle-right: envelopes on a writing desk / Inbox
- x 88–99%, middle-right: independently visible tabletop vintage radio / Radio
- x 60–76%, bottom foreground: small game handheld / Arcade
- **x 50–63%, lower middle**: one attractive low **EMPTY ceramic vase** physically resting on a table. Keep an unobstructed silhouette and dark-enough background behind the vase neck; the website inserts seven selectable live SVG blooms into it. No pre-baked flowers in this vase.

These are *approximate*, and after generation the developer must recalibrate the photo-aligned hotspot coordinates against the actual image. Do not bend objects merely to match a grid: natural perspective wins. Ensure the Kuwait scene is not the same sofa + round wooden coffee table + leafy windows + travel collage arrangement as the other two pictures. Distinct materials, windows and furniture silhouette are essential.

## Negative prompt
cartoon, vector illustration, 3D render appearance, generic generic Instagram aesthetic, over-sharpened HDR, mangled architecture, reversed or duplicated Kuwait Towers, wrong country skyline, palms covering objects, sea visible through opaque walls, all objects crowded together, busy neon, toy room, floating UI, script, captions, illegible text, overdecorated ethnic clichés, vases already filled with flowers, rain, Kerala greenery, Bengaluru terracotta sofa, same living room geometry.

## Deliverable and integration
Export lossless source first. Make a visually checked, web-optimised WebP `assets/rooms/maha-kuwait.webp`, ideally 1672 x 941 at approximately 250–650 KB. Keep the image itself unlabelled. The final image is NOT yet integrated into the app because an actual approved rendered result must be checked before the existing photograph can be replaced. After providing the asset, change the `story` photo source in `js/room-photo-stage.js`, update the `story` preview in `css/three-rooms-and-hug.css`, recalibrate hotspots and the selected bouquet placement, and add the file to `sw.js` so offline use works. Test 360×740, 393×852, 402×874 and desktop widths.

## Optional animation input for Google video generation
If making a video later, start from the exact final approved Kuwait still. Static locked camera, 6–8 seconds seamless loop, slight translucent curtain movement, ambient daylight change and distant Gulf shimmer only. No camera pans, object teleportation, animated text or new objects. Motion must not affect hotspot alignment. Prefer a short muted WebM/MP4 layer optional on capable devices, not an autoplay background required to navigate the page.
