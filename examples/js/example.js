window.addEventListener('load', function () {
  console.log('gltile', gltile.version);

  gt_canvas = document.getElementById('gltile-canvas');
  gt_canvas.width = window.innerWidth;
  gt_canvas.height = window.innerHeight;
  gt_gl = gt_canvas.getContext('webgl', {});

  gltile.shaders.init(gt_gl);

  ts = new gltile.TileSection({
    renderer: new gltile.Renderer({gl: gt_gl}),
    tiles_we: 1,
    tiles_ns: 1,
    tiles_tb: 1,
  });
  rendr = ts.renderer;

  draw_func = function () {
    if (draw_func.kill) {
      draw_func.kill = false;
      return;
    }

    gt_gl.enable(gt_gl.DEPTH_TEST);
    gt_gl.enable(gt_gl.CULL_FACE);
    gt_gl.clearColor(0.0, 0.0, 0, 1.0);
    rendr.draw();

    requestAnimationFrame(draw_func);
  };

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

  rotX(-10);
  rotY(10);
  draw_func();

});
