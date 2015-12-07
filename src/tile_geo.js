flatsim.TileGeo = function (tile, tilePersp, tileMat) {
  THREE.Geometry.call(this);

  this.tile = tile;
  this.perspective = tilePersp;

  var verts = this.compute_verts(tile, tilePersp);

  var faces = [
  // top
    new THREE.Face3(this.vert_top_nw, this.vert_top_sw, this.vert_top_se, undefined, undefined, tileMat.top_mat_ix),
    new THREE.Face3(this.vert_top_nw, this.vert_top_se, this.vert_top_ne, undefined, undefined, tileMat.top_mat_ix),
  // facing neg y
    new THREE.Face3(this.vert_top_sw, this.vert_bot_sw, this.vert_bot_se, undefined, undefined, tileMat.south_mat_ix),
    new THREE.Face3(this.vert_top_sw, this.vert_bot_se, this.vert_top_se, undefined, undefined, tileMat.south_mat_ix),
  // facing pos x
    new THREE.Face3(this.vert_top_se, this.vert_bot_se, this.vert_bot_ne, undefined, undefined, tileMat.east_mat_ix),
    new THREE.Face3(this.vert_top_se, this.vert_bot_ne, this.vert_top_ne, undefined, undefined, tileMat.east_mat_ix),
  // facing pos y
    new THREE.Face3(this.vert_top_ne, this.vert_bot_ne, this.vert_bot_nw, undefined, undefined, tileMat.north_mat_ix),
    new THREE.Face3(this.vert_top_ne, this.vert_bot_nw, this.vert_top_nw, undefined, undefined, tileMat.north_mat_ix),
  // facing neg x
    new THREE.Face3(this.vert_top_nw, this.vert_bot_nw, this.vert_bot_sw, undefined, undefined, tileMat.west_mat_ix),
    new THREE.Face3(this.vert_top_nw, this.vert_bot_sw, this.vert_top_sw, undefined, undefined, tileMat.west_mat_ix),
  // bottom
    new THREE.Face3(this.vert_bot_sw, this.vert_bot_nw, this.vert_bot_ne, undefined, undefined, tileMat.bottom_mat_ix),
    new THREE.Face3(this.vert_bot_sw, this.vert_bot_ne, this.vert_bot_se, undefined, undefined, tileMat.bottom_mat_ix),
  ];
  var uvTl = new THREE.Vector2(0.0, 1.0);
  var uvTr = new THREE.Vector2(1.0, 1.0);
  var uvBr = new THREE.Vector2(1.0, 0.0);
  var uvBl = new THREE.Vector2(0.0, 0.0);
  var i;
  for (i = 0; i < faces.length; i++) {
    this.faceVertexUvs[0].push([uvTl, uvBl, uvBr]);
    this.faceVertexUvs[0].push([uvTl, uvBr, uvTr]);
  }

  this.vertices = verts;
  this.faces = faces;
  this.computeFaceNormals();
};

flatsim.TileGeo.prototype = Object.create(THREE.Geometry.prototype);
flatsim.TileGeo.prototype = _.extend(flatsim.TileGeo.prototype, {
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
    if (!this.tile.was_changed(['corner_heights', 'height_top', 'height_bottom'])) {
      return;
    }

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
    verts[this.vert_top_nw] = new THREE.Vector3(-weHalf, nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.corner_heights.nw));
    verts[this.vert_top_sw] = new THREE.Vector3(-weHalf, -nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.corner_heights.sw));
    verts[this.vert_top_se] = new THREE.Vector3(weHalf, -nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.corner_heights.se));
    verts[this.vert_top_ne] = new THREE.Vector3(weHalf, nsHalf, topZ + tilePersp.scene_height_from_tile_height(tile.corner_heights.ne));
    verts[this.vert_bot_nw] = new THREE.Vector3(-weHalf, nsHalf, botZ);
    verts[this.vert_bot_sw] = new THREE.Vector3(-weHalf, -nsHalf, botZ);
    verts[this.vert_bot_se] = new THREE.Vector3(weHalf, -nsHalf, botZ);
    verts[this.vert_bot_ne] = new THREE.Vector3(weHalf, nsHalf, botZ);

    return verts;
  },
});
flatsim.TileGeo.prototype.constructor = flatsim.TileGeo;
