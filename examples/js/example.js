window.addEventListener('load', function () {
  console.log('gltile', gltile.version);
  // TODO

  gt_canvas = document.getElementById('gltile-canvas');
  gt_canvas.width = window.innerWidth;
  gt_canvas.height = window.innerHeight;
  gt_gl = gt_canvas.getContext('webgl', {});

  gltile.shaders.init(gt_gl);

  tile0 = new gltile.Tile({
    i: 0,
    j: 0,
    k: 0,
    top: {
      color: new Float32Array([1, 1, 1, 1])
    },
    // corner_offsets_bottom: {
    //   en: new Float32Array([4, 5, 4]),
    //   es: new Float32Array([44, 55, 44]),
    //   wn: new Float32Array([444, 555, 444]),
    //   ws: new Float32Array([4444, 5555, 4444]),
    // },
    // corner_offsets_top: {
    //   en: new Float32Array([1, 2, 3]),
    //   es: new Float32Array([11, 22, 33]),
    //   wn: new Float32Array([111, 222, 333]),
    //   ws: new Float32Array([1111, 2222, 3333]),
    // },
  });
  tile1 = new gltile.Tile({
    i: 1,
    j: 1,
    k: 0,
    top: {
      color: new Float32Array([0, 1, 0, 1])
    },
    bottom: {
      color: new Float32Array([0, 1, 0, 1])
    },
    north: {
      color: new Float32Array([0, 1, 0, 1])
    },
    south: {
      color: new Float32Array([0, 1, 0, 1])
    },
    west: {
      color: new Float32Array([0, 1, 0, 1])
    },
    east: {
      color: new Float32Array([0, 1, 0, 1])
    },
  });

  rendr = new gltile.Renderer({gl: gt_gl});
  t0t = rendr.add_face(tile0, 'top');
  t0b = rendr.add_face(tile0, 'bottom');
  t0n = rendr.add_face(tile0, 'north');
  t0s = rendr.add_face(tile0, 'south');
  t0e = rendr.add_face(tile0, 'east');
  t0w = rendr.add_face(tile0, 'west');

  t1t = rendr.add_face(tile1, 'top');
  t1b = rendr.add_face(tile1, 'bottom');
  t1n = rendr.add_face(tile1, 'north');
  t1s = rendr.add_face(tile1, 'south');
  t1e = rendr.add_face(tile1, 'east');
  t1w = rendr.add_face(tile1, 'west');
  rendr.buffer_data();

  tile1.west.color = new Float32Array([1, 1, 0, 1]);
  tile1.south.color = new Float32Array([0, 1, 1, 1]);
  rendr.update_face(tile1, 'west', t1w);
  rendr.update_face(tile1, 'south', t1s);

  tile0.set_color(new Float32Array([1, 0.5, 0, 1]));
  rendr.update_face(tile0, 'top', t0t);
  rendr.update_face(tile0, 'bottom', t0b);
  rendr.update_face(tile0, 'west', t0w);
  rendr.update_face(tile0, 'east', t0e);
  rendr.update_face(tile0, 'north', t0n);
  rendr.update_face(tile0, 'south', t0s);

  var t1ws_x = 0.01;
  var t1ws_y = 0.01;

  var t0_k = 0.01;

  draw_func = function () {
    if (draw_func.kill) {
      draw_func.kill = false;
      return;
    }

    tile1.corner_offsets_top.ws[0] += t1ws_x;
    tile1.corner_offsets_top.ws[1] += t1ws_y;
    if (tile1.corner_offsets_top.ws[0] >= 0.5) {
      tile1.corner_offsets_top.ws[0] = 0.5;
      t1ws_x *= -1;
    }
    if (tile1.corner_offsets_top.ws[1] >= 0.5) {
      tile1.corner_offsets_top.ws[1] = 0.5;
      t1ws_y *= -1;
    }
    if (tile1.corner_offsets_top.ws[0] <= 0) {
      tile1.corner_offsets_top.ws[0] = 0;
      t1ws_x *= -1;
    }
    if (tile1.corner_offsets_top.ws[1] <= 0) {
      tile1.corner_offsets_top.ws[1] = 0;
      t1ws_y *= -1;
    }
    rendr.update_face(tile1, 'top', t1t);
    rendr.update_face(tile1, 'west', t1w);
    rendr.update_face(tile1, 'south', t1s);

    tile0.k += t0_k;
    if (tile0.k >= 1) {
      tile0.k = 1;
      t0_k *= -1;
    }
    if (tile0.k <= -1) {
      tile0.k = 0;
      t0_k *= -1;
    }
    rendr.update_face(tile0, 'top', t0t);
    rendr.update_face(tile0, 'bottom', t0b);
    rendr.update_face(tile0, 'west', t0w);
    rendr.update_face(tile0, 'east', t0e);
    rendr.update_face(tile0, 'north', t0n);
    rendr.update_face(tile0, 'south', t0s);

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
