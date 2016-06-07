(function (scope) {

scope.RenderNode = function (options) {
  _.extend(this, _.defaults({
    top: null,
    bottom: null,
    west: null,
    east: null,
    north: null,
    south: null,
  }));
};

})(gltile);