# Prompt D — Media manifest and authoring guide

**This build ships no copyrighted music, private recordings, photos or footage.** Every frame and static sound fallback is original code-generated artwork or a synthesized tone. Media fields are `null` until you supply assets. Malayalam subtitle samples are editable starter captions, not voice transcriptions.

## Encoding rules
- Film clips: MP4, **H.264**, 720 × 1280 portrait (or 1280 × 720 landscape), 24/30 fps, AAC if there is original recorded speech; **each final film under 3 MB**. Use `ffmpeg -i source.mov -vf "scale=720:-2" -r 24 -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart output.mp4` and verify final dimensions and size. For strict 3 MB films you may need higher CRF and slower motion; visual bitrate budget about 450–650 kbps depending on duration. No real music unless cleared.
- Voice notes: **AAC in M4A**, mono 44.1 kHz/64 kbps, maximum 12 seconds and **under 1 MB**. Voice is optional; the written caption always works. Ambient audio optional AAC in M4A 48–96 kbps, mono, **under 1 MB** per loop and must be your recording or CC0/licensed for redistribution.
- Poster and postcard stills: `.webp` (or `.jpg` if necessary), 720 px long side, **under 180 KB per file**; edits with a slow Ken Burns move are easier if the original image has safe crop margins. Text should be in HTML, not baked into pictures.
- Subtitle files: UTF-8 WebVTT `.vtt` with English and Malayalam in separate files, cues timed in seconds. Ship both even when there is no speech.
- Keep URLs within `./assets/` and do not include an inaccessible file in JSON; `null` is the painted fallback. Film fallback plays by itself offline.

## 1. Mini Cinema — four finished clips
Each final video is optional. Film scenes, posters, and EN/ML subtitle files already work without a clip. These output filenames are **exact**. Fill `films[i].video` with the path after adding the file.

| Film | Final 720p H.264 MP4 to supply | Duration | Maximum | Subtitle files included |
|---|---|---:|---:|---|
| Kerala, Slowly | `assets/video/kerala.mp4` | 36 s | <3 MB | `kerala.en.vtt`, `kerala.ml.vtt` |
| A Day in Kuwait | `assets/video/kuwait.mp4` | 35 s | <3 MB | `kuwait.en.vtt`, `kuwait.ml.vtt` |
| Places You'll Go | `assets/video/places.mp4` | 42 s | <3 MB | `places.en.vtt`, `places.ml.vtt` |
| Trailer: Maha's Travel Channel | `assets/video/trailer.mp4` | 33 s | <3 MB | `trailer.en.vtt`, `trailer.ml.vtt` |

### Optional film stills (22 images)
Optional: set `shots[i].still` in `content/movies.json` to the following exact filename, after supplying the picture. Any unspecified shot remains animated painted SVG/CSS. Each still <180 KB at 720 px long side.

| Film | Still filenames and on-screen duration |
|---|---|
| Kerala, Slowly | `assets/stills/kerala-01.webp` (7 s), `assets/stills/kerala-02.webp` (7 s), `assets/stills/kerala-03.webp` (8 s), `assets/stills/kerala-04.webp` (7 s), `assets/stills/kerala-05.webp` (7 s) |
| A Day in Kuwait | `assets/stills/kuwait-01.webp` (7 s), `assets/stills/kuwait-02.webp` (7 s), `assets/stills/kuwait-03.webp` (7 s), `assets/stills/kuwait-04.webp` (7 s), `assets/stills/kuwait-05.webp` (7 s) |
| Places You'll Go | `assets/stills/places-01.webp` (7 s), `assets/stills/places-02.webp` (7 s), `assets/stills/places-03.webp` (7 s), `assets/stills/places-04.webp` (7 s), `assets/stills/places-05.webp` (7 s), `assets/stills/places-06.webp` (7 s) |
| Trailer: Maha's Travel Channel | `assets/stills/trailer-01.webp` (5 s), `assets/stills/trailer-02.webp` (6 s), `assets/stills/trailer-03.webp` (6 s), `assets/stills/trailer-04.webp` (6 s), `assets/stills/trailer-05.webp` (5 s), `assets/stills/trailer-06.webp` (5 s) |

**Editorial structure:** keep each film to 30–45 seconds. Start with a scene-setting wide shot, alternate mid and detail shots, allow a pause, then finish with a memorable moment. Use 5–7 s shots; cut on visual movement, not rapid flashy transitions. Slow zoom ≤8–12% and pan ≤3% (Ken Burns), crop safe for portrait, avoid covering captions. Final trailer is intentionally fake: title cards, mock credits, and a gentle Episode 1 checklist (no real video required).

## 2. HABIBII FM — 5 self-recorded voice notes + 5 optional licensed ambient loops
Each station needs **two external links** (Spotify and YouTube playlist URLs) placed in `content/radio.json` after you create them. No stream or embed is provided inside MAHA. The caption is displayed even when no audio exists.

| Station | Voice file (≤12 sec, <1 MB) | Optional ambient file (<1 MB) | Links to provide |
|---|---|---|---|
| Rain Day | `assets/audio/rain-intro.m4a` | `assets/audio/rain-ambient.m4a` | `spotify`, `youtube` |
| Road Trip | `assets/audio/road-intro.m4a` | `assets/audio/road-ambient.m4a` | `spotify`, `youtube` |
| Malayalam Comfort | `assets/audio/malayalam-intro.m4a` | `assets/audio/malayalam-ambient.m4a` | `spotify`, `youtube` |
| Morning Chai | `assets/audio/chai-intro.m4a` | `assets/audio/chai-ambient.m4a` | `spotify`, `youtube` |
| Late Night | `assets/audio/night-intro.m4a` | `assets/audio/night-ambient.m4a` | `spotify`, `youtube` |

**Licenses:** All generated radio static, UI chimes and synthesized room pads: original procedural Web Audio (no third-party license). Audio supplied by the user: retain your own rights or document a redistribution-friendly license and attribution if required. External Spotify/YouTube links point out to third-party services; MAHA stores no music. If licensing is unclear, keep `ambientAudio:null`.

## 3. Suitcase Atlas — 6 optional location clips, stills and personal notes
Postcards work with code-painted scenes. Each optional 10-second loop is H.264 720p **under 3 MB**, muted by default, playing only on the user’s tap. Each image <180 KB. Set `clip` and `still` inside `content/places.json` when ready. Six remaining `futureSlots` are intentionally blank placeholders, not invented destinations.

| Place | Optional clip (10 sec, <3 MB) | Optional still (<180 KB) | Memory to replace |
|---|---|---|
| Kerala | `assets/video/travel-kerala.mp4` | `assets/stills/travel-kerala.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |
| Kuwait | `assets/video/travel-kuwait.mp4` | `assets/stills/travel-kuwait.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |
| Bengaluru | `assets/video/travel-bangalore.mp4` | `assets/stills/travel-bangalore.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |
| Munnar | `assets/video/travel-munnar.mp4` | `assets/stills/travel-munnar.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |
| Manali | `assets/video/travel-manali.mp4` | `assets/stills/travel-manali.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |
| Ladakh | `assets/video/travel-ladakh.mp4` | `assets/stills/travel-ladakh.webp` | `[ADD YOUR OWN MEMORY HERE]` postcard text |

## Setup sequence
1. Keep a private backup of your original videos and recordings. Compress them before putting them in this website.
2. Copy files to the exact paths above.
3. Set `video`/`still` in `content/movies.json`, `introAudio`/`ambientAudio`/external playlist URLs in `content/radio.json`, and `clip`/`still` in `content/places.json`. Only use files you actually provided.
4. Replace subtitle placeholders with matched English and Malayalam .vtt text, in UTF-8.
5. Test iPhone Safari with unmuted system audio. iPhone must receive a tap before sound/video starts. Test mute, pause, scrubbing, and replay after changing places.
6. Confirm rights to every soundtrack and recording; don’t use commercial copyrighted songs as site audio.

## Privacy note
The current GitHub Pages deployment is public. Anything you commit (including voice notes, photos, names, and custom film clips) is downloadable by visitors. Private GitHub **source** alone does not restrict the published website. Use a restricted deployment/authentication layer for private memories.
