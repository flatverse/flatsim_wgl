(function (scope) {

scope.Tile = function (options) {
  options = options || {};
  _.extend(this, _.defaults(options, {
    i: null, // tile coord x
    j: null, // tile coord y
    k: null, // tile coord z

    // corner height offsets
    corner_offsets: _.defaults(options.corner_offsets_top || {}, {
      wnt: new Float32Array(3),
      wst: new Float32Array(3),
      ent: new Float32Array(3),
      est: new Float32Array(3),
      wnb: new Float32Array(3),
      wsb: new Float32Array(3),
      enb: new Float32Array(3),
      esb: new Float32Array(3),
    }),

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
  }));

  this.dirty = true;
};
scope.Tile.prototype = {

  for_each_face: function (func, this_arg) {
    this_arg = this_arg || this;
    var i, face;
    for (i = 0; i < scope.Tile.faces.length; i++) {
      face = scope.Tile.faces[i];
      func.call(this_arg, this[face], face, i);
    }
  },

  set_color: function (color_arr, face) {
    this.dirty = true;

    if (typeof face !== 'undefined') {
      face.color = _.clone(color_arr);
      return;
    }

    this.for_each_face(function (face) {
      face.color = _.clone(color_arr);
    });
  },
};

scope.Tile.faces = ['top', 'bottom', 'west', 'east', 'north', 'south'];
scope.Tile.corners = ['top', 'bottom', 'west', 'east', 'north', 'south'];

})(window.gltile);
