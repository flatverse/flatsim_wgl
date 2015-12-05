flatsim.TileMat = function (tile) {
  this.tile = tile;

  var mats = [];
  mats[this.top_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.top});
  mats[this.north_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.north});
  mats[this.east_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.east});
  mats[this.south_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.south});
  mats[this.west_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.west});
  mats[this.bottom_mat_ix] = new THREE.MeshLambertMaterial({color: tile.colors.bottom});
  THREE.MeshFaceMaterial.call(this, mats);
};
flatsim.TileMat.prototype = Object.create(THREE.MeshFaceMaterial.prototype);
flatsim.TileMat.prototype = _.extend(flatsim.TileMat.prototype, {
  tile: undefined,

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
    if(this.tile.was_changed('colors')) {
      for (var sideName in this.tile.colors) {
        this['set_values_' + sideName]({color: this.tile.colors[sideName]});
      }
    }
  },
});
flatsim.TileMat.prototype.constructor = flatsim.TileMat;