flatsim.TileNode = function (tile, tilePersp) {
  this.tile = tile;
  this.tile_persp = tilePersp;
  this.vert_ixs = {
    facing_north: null,
    facing_west: null,
    facing_south: null,
    facing_east: null,
    facing_down: null,
    facing_up: null,
  };
};
flatsim.TileNode.prototype = {
  tile: null,
  tile_persp: null,

  vert_ixs: null,

  west: null,
  east: null,
  north: null,
  south: null,
  above: null,
  below: null,

  directions: [ // as in you will see this face when looking in this direction
    'facing_north',
    'facing_west',
    'facing_south',
    'facing_east',
    'facing_down',
    'facing_up',
  ],
  adj_tiles: {
    facing_north: 'south',
    facing_west: 'east',
    facing_south: 'north',
    facing_east: 'west',
    facing_down: 'above',
    facing_up: 'below',
  },

  build_all_faces: function (firstVertIx) {

    var bnds = this.tile_persp.scene_box_from_tile(this.tile);

    var verts = [];
    var faces = [];
    var colors = [];
    // TODO norms

    var vertIx = firstVertIx;

    var self = this;
    _.forEach(this.directions, function (dir) {
      if (typeof firstVertIx === 'undefined') {
        vertIx = self.vert_ixs[dir];
      }
      var face = self.build_face(dir, vertIx);
      verts = verts.concat(face.verts);
      faces = faces.concat(face.faces);
      colors = colors.concat(face.colors);
      if (typeof firstVertIx !== 'undefined') {
        vertIx += face.verts.length / 3;
      }
    });

    return {
      verts: verts,
      faces: faces,
      colors: colors,
    };
  },

  build_face: function (dir, vertIx) {
    flatsim.log('{0} {1}', dir, vertIx);
    // TODO maybe check if above/below tiles are actually adjacent
    if (this[this.adj_tiles[dir]]) {
      return {
        verts: [],
        faces: [],
        colors: [],
      };
    }

    var bnds = this.tile_persp.scene_box_from_tile(this.tile);
    var verts = _.flatten(this.get_verts_from_bnds(dir, bnds));
    var faces = [
      vertIx + 0, vertIx + 1, vertIx + 2,
      vertIx + 2, vertIx + 3, vertIx + 0,
    ];
    var colors = [
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
    ];
    this.vert_ixs[dir] = vertIx;

    flatsim.log(flatsim.wgl_utils.verts_to_string(verts, faces));

    return {
      verts: verts,
      faces: faces,
      colors: colors,
    };
  },

  get_verts_from_bnds: function(dir, bnds) {
    return this.vert_funcs[dir](bnds);
  },

  vert_funcs: {
    facing_north: function (bnds) {
      return [
        bnds.top_sw, bnds.bot_sw,
        bnds.bot_se, bnds.top_se,
      ];
    },
    facing_west: function (bnds) {
      return [
        bnds.top_se, bnds.bot_se,
        bnds.bot_ne, bnds.top_ne,
      ];
    },
    facing_south: function (bnds) {
      return [
        bnds.top_ne, bnds.bot_ne,
        bnds.bot_nw, bnds.top_nw,
      ];
    },
    facing_east: function (bnds) {
      return [
        bnds.top_nw, bnds.bot_nw,
        bnds.bot_sw, bnds.top_sw,
      ];
    },
    facing_down: function (bnds) {
      return [
        bnds.top_nw, bnds.top_sw,
        bnds.top_se, bnds.top_ne,
      ];
    },
    facing_up: function (bnds) {
      return [
        bnds.bot_se, bnds.bot_sw,
        bnds.bot_nw, bnds.bot_ne,
      ];
    }
  },
};
