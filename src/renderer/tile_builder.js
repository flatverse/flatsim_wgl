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
  this.corner_map_west = [
    'wnb', // 0 
    'wsb', // 1 
    'wst', // 2 
    'wnt', // 3 
  ];
  this.face_east = new Float32Array([
     0.5,  0.5,  0.5, // lt ent 0
     0.5, -0.5,  0.5, // lb est 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_east = [
    'ent', // 0 
    'est', // 1 
    'esb', // 2 
    'enb', // 3 
  ];

  this.face_north = new Float32Array([
    -0.5,  0.5, -0.5, // lt wnb 0
    -0.5,  0.5,  0.5, // lb wnt 1
     0.5,  0.5,  0.5, // rb ent 2
     0.5,  0.5, -0.5, // rt enb 3
  ]);
  this.corner_map_north = [
    'wnt', // 0
    'wnb', // 1 
    'enb', // 2 
    'ent', // 3
  ];
  this.face_south = new Float32Array([
    -0.5, -0.5,  0.5, // lt wst 0
    -0.5, -0.5, -0.5, // lb wsb 1
     0.5, -0.5, -0.5, // rb esb 2
     0.5, -0.5,  0.5, // rt est 3
  ]);
  this.corner_map_south = [
    'wst', // 0
    'wsb', // 1
    'esb', // 2
    'est', // 3
  ];

  this.face_top = new Float32Array([
    -0.5,  0.5,  0.5, // lt wnt 0
    -0.5, -0.5,  0.5, // lb wst 1
     0.5, -0.5,  0.5, // rb est 2
     0.5,  0.5,  0.5, // rt ent 3
  ]);
  this.corner_map_top = [
    'wnt', // 0
    'wst', // 1
    'est', // 2
    'ent', // 3
  ];
  this.face_bottom = new Float32Array([
     0.5,  0.5, -0.5, // lt enb 0
     0.5, -0.5, -0.5, // lb esb 1
    -0.5, -0.5, -0.5, // rb wsb 2
    -0.5,  0.5, -0.5, // rt wnb 3
  ]);
  this.corner_map_bottom = [
    'enb', // 0
    'esb', // 1
    'wsb', // 2
    'wnb', // 3
  ];
};
scope.TileBuilder.prototype = {

  get_face_verts: function (tile, face) {
    var verts = this['face_' + face];
    var corner_map = this['corner_map_' + face];

    var loc_offset = new Float32Array([tile.i * this.scale_we, tile.j * this.scale_ns, tile.k * this.scale_tb]);
    var lt = vec3.create();
    vec3.add(lt, verts.subarray(0, 3), tile.corner_offsets[corner_map[0]]);
    vec3.add(lt, lt, loc_offset);
    var lb = vec3.create();
    vec3.add(lb, verts.subarray(3, 6), tile.corner_offsets[corner_map[1]]);
    vec3.add(lb, lb, loc_offset);
    var rb = vec3.create();
    vec3.add(rb, verts.subarray(6, 9), tile.corner_offsets[corner_map[2]]);
    vec3.add(rb, rb, loc_offset);
    var rt = vec3.create();
    vec3.add(rt, verts.subarray(9, 12), tile.corner_offsets[corner_map[3]]);
    vec3.add(rt, rt, loc_offset);

    return scope.Utils.float32_concat(lt, lb, rb, rt);
  },
};

})(gltile);
