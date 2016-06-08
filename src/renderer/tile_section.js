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
  this.nodes = null;

  var tiles = [];
  for (var we = 0; !this.tiles && we < options.tiles_we; we++) {
    tiles.push([]);
    for (var ns = 0; ns < options.tiles_ns; ns++) {
      tiles[we].push([]);
      for (var tb = 0; tb < options.tiles_tb; tb++) {
        tiles[we][ns].push(new scope.Tile());
      }
    }
  }
  this.tiles = tiles;

  var nodes = [];
  for (var we = 0; we < this.tiles.length; we++) {
    nodes.push([]);
    for (var ns = 0; ns < this.tiles[we].length; ns++) {
      nodes[we].push([]);
      for (var tb = 0; tb < this.tiles[ns].length; tb++) {
        nodes[we][ns].push(new scope.RenderNode());
      }
    }
  }
  this.nodes = nodes;

  this.renderer = options.renderer || new scope.Renderer({max_faces: options.tiles_we * options.tiles_ns * options.tiles_tb * 6});

  scope.Utils.remove_init_only_options(options, [
    'tiles_we',
    'tiles_ns',
    'tiles_tb'
  ]);
  _.extend(this, options);
};
scope.TileSection.prototype = {

};

})(gltile);