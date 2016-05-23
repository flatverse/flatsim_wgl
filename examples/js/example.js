window.addEventListener('load', function () {
  console.log('gltile', gltile.version);
  // TODO

  gt_canvas = document.getElementById('gltile-canvas');
  gt_canvas.width = window.innerWidth;
  gt_canvas.height = window.innerHeight;
  gt_gl = gt_canvas.getContext('webgl', {});

  gltile.shaders.init(gt_gl);

  var z1 = -60.0;
  var z2 = -60.04;
  rendr = new gltile.Renderer(gt_gl);
  t_builder = new gltile.TileBuilder();

  rendr.vert_array.set(t_builder.face_top);
  rendr.color_array.set([
    1.0, 1.0, 0.0, 1.0, // tl
    1.0, 1.0, 0.0, 1.0, // bl
    1.0, 1.0, 0.0, 1.0, // br
    1.0, 1.0, 0.0, 1.0, // tr

    // 0.0, 1.0, 0.0, 1.0, // tl
    // 0.0, 1.0, 0.0, 1.0, // bl
    // 0.0, 1.0, 0.0, 1.0, // br
    // 0.0, 1.0, 0.0, 1.0 // tr
  ]);
  rendr.face_array.set([
    0, 1, 2,
    2, 3, 0,

    // 4, 5, 6,
    // 6, 7, 4
  ]);
  rendr.buffer_data();
  rendr.tile_face_count = 1;

  gt_gl.enable(gt_gl.DEPTH_TEST);
  gt_gl.enable(gt_gl.CULL_FACE);
  gt_gl.clearColor(0.0, 0.0, 0, 1.0);
  rendr.draw();


  rotY = function (deg) {
    if (typeof deg === 'undefined') {
      deg = 45;
    }
    deg = glMatrix.toRadian(deg);

    mat4.rotateY(rendr.mv_mat, rendr.mv_mat, deg);
  };
  rotX = function (deg) {
    if (typeof deg === 'undefined') {
      deg = 45;
    }
    deg = glMatrix.toRadian(deg);

    mat4.rotateX(rendr.mv_mat, rendr.mv_mat, deg);
  };
});
