# MAHA · The Room Must Feel Real
## Creative and build handoff (30 October 2026)

### The bar
A room that feels **lived in**, not a background with floating icons. The seven experiences are reached by physical things in the same room. On mobile, use **purpose-composed portrait images**, not desktop crops. On desktop, use original wide architectural scenes. No external photo or icon requests.

### What is live
- Seven fully functioning content worlds: letters, Habibii FM, cinema, travel, arcade, growing word garden, rest.
- Each portal has a custom physical SVG object, keyboard focus, a functional link and a deliberate colour/material treatment in its destination.
- The **actual seven chosen flower types** (duplicates allowed) are drawn as stems in a physically illustrated vase; selecting again updates it.
- Six theme variants remain available, existing localStorage and content preserved.
- Three-position phone **peek around**: a safe camera shift triggered by a control or a horizontal swipe over the background. This is not and is never described as a true 360° view.
- Native Web Animations fallback; no remote JS library required. Local asset caching continues.

### The final imagery
All twelve production-ready GPT image prompts are at `content/room-art-direction.json`, one **separately composed portrait and wide image for each theme**:

| Theme | Architecture | Mood |
| --- | --- | --- |
| The Little Hideaway | Walnut bedroom / reading den | Tactile golden hour |
| Kerala When It Rains | Rainy timber courtyard, red-oxide floor | Rain and warmth |
| A Sunlit Sunday | Tall windows, linen, pale oak | Fresh morning |
| The Courtyard Home | Indian terracotta craft atelier | Afternoon copper |
| The Midnight Home | Dark city artist's apartment | Indigo and lamp |
| Kuwait After Sunset | Personal contemporary Kuwait apartment | Gulf blue hour |

**Each scene prompt** instructs the GPT generator to include an actual projector/TV, letter tray, radio, travel case, plant, game device and rest nook; and an **empty vase** so Maha's seven selected flowers can appear there live. Scene photographs never contain baked-in UI or words. The thumbnail and active scene share the same original image.

### Generating and publishing the originals
The project contains a **manual, API-billed** workflow: `.github/workflows/generate-original-room-art.yml`. It generates local WebP files and commits them. A GitHub repository Action secret named `OPENAI_API_KEY` is required. ChatGPT Plus and OpenAI API billing are separate. **Never paste the key into chat, source code, a GitHub issue, or a commit.**

After setting the secret, open **GitHub → Habibiii → Actions → Generate original GPT room art → Run workflow**. Leave **theme = all**, **orientation = both**, and **replace_existing = false**. This creates twelve originals, and the script **retires the previous stock image files** when the full set has been successfully generated. A failed/missing image does not break the live website: the local image manifest keeps the current fallback until a replacement exists.

The script makes paid image-generation requests. Check API usage/budget before running the workflow. The workflow does **not** run automatically on an ordinary push. You can generate a single theme first if you prefer to check quality or control cost.

### Physical object quality gate
Do not render a duplicate TV or suitcase sticker over a photograph that already contains it. Once an original scene is active, the seven foreground SVG props disappear into the actual photorealistic objects within the image; focus/hover still gives a quiet accessible hotspot. **The bouquet remains live**, because her current choices cannot be baked into a photograph. QA should assert every active place and flower state, not merely check that elements exist.

### Secondary content / future polish
Optional and only if wanted: original self-recorded audio for Habibii FM, her actual travel memories or approved photos for the letter/postcard shelf, personally approved clips for mini cinema, a discreet evergreen wellness note. Never invent private memories or add a romantic relationship framing.

### Privacy and performance
No account, geolocation, analytics, remote artwork, camera or motion sensor permission. Store progress locally, let her download/export backups as before. Preload only useful art; WebP optimization is already in the generation script. Honour reduced motion; portrait rendering must remain keyboard and voice-over navigable and taps must be at least 44px.

### What still requires actual image assets
**The original twelve photorealistic images have not been generated or published yet**. The Higgsfield-connected workspace reported no credits, and the GitHub action cannot use the GPT Image API until an API key is added securely. The existing locally bundled photographic rooms remain temporary reference backdrops until this step succeeds. Do not claim that the entire original-image requirement is already complete.
