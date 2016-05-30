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
    ws: 2,
    wn: 3,
  };
  this.corner_map_bottom_west = {
    wn: 0,
    ws: 1,
  };
  this.face_east = new Float32Array([
     0.5,  0.5,  0.5, // lt ent 0
     0.5, -0.5,  0.5, // lb est 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_top_east = {
    en: 0,
    es: 1,
  };
  this.corner_map_bottom_east = {
    es: 2,
    en: 3,
  };

  this.face_north = new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb 0
    -0.5,  0.5,  0.5, // lb wnt 1
     0.5,  0.5,  0.5, // rb ent 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_top_north = {
    wn: 1,
    es: 2,
  };
  this.corner_map_bottom_north = {
    es: 0,
    en: 3,
  };
  this.face_south = new Float32Array([
    -0.5, -0.5,  0.5, // lt wst 0
    -0.5, -0.5, -0.5, // lb wsb 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5, -0.5,  0.5, // rt est 3
  ]);
  this.corner_map_top_south = {
    ws: 0,
    es: 3,
  };
  this.corner_map_bottom_south = {
    ws: 1,
    es: 2,
  };

  this.face_top = new Float32Array([
    -0.5,  0.5,  0.5, // lt wnt 0
    -0.5, -0.5,  0.5, // lb wst 1
     0.5, -0.5,  0.5, // rb est 2
     0.5,  0.5,  0.5, // rt ent 3
  ]);
  this.corner_map_top = {
    wn: 0,
    ws: 1,
    es: 2,
    en: 3,
  };
  this.face_bottom = new Float32Array([
     0.5,  0.5, -0.5, // lt enb 0
     0.5, -0.5, -0.5, // lb esb 1
    -0.5, -0.5, -0.5, // rb wsb 2
    -0.5,  0.5, -0.5, // rt wnb 3
  ]);
  this.corner_map_bottom = {
    en: 0,
    es: 1,
    ws: 2,
    wn: 3,
  };
};
scope.TileBuilder.prototype = {

  // TODO this
  // get_face_verts: function (tile, face) {
  //   var verts = _.clone(this['face_' + face]);
  //   var corner_map_top = 'corner_map_top';
  //   var corner_map_bottom = 'corner_map_bottom';
  //   if (face === 'top' || face === 'bottom') {
  //     corner_map_top += '_' + face;
  //     corner_map_bottom += '_' + face;
  //   }
  //   corner_map_top = this[corner_map_top];
  //   corner_map_bottom = this[corner_map_bottom];
  // },
};

})(gltile);
