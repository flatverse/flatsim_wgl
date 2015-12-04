flatsim.TileMat = function (tile) {
  this.tile = tile;

  var mats = [];
  mats[this.top_mat_ix] = new THREE.MeshLambertMaterial({color: tile.top_color});
  mats[this.north_mat_ix] = new THREE.MeshLambertMaterial({color: tile.side_colors.north});
  mats[this.east_mat_ix] = new THREE.MeshLambertMaterial({color: tile.side_colors.east});
  mats[this.south_mat_ix] = new THREE.MeshLambertMaterial({color: tile.side_colors.south});
  mats[this.west_mat_ix] = new THREE.MeshLambertMaterial({color: tile.side_colors.west});
  mats[this.bottom_mat_ix] = new THREE.MeshLambertMaterial({color: tile.bottom_color});
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
    if (this.tile.was_changed('top_color')) {
      this.set_values_top({color: this.tile.top_color});
    }
    if(this.tile.was_changed('side_colors')) {
      for (var sideName in this.tile.side_colors) {
        this['set_values_' + sideName]({color: this.tile.side_colors[sideName]});
      }
    }
    if (this.tile.was_changed('bottom_color')) {
      this.set_values_bottom({color: this.tile.bottom_color});
    }
  },
});
flatsim.TileMat.prototype.constructor = flatsim.TileMat;