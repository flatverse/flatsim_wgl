flatsim.TileBaseGeo = function (tile, tilePersp) {
  this.tile = tile;
  this.perspective = tilePersp;

  var verts = this.compute_verts(tile, tilePersp);

  var faces = [
  // top
    new THREE.Face3(this.vert_top_nw, this.vert_top_sw, this.vert_top_se),
    new THREE.Face3(this.vert_top_nw, this.vert_top_se, this.vert_top_ne),
  // facing neg y
    new THREE.Face3(this.vert_top_sw, this.vert_bot_sw, this.vert_bot_se),
    new THREE.Face3(this.vert_top_sw, this.vert_bot_se, this.vert_top_se),
  // facing pos x
    new THREE.Face3(this.vert_top_se, this.vert_bot_se, this.vert_bot_ne),
    new THREE.Face3(this.vert_top_se, this.vert_bot_ne, this.vert_top_ne),
  // facing pos y
    new THREE.Face3(this.vert_top_ne, this.vert_bot_ne, this.vert_bot_nw),
    new THREE.Face3(this.vert_top_ne, this.vert_bot_nw, this.vert_top_nw),
  // facing neg x
    new THREE.Face3(this.vert_top_nw, this.vert_bot_nw, this.vert_bot_sw),
    new THREE.Face3(this.vert_top_nw, this.vert_bot_sw, this.vert_top_se),
  // bottom
    new THREE.Face3(this.vert_bot_sw, this.vert_bot_nw, this.vert_bot_ne),
    new THREE.Face3(this.vert_bot_nw, this.vert_bot_ne, this.vert_bot_se),
  ];

  this.three_geo = new THREE.Geometry();
  this.three_geo.vertices = verts;
  this.three_geo.faces = faces;
  this.three_geo.computeFaceNormals();
};
flatsim.TileBaseGeo.prototype = {
  tile: undefined,
  perspective: undefined,

  three_geo: undefined,

  vert_top_nw: 0,
  vert_top_sw: 1,
  vert_top_se: 2,
  vert_top_ne: 3,
  vert_bot_nw: 4,
  vert_bot_sw: 5,
  vert_bot_se: 6,
  vert_bot_ne: 7,

  update: function() {
    var newVerts = this.compute_verts(this.tile, this.perspective);
    var geo = this.three_geo;
    _.forEach(newVerts, function (vert, i) {
      geo.vertices[i].x = vert.x;
      geo.vertices[i].y = vert.y;
      geo.vertices[i].z = vert.z;
    });
    this.three_geo.verticesNeedUpdate = true;
  },

  get_geometry: function () {
    return this.three_geo;
  },

  compute_verts: function(tile, tilePersp) {
    var weHalf = tilePersp.get_dim_we() / 2;
    var nsHalf = tilePersp.get_dim_ns() / 2;
    var topZ = tilePersp.scene_height_from_tile_height(tile.height_top);
    var botZ = tilePersp.scene_height_from_tile_height(tile.height_bottom);

    var verts = [];
    verts[this.vert_top_nw] = new THREE.Vector3(-weHalf, nsHalf, topZ);
    verts[this.vert_top_sw] = new THREE.Vector3(-weHalf, -nsHalf, topZ);
    verts[this.vert_top_se] = new THREE.Vector3(weHalf, -nsHalf, topZ);
    verts[this.vert_top_ne] = new THREE.Vector3(weHalf, nsHalf, topZ);
    verts[this.vert_bot_nw] = new THREE.Vector3(-weHalf, nsHalf, botZ);
    verts[this.vert_bot_sw] = new THREE.Vector3(-weHalf, -nsHalf, botZ);
    verts[this.vert_bot_se] = new THREE.Vector3(weHalf, -nsHalf, botZ);
    verts[this.vert_bot_ne] = new THREE.Vector3(weHalf, nsHalf, botZ);

    return verts;
  },

};