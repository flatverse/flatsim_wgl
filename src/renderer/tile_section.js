(function (scope) {

scope.TileSection = function (options) {
  scope.Utils.check_required(options, ['renderer'], 'TileSection');
  options = _.defaults(options || {}, {
    tiles: null, // 3D array accessed like so [WE][SN][TB]
    tiles_we: 20,
    tiles_ns: 20,
    tiles_tb: 1,
    renderer: null,
  });

  var tiles = [];
  for (var we = 0; !options.tiles && we < options.tiles_we; we++) {
    tiles.push([]);
    for (var sn = 0; sn < options.tiles_ns; sn++) {
      tiles[we].push([]);
      for (var tb = 0; tb < options.tiles_tb; tb++) {
        tiles[we][sn].push(new scope.Tile({
          i: we,
          j: sn,
          k: tb
        }));
      }
    }
  }

  var nodes = [];
  for (var we = 0; we < tiles.length; we++) {
    nodes.push([]);
    for (var sn = 0; sn < tiles[we].length; sn++) {
      nodes[we].push([]);
      for (var tb = 0; tb < tiles[sn].length; tb++) {
        nodes[we][sn].push(new scope.RenderNode());
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
  get_tile: function(we, sn, tb) {
    if (this.tiles[we] && this.tiles[we][sn] && this.tiles[we][sn][tb]) {
      return this.tiles[we][sn][tb];
    } else {
      return null;
    }
  },

  get_adjacent_tile: function(we, sn, tb, face) {
    var adj_map = scope.Tile.adjacency_maps[face];
    var tile = this.get_tile(we + adj_map[0], sn + adj_map[1], tb + adj_map[2]);
    return tile;
  },

  is_adjacent_flush: function(we, sn, tb, face) {
    if (we < 0 || we >= this.tiles.length) {
      scope.throw_error('we index out "' + we + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }
    if (sn < 0 || sn >= this.tiles[we].length) {
      scope.throw_error('sn index out "' + sn + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }
    if (tb < 0 || tb >= this.tiles[we][sn].length) {
      scope.throw_error('tb index out "' + tb + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }

    var tile = this.get_tile(we, sn, tb);
    var adj = this.get_adjacent_tile(we, sn, tb, face);
    if (!adj) {
      return false;
    }
    var adj_face = scope.Tile.opposite_faces[face];

    var face_verts = this.renderer.face_compiler.get_face_verts(tile, face);
    var adj_face_verts = this.renderer.face_compiler.get_face_verts(adj, adj_face);

    var this_ix = 0 * 3;
    var adj_ix = 3 * 3;

    // TODO some sort of mechanism for dealing with floating point errors
    var tl_tr = face_verts[this_ix + 0] === adj_face_verts[adj_ix + 0] &&
      face_verts[this_ix + 1] === adj_face_verts[adj_ix + 1] &&
      face_verts[this_ix + 2] === adj_face_verts[adj_ix + 2];
    this_ix += 3;
    adj_ix -= 3;

    var bl_br = face_verts[this_ix + 0] === adj_face_verts[adj_ix + 0] &&
      face_verts[this_ix + 1] === adj_face_verts[adj_ix + 1] &&
      face_verts[this_ix + 2] === adj_face_verts[adj_ix + 2];
    this_ix += 3;
    adj_ix -= 3;

    var br_bl = face_verts[this_ix + 0] === adj_face_verts[adj_ix + 0] &&
      face_verts[this_ix + 1] === adj_face_verts[adj_ix + 1] &&
      face_verts[this_ix + 2] === adj_face_verts[adj_ix + 2];
    this_ix += 3;
    adj_ix -= 3;

    var tr_tl = face_verts[this_ix + 0] === adj_face_verts[adj_ix + 0] &&
      face_verts[this_ix + 1] === adj_face_verts[adj_ix + 1] &&
      face_verts[this_ix + 2] === adj_face_verts[adj_ix + 2];

    return tl_tr && bl_br && br_bl && tr_tl;
  },
};

})(gltile);