flatsim.TileMesh = function(tile, tilePerspective) {
  this.tile = tile;
  this.perspective = tilePerspective;
  this.name = flatsim.util.format_string('tilemesh_{0}_{1}', tile.coord_we, tile.coord_ns);
  this.group = new THREE.Group({name: this.name});

  var initGeo = new THREE.BoxGeometry(tilePerspective.tile_dim_we, tilePerspective.tile_dim_ns, tilePerspective.tile_dim_h);
  var initMaterial = new THREE.MeshBasicMaterial({color: this.tile.color});
  this.base_mesh = new THREE.Mesh(initGeo, initMaterial);
  var pos = tilePerspective.scene_coord_from_tile_coord(tile.coord_we, tile.coord_ns);
  this.group.add(this.base_mesh);

  this.grid_mesh = new flatsim.TileMeshGrid(tile, tilePerspective);
  this.group.add(this.grid_mesh.base_mesh_top);

  this.group.position.x = pos.x;
  this.group.position.y = pos.y;
};
flatsim.TileMesh.prototype = {
  tile: undefined,
  perspective: undefined,
  name: undefined,
  group: undefined,
  base_mesh: undefined,
  grid_mesh: undefined,
  slope_mesh: undefined,
};