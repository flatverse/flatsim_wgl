window.addEventListener('load', function () {
  console.log('gltile', gltile.version);
  // TODO

  var gt_canvas = document.getElementById('gltile-canvas');
  var gt_gl = gt_canvas.getContext('webgl', {});

  var t = new gltile.Tile({
    i: 0,
    j: 0,
    k: 0
  });
});
