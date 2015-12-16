flatsim.TileMeshGrid = function (tilesWE, tilesNS, tilePerspective, texturesManager) {
  this.tiles = [];
  this.meshes = [];
  this.persp = tilePerspective;
  this.textures = texturesManager;

  var tile, mesh;
  var we, ns;
  for (we = 0; we < tilesWE; we++) {
    this.tiles.push([]);
    this.meshes.push([]);
    for (ns = 0; ns < tilesNS; ns++) {
      tile = new flatsim.Tile(we, ns);
      mesh = new flatsim.TileMesh(tile, this.persp, this.textures);
      this.tiles[we].push(tile);
      this.meshes[we].push(mesh);
    }
  }
};
flatsim.TileMeshGrid.prototype = {
  tiles: undefined,
  meshes: undefined,
  persp: undefined,
  texutres: undefined,

  update: function () {
    this.for_each_mesh(function (mesh) {
      mesh.update();
    });
    this.for_each_tile(function (tile) {
      tile.refresh_state();
    });
  },

  add_to_scene: function (scene) {
    this.for_each_mesh(function (mesh) {
      scene.add(mesh.group);
    });
  },

  for_each_tile: function (eleCallback) {
    var we, ns;
    for (we = 0; we < this.tiles.length; we++) {
      for (ns = 0; ns < this.tiles[we].length; ns++) {
        eleCallback(this.tiles[we][ns]);
      }
    }
  },

  for_each_mesh: function (eleCallback) {
    var we, ns;
    for (we = 0; we < this.meshes.length; we++) {
      for (ns = 0; ns < this.meshes[we].length; ns++) {
        eleCallback(this.meshes[we][ns]);
      }
    }
  },

  get_tile: function (we, ns) {
    return this.tiles[we][ns];
  },

  get_mesh: function (we, ns) {
    return this.meshes[we][ns];
  },
};