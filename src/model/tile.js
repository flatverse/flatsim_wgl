(function (scope) {

scope.Tile = function (options) {
  options = options || {};
  _.extend(this, _.defaults(options, {
    i: null, // tile coord x
    j: null, // tile coord y
    k: null, // tile coord z

    // face settings
    top: _.defaults(options.top || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),
    bottom: _.defaults(options.bottom || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),
    west:  _.defaults(options.west || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),
    east:  _.defaults(options.east || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),
    north:  _.defaults(options.north || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),
    south:  _.defaults(options.south || {}, {
      texture: null,
      color: new Float32Array([1.0, 1.0, 1.0, 1.0]),
    }),

    // corner height offsets
    corner_offsets_top: _.defaults(options.corner_offsets_top || {}, {
      wn: new Float32Array(3),
      ws: new Float32Array(3),
      es: new Float32Array(3),
      en: new Float32Array(3),
    }),
    corner_offsets_bottom:  _.defaults(options.corner_offsets_top || {}, {
      wn: new Float32Array(3),
      ws: new Float32Array(3),
      es: new Float32Array(3),
      en: new Float32Array(3),
    }),
  }));
};
scope.Tile.prototype = {
  // TODO setters
};

})(window.gltile);
