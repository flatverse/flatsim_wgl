flatsim.Tile = function (coordWE, coordNS, options) {
  this.coord_we = coordWE;
  this.coord_ns = coordNS;

  this.slope = {
    height_nw: 0,
    height_ne: 0,
    height_se: 0,
    height_sw: 0
  };

  _.extend(this, options);
};
flatsim.Tile.prototype = {
  coord_we: undefined,
  coord_ns: undefined,
  height_bottom: 0,
  height_top: 1,
  slope: { // will be redefined in constructor - defined here for readability
    height_nw: 0,
    height_ne: 0,
    height_se: 0,
    height_sw: 0
  },
  color: 0x77ff00,
  grid_color: 0xdddddd,
};