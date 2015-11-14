flatsim.TileBaseGeo = function (tile, tilePersp) {
  THREE.Geometry.call(this);

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

  this.vertices = verts;
  this.faces = faces;
  this.computeFaceNormals();
};

flatsim.TileBaseGeo.prototype = Object.create(THREE.Geometry.prototype);
flatsim.TileBaseGeo.prototype = _.extend(flatsim.TileBaseGeo.prototype, {
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
    _.forEach(newVerts, function (vert, i) {
      this.vertices[i].x = vert.x;
      this.vertices[i].y = vert.y;
      this.vertices[i].z = vert.z;
    }, this);
    this.verticesNeedUpdate = true;
  },

  compute_verts: function(tile, tilePersp) {
    var weHalf = tilePersp.get_dim_we() / 2;
    var nsHalf = tilePersp.get_dim_ns() / 2;
    var topZ = tilePersp.scene_height_from_tile_height(tile.height_top);
    var botZ = tilePersp.scene_height_from_tile_height(tile.height_bottom);

    var verts = [];
    verts[this.vert_top_nw] = new THREE.Vector3(-weHalf, nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.slope.nw));
    verts[this.vert_top_sw] = new THREE.Vector3(-weHalf, -nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.slope.sw));
    verts[this.vert_top_se] = new THREE.Vector3(weHalf, -nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.slope.se));
    verts[this.vert_top_ne] = new THREE.Vector3(weHalf, nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.slope.ne));
    verts[this.vert_bot_nw] = new THREE.Vector3(-weHalf, nsHalf, botZ);
    verts[this.vert_bot_sw] = new THREE.Vector3(-weHalf, -nsHalf, botZ);
    verts[this.vert_bot_se] = new THREE.Vector3(weHalf, -nsHalf, botZ);
    verts[this.vert_bot_ne] = new THREE.Vector3(weHalf, nsHalf, botZ);

    return verts;
  },
});
flatsim.TileBaseGeo.prototype.constructor = flatsim.TileBaseGeo;
