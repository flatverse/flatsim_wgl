flatsim.TilePerspective = function (options) {
  if (typeof options === 'undefined') {
    options = {};
  }

  _.extend(this, options);
};
flatsim.TilePerspective.prototype = {
  tile_dim_we: 1,
  tile_dim_ns: 1,
  tile_dim_h: 1,
  center_x: 0,
  center_y: 0,
  center_z: 0,

  scene_coord_from_tile_coord: function (coordWE, coordNS) {
    var x = this.center_x + (coordWE * this.tile_dim_we);
    var y = this.center_y + (coordNS * this.tile_dim_ns);

    return {x: x, y: y};
  },

  scene_height_from_tile_height: function (height) {
    var z = this.center_z + (height * this.tile_dim_h);
    return z;
  },

  get_dim_we: function () {
    return this.tile_dim_we;
  },
  get_dim_ns: function () {
    return this.tile_dim_ns;
  },
  get_dim_h: function () {
    return this.tile_dim_h;
  },
};