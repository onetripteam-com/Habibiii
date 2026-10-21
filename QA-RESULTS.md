# QA results — automated checks for PROMPT A

Tested October 22, 2026.

## Tested in Chromium's headless phone viewport emulation

| Viewport (CSS px) | First-visit hug | 12 NO replies + ending | Seven flower selection | PNG download | Room rendered | Interactive door |
| --- | --- | --- | --- | --- | --- | --- |
| 360 × 740 | Pass | Pass | Pass | Pass | Pass | Pass |
| 393 × 852 | Pass | Pass | Pass | Pass | Pass | Pass |
| 402 × 874 | Pass | Pass | Pass | Pass | Pass | Pass |
| 440 × 956 | Pass | Pass | Pass | Pass | Pass | Pass |

Additional automated passes: YES hug path at all four sizes; exactly seven bouquet SVG flower instances in the room; desktop JavaScript syntax checks; editable JSON files valid with 12 unique NO replies, 13 species and 30 daily lines; all service worker pre-cache files present. The generated **for-maha-seven-flowers.png** was successfully decoded as **960×1200 PNG**. Reduced-motion emulation confirmed fully visible ribbon, paper wrap and tag.

**Testing boundary:** Browser security in the build environment prevented normal HTTP navigation. To inspect layouts and interactions, an instrumented headless Chromium test mounted the same CSS/ES module code and SVG assets in a sandboxed document. This validates the interface paths but **is not a substitute for real Safari on iPhone, real HTTPS service worker/offline verification, Home Screen install, or audio-quality listening**. Use `IPHONE-QA.md` on a device after deployment.
