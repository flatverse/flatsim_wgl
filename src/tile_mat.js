flatsim.TileMat = function (tile, materialManager) {
  this.tile = tile;
  this.mat_manager = materialManager;

  var mats = [];
  mats[this.top_mat_ix] = materialManager.get_material_or_default(tile.materials['top'], 'top');
  mats[this.north_mat_ix] = materialManager.get_material_or_default(tile.materials['north'], 'north');
  mats[this.east_mat_ix] = materialManager.get_material_or_default(tile.materials['east'], 'east');
  mats[this.south_mat_ix] = materialManager.get_material_or_default(tile.materials['south'], 'south');
  mats[this.west_mat_ix] = materialManager.get_material_or_default(tile.materials['west'], 'west');
  mats[this.bottom_mat_ix] = materialManager.get_material_or_default(tile.materials['bottom'], 'bottom');
  THREE.MeshFaceMaterial.call(this, mats);
};
flatsim.TileMat.prototype = Object.create(THREE.MeshFaceMaterial.prototype);
flatsim.TileMat.prototype = _.extend(flatsim.TileMat.prototype, {
  tile: undefined,
  mat_manager: undefined,

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
    if(this.tile.was_changed('materials')) {
      for (var sideName in this.tile.materials) {
        var matIx = this[sideName + '_mat_ix'];
        var mat = this.mat_manager.get_material_or_default(this.tile.materials[sideName], sideName);
        mat.needsUpdate = true;
        this.materials[matIx] = mat;
      }
      this.needsUpdate = true;
    }
  },
});
flatsim.TileMat.prototype.constructor = flatsim.TileMat;
