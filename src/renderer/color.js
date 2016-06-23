(function (scope) {
scope.Color = function (r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  if (typeof a === 'undefined') {
    this.a = 1;
  }
};
scope.Color.prototype = {
  r: null,
  g: null,
  b: null,
  a: null,

  to_array: function () {
    return new Float32Array([this.r, this.g, this.b, this.a]);
  },
};

scope.Color.red = new Float32Array([1, 0, 0, 1]);
scope.Color.yellow = new Float32Array([1, 1, 0, 1]);
scope.Color.green = new Float32Array([0, 1, 0, 1]);
scope.Color.blue = new Float32Array([0, 0, 1, 1]);
scope.Color.orange = new Float32Array([1, 0.5, 0, 1]);

})(gltile);
