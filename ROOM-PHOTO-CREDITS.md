# MAHA — Photographic room asset provenance

The desktop room backgrounds are **locally hosted, optimized WebP copies** of
photographs downloaded from the Unsplash image CDN. They are used as parts of a
personal, non-commercial interactive website and not redistributed as a stock
photo collection.

| Room mood | Local asset | Unsplash photo identifier |
| --- | --- | --- |
| The Little Hideaway | `assets/rooms/story.webp` | `photo-1782346056252-c3699920bf19` |
| Kerala Rain | `assets/rooms/monsoon.webp` | `photo-1598632023082-0431ae33cbfe` |
| Sunlit Sunday | `assets/rooms/sunroom.webp` | `photo-1600607687939-ce8a6c25118c` |
| Terracotta Travels | `assets/rooms/terracotta.webp` | `photo-1618221195710-dd6b41faaea6` |
| After Hours | `assets/rooms/midnight.webp` | `photo-1600210492486-724fe5c67fb0` |
| Little Planetarium | `assets/rooms/cosmos.webp` | `photo-1616594039964-ae9021a400a0` |

Image links follow the pattern
`https://images.unsplash.com/<identifier>?auto=format&fit=crop&w=2200&q=88`.
Source download/conversion lives in `.github/workflows/package-room-photography.yml`.

The Unsplash License: https://unsplash.com/license.
The source photos are not claimed to depict Maha's real room, Kuwait, or any
actual place in her life. The theme names are fictional moods and art direction.

The room's interactive controls, type, visual treatment and motion are original
website design. Keep the accessible DOM buttons even when replacing photographs.
