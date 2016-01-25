flatsim.TileMap = function(tilePersp, tilesWE, tilesNS) {
  this.persp = tilePersp;

  this.tiles = [];
  var we, ns, col;
  for (we = 0; we < tilesWE; we++) {
    col = [];
    for (ns = 0; ns < tilesNS; ns++) {
      col.push(new flatsim.Tile(we, ns, {}));
    }
    this.tiles.push(col);
  }
};
flatsim.TileMap.prototype = {
  persp: null,
  tiles: null,

  get: function (we, ns) {
    return this.tiles[we][ns];
  },

  get_tiles_we: function () {
    return this.tiles.length;
  },

  get_tiles_ns: function () {
    return this.tiles[0].length;
  },

  for_each: function (callback) {
    var we, ns;
    for (we = 0; we < this.get_tiles_we(); we++) {
      for (ns = 0; ns < this.get_tiles_ns(); ns++) {
        callback(this.get(we, ns), we, ns);
      }
    }
  },
};
