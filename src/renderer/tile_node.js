flatsim.TileNode = function (tile, tilePersp) {
  this.tile = tile;
  this.tile_persp = tilePersp;
  this.vert_ranges = null;
};
flatsim.TileNode.prototype = {
  tile: null,
  tile_persp: null,

  west: null,
  east: null,
  north: null,
  south: null,
  above: null,
  below: null,

  vert_ranges: null,

  build_verts: function () {
  },
};
