flatsim.TileMesh = function(tile, tilePerspective, materialManager) {
  this.tile = tile;
  this.perspective = tilePerspective;
  this.name = flatsim.util.format_string('tilemesh_{0}_{1}', tile.coord_we, tile.coord_ns);
  this.group = new THREE.Group({name: this.name});

  this.base_mat = new flatsim.TileMat(tile, materialManager);
  this.base_geo = new flatsim.TileGeo(tile, tilePerspective, this.base_mat);
  this.base_mesh = new THREE.Mesh(this.base_geo, this.base_mat);
  var pos = tilePerspective.scene_coord_from_tile_coord(tile.coord_we, tile.coord_ns);
  this.group.add(this.base_mesh);

  this.grid_mesh = new flatsim.GridMesh(tile, tilePerspective);
  // this.group.add(this.grid_mesh);

  this.group.position.x = pos.x;
  this.group.position.y = pos.y;
};
flatsim.TileMesh.prototype = {
  tile: undefined,
  perspective: undefined,
  name: undefined,
  group: undefined,
  base_geo: undefined,
  base_mat: undefined,
  base_mesh: undefined,
  grid_mesh: undefined,
  slope_mesh: undefined,

  update: function () {
    this.base_geo.update();
    this.base_mat.update();
    this.grid_mesh.update();
  }
};