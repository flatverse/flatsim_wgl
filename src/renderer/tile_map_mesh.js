flatsim.TileMapMesh = function (gl, tileMap) {
  this.gl = null;
  this.tile_map = tileMap;
  var bufferVals = this.build_buffer_vals();
  this.tile_map_geo = new flatsim.TileMapGeo(
    gl,
    bufferVals.verts,
    bufferVals.faces,
    bufferVals.colors
  );
};
flatsim.TileMapMesh.prototype = {
  gl: null,
  tile_map: null,
  tile_map_geo: null,

  draw: function () {
    this.tile_map_geo.draw();
  },

  build_buffer_vals: function () {
    var persp = this.tile_map.persp;
    var verts_arr = [];
    var faces_arr = [];
    var colors_arr = [];
    // TODO supply vert norms
    // var norms_arr = [];
    var vertIx = 0;
    var self = this;
    this.tile_map.for_each(function (tile) {
      var bnds = persp.scene_box_from_tile(tile);
      _.forEach(self.get_verts_from_bnds_funcs, function(func) {
        var verts = func(bnds);
        _.forEach(verts, function(vertData) {
          verts_arr = verts_arr.concat(vertData);
        });
        faces_arr = faces_arr.concat([
          vertIx + 0, vertIx + 1, vertIx + 2,
          vertIx + 2, vertIx + 3, vertIx + 0,
        ]);
        colors_arr = colors_arr.concat([
          0.0, 1.0, 0.5, 1.0,
          0.0, 1.0, 0.5, 1.0,
          0.0, 1.0, 0.5, 1.0,
          0.0, 1.0, 0.5, 1.0,
        ]);
        vertIx += 4;
      });
    });

    return {
      verts: verts_arr,
      faces: faces_arr,
      colors: colors_arr,
    };
  },

  get_verts_from_bnds: function(dir, bnds) {
    return this.get_verts_froms_bnds_funcs[dir](bnds);
  },

  get_verts_from_bnds_funcs: {
    facing_north: function (bnds) {
      return [
        bnds.top_sw, bnds.bot_sw,
        bnds.bot_se, bnds.top_se,
      ];
    },
    faceing_west: function (bnds) {
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
