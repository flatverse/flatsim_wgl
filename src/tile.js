flatsim.Tile = function (coordWE, coordNS, options) {
  this.coord_we = coordWE;
  this.coord_ns = coordNS;

  this.corner_heights = {
    nw: 0,
    ne: 0,
    se: 0,
    sw: 0
  };

  _.extend(this, options);
};
flatsim.Tile.prototype = {
  coord_we: undefined,
  coord_ns: undefined,
  height_bottom: 0,
  height_top: 1,
  corner_heights: undefined,
  color: 0x77ff00,
  grid_color: 0xdddddd,

  get_nw_corner_height: function () {
    return this.height_top + this.corner_heights.nw;
  },
  get_ne_corner_height: function () {
    return this.height_top + this.corner_heights.ne;
  },
  get_se_corner_height: function () {
    return this.height_top + this.corner_heights.se;
  },
  get_sw_corner_height: function () {
    return this.height_top + this.corner_heights.sw;
  },
};