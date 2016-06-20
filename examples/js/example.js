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
  // ts2 = new gltile.TileSection({
  //   renderer: new gltile.Renderer({gl: gt_gl}),
  //   tiles_we: 40,
  //   tiles_ns: 11,
  //   tiles_tb: 1,
  // });

  t = ts.get_tile(0, 0, 0);

  stats = new Stats();
  document.body.appendChild(stats.domElement);

  draw_func = function () {
    stats.begin();

    if (draw_func.kill) {
      draw_func.kill = false;
      return;
    }

    gt_gl.enable(gt_gl.DEPTH_TEST);
    gt_gl.enable(gt_gl.CULL_FACE);
    gt_gl.clearColor(0.0, 0.0, 0, 1.0);
    gt_gl.clear(gt_gl.COLOR_BUFFER_BIT | gt_gl.DEPTH_BUFFER_BIT);
    

    // ts2.renderer.draw();

    ts.renderer.draw();

    // rendr = ts.renderer;
    // tranZ(-0.1);
    // rendr = ts2.renderer;
    // tranZ(-0.1);


    requestAnimationFrame(draw_func);

    stats.end();
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

  tranX = function(by) {
    by = by || 1;
    mat4.translate(rendr.mv_mat, rendr.mv_mat, [by, 0, 0]);
  };

  tranY = function(by) {
    by = by || 1;
    mat4.translate(rendr.mv_mat, rendr.mv_mat, [0, by, 0]);
  }

  tranZ = function (by) {
    by = by || -1;
    mat4.translate(rendr.mv_mat, rendr.mv_mat, [0, 0, by]);
  };

  // tranX((ts.get_tiles_we() - 1) / 2);
  // tranY((ts.get_tiles_sn() - 1) / 2);
  tranZ(((ts.get_tiles_bt() - 1) / 2) - 5);
  // rendr = ts2.renderer;
  // tranY(11.01);
  // tranZ(-100);
  draw_func();

});
