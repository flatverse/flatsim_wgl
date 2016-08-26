window.addEventListener('load', function () {
  console.log('gltile', gltile.version);

  gt_canvas = document.getElementById('gltile-canvas');
  gt_canvas.width = window.innerWidth;
  gt_canvas.height = window.innerHeight;
  gt_gl = gt_canvas.getContext('webgl', {});

  gltile.shaders.init(gt_gl);

  ts = new gltile.TileSection({
    // renderer: new gltile.Renderer({gl: gt_gl}),
    gl: gt_gl,
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

    ts.update_all_tiles();

    if (draw_func.kill) {
      draw_func.kill = false;
      return;
    }

    gt_gl.enable(gt_gl.DEPTH_TEST);
    gt_gl.enable(gt_gl.CULL_FACE);
    gt_gl.clearColor(0, 0, 0, 1);
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

  // tranZ(-0.500001);
  tranZ(-2);

  draw_func();

  screen_to_clip = function (gl, x, y) {
    var half_w = gl.drawingBufferWidth / 2;
    var half_h = gl.drawingBufferHeight / 2;
    var clip_x = (x - half_w) / half_w;
    var clip_y = -((y - half_h) / half_h);

    return {
      x: clip_x,
      y: clip_y
    };
  };

  // this doesn't
  clip_to_tile_section = function (clip_x, clip_y, z) {
    clip_x *= -z;
    clip_y *= z;
    // clip_z *= -z;
    var inv_mat = mat4.create();
    mat4.mul(inv_mat, rendr.proj_mat, rendr.mv_mat);
    mat4.invert(inv_mat, inv_mat);
    var vec = new Float32Array([clip_x, clip_y, z]);
    vec3.transformMat4(vec, vec, inv_mat);
    return vec;

    // var inv_mat = _.deepClone(rendr.proj_mat);
    // inv_mat = mat4.invert(inv_mat, inv_mat);
    // var ray_eye = vec4.create();
    // var clip_vec = new Float32Array([clip_x, clip_y, -1.0, 1.0]);
    // inv_mat = vec4.transform(ray_eye, clip_vec, inv_mat);
    // ray_eye = new Float32Array([ray_eye[0], ray_eye[1], -1.0, 0.0]);
  };

  project = function (x, y, z) {
    var pos = new Float32Array([x, y, z, 1.0]);
    mat4.mul(pos, rendr.mv_mat, pos);
    mat4.mul(pos, rendr.proj_mat, pos);
    pos[0] /= pos[3];
    pos[1] /= pos[3];
    return {
      x: pos[0],
      y: pos[1]
    };
  };
  // TODO fix screen_to_clip so that it works in reverse of project

  round_to = function (num, dec_places) {
    var factor = Math.pow(10, dec_places);
    num *= factor;
    num = Math.round(num);
    num /= factor;
    return num;
  };

  // z_level = -0.0001 / 1000;
  // z_level_far = -1.0001 / 1000;
  window.addEventListener('mouseup', function (e) {
    var clip = screen_to_clip(gt_gl, e.pageX, e.pageY);
    var ts = clip_to_tile_section(rendr, clip.x, clip.y, 999.5 / 1000);
    ts[0] = round_to(ts[0], 5);
    ts[1] = round_to(ts[1], 5);
    ts[2] = round_to(ts[2], 5);
    var ts2 = clip_to_tile_section(rendr, clip.x, clip.y, -999.5 / 1000);
    ts2[0] = round_to(ts2[0], 5);
    ts2[1] = round_to(ts2[1], 5);
    ts2[2] = round_to(ts2[2], 5);
    console.log('\npage:', e.pageX, e.pageY, '\nclip:', clip.x, clip.y, '\nts:', ts[0], ts[1], ts[2], '\nfar ts:', ts2[0], ts2[1], ts2[2]);
  });

});
