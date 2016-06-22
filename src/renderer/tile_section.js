(function (scope) {

scope.TileSection = function (options) {
  scope.Utils.check_required(options, [['renderer', 'gl']], 'TileSection');
  options = _.defaults(options || {}, {
    tiles: null, // 3D array accessed like so [WE][SN][TB]
    renderer: null,
    gl: null,
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
          k: tb,
        }));
        tiles[we][sn][tb].dirty = false;
      }
    }
  }

  var nodes = [];
  for (var we = 0; we < tiles.length; we++) {
    nodes.push([]);
    for (var sn = 0; sn < tiles[we].length; sn++) {
      nodes[we].push([]);
      for (var tb = 0; tb < tiles[we][sn].length; tb++) {
        nodes[we][sn].push(new scope.RenderNode());
      }
    }
  }

  var renderer = options.renderer || new scope.Renderer({
    gl: options.gl,
    max_faces: options.tiles_we * options.tiles_ns * options.tiles_tb * 6
  });

  scope.Utils.remove_init_only_options(options, [
    'tiles_we',
    'tiles_ns',
    'tiles_tb'
  ]);
  _.extend(this, options);

  this.tiles = tiles;
  this.nodes = nodes;
  this.renderer = renderer;

  this.add_all_tiles();
  this.renderer.buffer_data();
};
scope.TileSection.prototype = {
  /*****************************************************************************
  * public methods
  *****************************************************************************/
  get_tiles_we: function () {
    return this.tiles.length;
  },
  get_tiles_sn: function () {
    if (this.tiles.length === 0) {
      return 0;
    }
    return this.tiles[0].length;
  },
  get_tiles_bt: function () {
    if (this.tiles.length === 0 || this.tiles[0].length === 0) {
      return 0;
    }
    return this.tiles[0][0].length;
  },

  get_tile: function(we, sn, tb) {
    if (this.tiles[we] && this.tiles[we][sn] && this.tiles[we][sn][tb]) {
      return this.tiles[we][sn][tb];
    } else {
      return null;
    }
  },

  get_node: function (we, sn, tb) {
    if (this.nodes[we] && this.nodes[we][sn] && this.nodes[we][sn][tb]) {
      return this.nodes[we][sn][tb];
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

  update_tile: function (we, sn, bt) {
    if (we < 0 || we >= this.tiles.length) {
      scope.throw_error('we index out "' + we + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }
    if (sn < 0 || sn >= this.tiles[we].length) {
      scope.throw_error('sn index out "' + sn + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }
    if (bt < 0 || bt >= this.tiles[we][sn].length) {
      scope.throw_error('bt index out "' + bt + '" of bounds', ['TileSection', 'is_adjacent_flush']);
    }

    var tile = this.get_tile(we, sn, bt);
    if (!tile.dirty) {
      return;
    }

    var node = this.get_node(we, sn, bt);
    var face;
    for (var i = 0; i < scope.Tile.faces.length; i++) {
      face = scope.Tile.faces[i];
      if (node[face] !== null) {
        this.renderer.update_face(tile, face);
      }
    }
  },

  /*****************************************************************************
  * internal methods
  *****************************************************************************/
  add_tile: function (we, sn, tb) {
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
    var node = this.get_node(we, sn, tb);
    var face;
    for (var i = 0; i < scope.Tile.faces.length; i++) {
      face = scope.Tile.faces[i];
      if (!this.is_adjacent_flush(we, sn, tb, face)) {
        node[face] = this.renderer.add_face(tile, face);
      }
    }
  },

  add_all_tiles: function () {
    this.renderer.reset();
    var we, sn, bt;
    for (we = 0; we < this.get_tiles_we(); we++) {
      for (sn = 0; sn < this.get_tiles_sn(); sn++) {
        for (bt = 0; bt < this.get_tiles_bt(); bt++) {
          this.add_tile(we, sn, bt);
        }
      }
    }
  },
};

})(gltile);
