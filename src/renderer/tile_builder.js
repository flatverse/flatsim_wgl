(function (scope) {

scope.TileBuilder = function (options) {
  _.extend(this, _.defaults(options || {}, {
    size_we: 1,
    size_ns: 1,
    size_tb: 1,
  }));
};
scope.TileBuilder.prototype = {
  face_west: new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb
    -0.5, -0.5, -0.5, // lb wsb
    -0.5, -0.5,  0.5, // rb wst
    -0.5,  0.5,  0.5, // rt wnt
  ]),
  face_east: new Float32Array([
     0.5,  0.5,  0.5, // lt ent
     0.5, -0.5,  0.5, // lb est
     0.5, -0.5, -0.5, // rb esb
     0.5,  0.5, -0.5, // rt enb
  ]),

  face_north: new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb
    -0.5,  0.5,  0.5, // lb wnt
     0.5,  0.5,  0.5, // rb ent
     0.5,  0.5, -0.5, // rt enb
  ]),
  face_south: new Float32Array([
    -0.5, -0.5,  0.5, // lt wst
    -0.5, -0.5, -0.5, // lb wsb
     0.5, -0.5, -0.5, // rb esb
     0.5, -0.5,  0.5, // rt est
  ]),

  face_top: new Float32Array([
    -0.5,  0.5,  0.5, // lt wnt
    -0.5, -0.5,  0.5, // lb wst
     0.5, -0.5,  0.5, // rb est
     0.5,  0.5,  0.5, // rt ent
  ]),
  face_bottom: new Float32Array([
     0.5,  0.5, -0.5, // lt  enb
     0.5, -0.5, -0.5, // lb  esb
    -0.5, -0.5, -0.5, // rb  wsb
    -0.5,  0.5, -0.5, // rt  wnb
  ]),
};

})(gltile);
