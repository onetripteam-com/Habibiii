# Geographic source for the personal atlas

MAHA's updated map is an original, custom-rendered SVG:
`assets/atlas-region.svg`.

Geography is drawn from *Natural Earth*, public-domain administrative boundary vectors, 1:110m resolution (Admin 0 countries), retrieved from:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson

The rendering uses a clipped simple equirectangular projection (34°E–102°E; 45°N–2°S), a custom editorial paper style, handmade labels, and decorative routes. Actual country/coastline shapes are no longer invented polygons.

`content/places.json` stores approximate latitude/longitude for the seven locations; its `x` and `y` values are calculated from that same projection. Kerala, Kuwait, Bengaluru, Munnar, Manali, Ladakh and Nepal are geographically positioned, but the art is **not for navigation**.

Custom dream pins are symbolic—no geocoding, geolocation, tracking or network access. No location information is sent to another service. Never imply that dream pins have verified geographical coordinates.

Mapping and decorative routes are illustrative rather than a statement about political borders or actual trips made by the recipient. The hand-drawn paper, textures, route lines and composition are original.
