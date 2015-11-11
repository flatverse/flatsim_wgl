flatsim.TileMeshGrid = function (tile, tilePerspective) {
  this.tile = tile;
  this.perspective = tilePerspective;

  var geo = this._make_square_geo(new THREE.Vector3(0, 0, 1));
  var mat = new THREE.MeshBasicMaterial({color: tile.grid_color});
  this.base_mesh_top = new THREE.Mesh(geo, mat);
  // this.base_mesh_top.renderOrder = 1;
  // this.base_mesh_top.depthTest = false;
};
flatsim.TileMeshGrid.prototype = {
  tile: undefined,
  perspective: undefined,
  base_mesh_top: undefined,
  slope_mesh: undefined,

  line_width: 0.01,
  offset: 0.0001,

  _make_square_geo: function (faceNormal) {
    var axNorm, axA, axB;
    var wA, halfWA, wB, halfWB;
    var normVal;
    if (Math.abs(faceNormal.x) === 1) {
      axNorm = 'x';
      axA = 'y';
      wA = this.perspective.tile_dim_ns;
      axB = 'z';
      wB = this.perspective.tile_dim_h;
      normVal = this.perspective.tile_dim_we / 2;
      if (faceNormal.x === -1) {
        normVal = -normVal;
      }
    } else if (Math.abs(faceNormal.y) === 1) {
      axNorm = 'y';
      axA = 'x';
      wA = this.perspective.tile_dim_we;
      axB = 'z';
      wB = this.perspective.tile_dim_h;
      normVal = this.perspective.tile_dim_ns / 2;
      if (faceNormal.y === -1) {
        normVal = -normVal;
      }
    } else {
      axNorm = 'z';
      axA = 'x';
      wA = this.perspective.tile_dim_we;
      axB = 'y';
      wB = this.perspective.tile_dim_ns;
      if (faceNormal.z === -1) {
        normVal = this.perspective.scene_height_from_tile_height(this.tile.height_bottom - this.offset);
      } else {
        normVal = this.perspective.scene_height_from_tile_height(this.tile.height_top + this.offset);
      }
    }
    halfWA = wA / 2;
    halfWB = wB / 2;

    var verts = [];
    verts[0] = this._make_vector(normVal, -halfWA, halfWB, axNorm, axA, axB); //0
    verts[1] = this._make_vector(normVal, halfWA, halfWB, axNorm, axA, axB); // 1
    verts[2] = this._make_vector(normVal, halfWA, -halfWB, axNorm, axA, axB); // 2
    verts[3] = this._make_vector(normVal, -halfWA, -halfWB, axNorm, axA, axB); // 3
    verts[4] = this._make_vector(normVal, -halfWA + this.line_width, halfWB - this.line_width, axNorm, axA, axB); // 4
    verts[5] = this._make_vector(normVal, halfWA - this.line_width, halfWB - this.line_width, axNorm, axA, axB); // 5
    verts[6] = this._make_vector(normVal, halfWA - this.line_width, -halfWB + this.line_width, axNorm, axA, axB); // 6
    verts[7] = this._make_vector(normVal, -halfWA + this.line_width, -halfWB + this.line_width, axNorm, axA, axB); // 7

    var faces = [];
    faces.push(new THREE.Face3(0, 4, 1));
    faces.push(new THREE.Face3(1, 4, 5));
    faces.push(new THREE.Face3(1, 5, 2));
    faces.push(new THREE.Face3(2, 5, 6));
    faces.push(new THREE.Face3(2, 6, 3));
    faces.push(new THREE.Face3(3, 6, 7));
    faces.push(new THREE.Face3(3, 7, 0));
    faces.push(new THREE.Face3(0, 7, 4));

    var geo = new THREE.Geometry();
    _.forEach(verts, function(vert) {geo.vertices.push(vert)});
    geo.faces = faces;
    _.forEach(faces, function(face) {geo.faces.push(face)});
    geo.computeFaceNormals();
    return geo;
  },

  _make_vector: function (normVal, aVal, bVal, axNorm, axA, axB) {
    var vObj = {};
    vObj[axNorm] = normVal;
    vObj[axA] = aVal;
    vObj[axB] = bVal;
    return new THREE.Vector3(vObj.x, vObj.y, vObj.z);
  },
};