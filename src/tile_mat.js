flatsim.TileMat = function (tile, texturesManager) {
  this.tile = tile;
  this.textures_manager = texturesManager;

  var mats = [];
  mats[this.top_mat_ix] = texturesManager.base_mat.clone();
  mats[this.north_mat_ix] = texturesManager.base_mat.clone();
  mats[this.east_mat_ix] = texturesManager.base_mat.clone();
  mats[this.south_mat_ix] = texturesManager.base_mat.clone();
  mats[this.west_mat_ix] = texturesManager.base_mat.clone();
  mats[this.bottom_mat_ix] = texturesManager.base_mat.clone();

  THREE.MeshFaceMaterial.call(this, mats);
};
flatsim.TileMat.prototype = Object.create(THREE.MeshFaceMaterial.prototype);
flatsim.TileMat.prototype = _.extend(flatsim.TileMat.prototype, {
  tile: undefined,
  textures_manager: undefined,

  top_mat_ix: 0,
  north_mat_ix: 1,
  east_mat_ix: 2,
  south_mat_ix: 3,
  west_mat_ix: 4,
  bottom_mat_ix: 5,

  set_values: function (matIx, vals) {
    this.materials[matIx].setValues(vals);
  },

  set_values_top: function(vals) {
    this.set_values(this.top_mat_ix, vals);
  },
  set_values_north: function(vals) {
    this.set_values(this.north_mat_ix, vals);
  },
  set_values_east: function(vals) {
    this.set_values(this.east_mat_ix, vals);
  },
  set_values_south: function(vals) {
    this.set_values(this.south_mat_ix, vals);
  },
  set_values_west: function(vals) {
    this.set_values(this.west_mat_ix, vals);
  },
  set_values_bottom: function(vals) {
    this.set_values(this.bottom_mat_ix, vals);
  },

  update: function () {
    if(this.tile.was_changed('textures')) {
      for (var sideName in this.tile.textures) {
        var matIx = this[sideName + '_mat_ix'];
        this.set_values(matIx, {map: this.textures_manager.get_or_default(this.tile.textures[sideName])});
      }
    }
    if(this.tile.was_changed('colors')) {
      for (var sideName in this.tile.textures) {
        var matIx = this[sideName + '_mat_ix'];
        this.set_values(matIx, {color: this.tile.colors[sideName]});
      }
    }
  },
});
flatsim.TileMat.prototype.constructor = flatsim.TileMat;
