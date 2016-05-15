(function (scope) {

scope.Tile = function (options) {
  _.extend(this, _.defaults({
    i: null, // tile coord x
    j: null, // tile coord y
    k: null, // tile coord z
  }));

  this.top = {
    texture: null,
    color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
  };
  this.bottom = _.cloneDeep(this.top);
  this.north = _.cloneDeep(this.top);
  this.west = _.cloneDeep(this.top);
  this.south = _.cloneDeep(this.top);
  this.east = _.cloneDeep(this.top);
};
scope.Tile.prototype = {
  // relative corner heights
  height_nw: 1,
  height_sw: 1,
  height_se: 1,
  height_ne: 1,

  // if true tile is flat on tope and sloped on bottom
  h_invert: false,

  // info about each face
  top: null,
  bottom: null,
  north: null,
  west: null,
  south: null,
  east: null,
};

})(window.gltile);
