flatsim.GridMesh = function (tile, tilePerspective) {
  THREE.Group.call(this);

  this.tile = tile;
  this.perspective = tilePerspective;
  var tileBnds = this.compute_bounds();

  var geo = new flatsim.GridGeo({
    tl: tileBnds.top_nw,
    tr: tileBnds.top_ne,
    br: tileBnds.top_se,
    bl: tileBnds.top_sw,
    line_width: this.line_width,
    offset: new THREE.Vector3(0, 0, this.offset),
  });

  var mat = new THREE.MeshBasicMaterial({color: tile.grid_color});
  this.base_mesh_top = new THREE.Mesh(geo, mat);
  this.add(this.base_mesh_top);
};
flatsim.GridMesh.prototype = Object.create(THREE.Group.prototype);
flatsim.GridMesh.prototype = _.extend(flatsim.GridMesh.prototype, {
  tile: undefined,
  perspective: undefined,
  base_mesh_top: undefined,
  slope_mesh: undefined,

  line_width: 0.01,
  offset: 0.0001,

  update: function () {
    if (!this.tile.was_changed(['corner_heights', 'height_top', 'height_bottom'])) {
      return;
    }
    flatsim.log('[GridMesh] updating verts.');
    var tileBnds = this.compute_bounds();
    this.base_mesh_top.geometry.tl = tileBnds.top_nw;
    this.base_mesh_top.geometry.tr = tileBnds.top_ne;
    this.base_mesh_top.geometry.br = tileBnds.top_se;
    this.base_mesh_top.geometry.bl = tileBnds.top_sw;
    this.base_mesh_top.geometry.update();
  },

  compute_bounds: function() {
    return this.perspective.get_unit_box(this.tile);
  },
});
flatsim.GridMesh.prototype.constructor = flatsim.GridMesh;