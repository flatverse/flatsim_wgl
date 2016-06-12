(function (scope) {

scope.TileSection = function (options) {
  scope.Utils.check_required(options, ['renderer'], 'TileSection');
  options = _.defaults(options || {}, {
    tiles: null, // 3D array accessed like so [WE][NS][TB]
    tiles_we: 20,
    tiles_ns: 20,
    tiles_tb: 1,
    renderer: null,
  });

  var tiles = [];
  for (var we = 0; !options.tiles && we < options.tiles_we; we++) {
    tiles.push([]);
    for (var ns = 0; ns < options.tiles_ns; ns++) {
      tiles[we].push([]);
      for (var tb = 0; tb < options.tiles_tb; tb++) {
        tiles[we][ns].push(new scope.Tile({
          i: we,
          j: ns,
          k: tb
        }));
      }
    }
  }

  var nodes = [];
  for (var we = 0; we < tiles.length; we++) {
    nodes.push([]);
    for (var ns = 0; ns < tiles[we].length; ns++) {
      nodes[we].push([]);
      for (var tb = 0; tb < tiles[ns].length; tb++) {
        nodes[we][ns].push(new scope.RenderNode());
      }
    }
  }

  var renderer = options.renderer || new scope.Renderer({max_faces: options.tiles_we * options.tiles_ns * options.tiles_tb * 6});

  scope.Utils.remove_init_only_options(options, [
    'tiles_we',
    'tiles_ns',
    'tiles_tb'
  ]);
  _.extend(this, options);

  this.tiles = tiles;
  this.nodes = nodes;
  this.renderer = renderer;
};
scope.TileSection.prototype = {
  /*****************************************************************************
  * public methods
  *****************************************************************************/
  get_tile: function(we, ns, tb) {
    if (this.tiles[we] && this.tiles[we][ns] && this.tiles[we][ns][tb]) {
      return this.tiles[we][ns][tb];
    } else {
      return null;
    }
  },

  get_adjacent_tile: function(we, ns, tb, face) {
    var adj_map = scope.Tile.adjacency_maps[face];
    var tile = this.get_tile(we + adj_map[0], ns + adj_map[1], tb + adj_map[2]);
    return tile;
  },
};

})(gltile);