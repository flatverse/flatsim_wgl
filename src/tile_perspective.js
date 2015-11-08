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

  scene_coord_from_tile_coord: function (coordWE, coordNS) {
    var x = this.center_x + (coordWE * this.tile_dim_we);
    var y = this.center_y + (coordNS * this.tile_dim_ns);

    return {x: x, y: y};
  },
};