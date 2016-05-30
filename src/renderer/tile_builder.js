(function (scope) {

scope.TileBuilder = function (options) {
  _.extend(this, _.defaults(options || {}, {
    scale_we: 1,
    scale_ns: 1,
    scale_tb: 1,
  }));

  this.face_west = new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb 0
    -0.5, -0.5, -0.5, // lb wsb 1
    -0.5, -0.5,  0.5, // rb wst 2
    -0.5,  0.5,  0.5, // rt wnt 3
  ]);
  this.corner_map_top_west = {
    2: 'ws',
    3: 'wn',
  };
  this.corner_map_bottom_west = {
    0: 'wn',
    1: 'ws',
  };
  this.face_east = new Float32Array([
     0.5,  0.5,  0.5, // lt ent 0
     0.5, -0.5,  0.5, // lb est 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_top_east = {
    0: 'en',
    1: 'es',
  };
  this.corner_map_bottom_east = {
    2: 'es',
    3: 'en',
  };

  this.face_north = new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb 0
    -0.5,  0.5,  0.5, // lb wnt 1
     0.5,  0.5,  0.5, // rb ent 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_top_north = {
    1: 'wn',
    2: 'es',
  };
  this.corner_map_bottom_north = {
    0: 'es',
    3: 'en',
  };
  this.face_south = new Float32Array([
    -0.5, -0.5,  0.5, // lt wst 0
    -0.5, -0.5, -0.5, // lb wsb 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5, -0.5,  0.5, // rt est 3
  ]);
  this.corner_map_top_south = {
    0: 'ws',
    3: 'es',
  };
  this.corner_map_bottom_south = {
    1: 'ws',
    2: 'es',
  };

  this.face_top = new Float32Array([
    -0.5,  0.5,  0.5, // lt wnt 0
    -0.5, -0.5,  0.5, // lb wst 1
     0.5, -0.5,  0.5, // rb est 2
     0.5,  0.5,  0.5, // rt ent 3
  ]);
  this.corner_map_top = {
    0: 'wn',
    1: 'ws',
    2: 'es',
    3: 'en',
  };
  this.face_bottom = new Float32Array([
     0.5,  0.5, -0.5, // lt enb 0
     0.5, -0.5, -0.5, // lb esb 1
    -0.5, -0.5, -0.5, // rb wsb 2
    -0.5,  0.5, -0.5, // rt wnb 3
  ]);
  this.corner_map_bottom = {
    0: 'en',
    1: 'es',
    2: 'ws',
    3: 'wn',
  };
};
scope.TileBuilder.prototype = {

  // TODO this
  get_face_verts: function (tile, face) {
    var verts = this['face_' + face];
    var corner_map_top = 'corner_map_top';
    var corner_map_bottom = 'corner_map_bottom';
    if (face !== 'top' && face !== 'bottom') {
      corner_map_top += '_' + face;
      corner_map_bottom += '_' + face;
    }
    corner_map_top = this[corner_map_top];
    corner_map_bottom = this[corner_map_bottom];
  },
};

})(gltile);
