flatsim.GridMesh = function (tile, tilePerspective) {
  THREE.Group.call(this);

  this.tile = tile;
  this.perspective = tilePerspective;
  this.tile_bnds = this.compute_bounds();

  var geo = new flatsim.GridGeo({
    tl: this.tile_bnds.top_nw,
    tr: this.tile_bnds.top_ne,
    br: this.tile_bnds.top_se,
    bl: this.tile_bnds.top_sw,
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

  compute_bounds: function() {
    return this.perspective.get_unit_box(this.tile.height_top, this.tile.height_bottom);
  },
});
flatsim.GridMesh.prototype.constructor = flatsim.GridMesh;