#TODO
## Tile tile.js
1. keep track of state from update to update and report back on fields that were changed

## TileMesh tile_mesh.js
1. When **Tile** _bullet 1_ is completed, check for relevant changed fields and only update color (and any other future fields monitored by TileMesh) when the tile's color value changes.
2. Change this to extend THREE.Group instead of wrappint it.

## TileBaseGeo tile\_base\_geo.js
1. When **Tile** _bullet 1_ is completed, check for relevant changed fields and only update verts when the tile has changed.
2. Change this to extend THREE.Geometry instead of wrapping it.