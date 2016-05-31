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
  });

  var z1 = -60.0;
  var z2 = -60.04;
  rendr = new gltile.Renderer({gl: gt_gl});
  t_builder = new gltile.TileBuilder();

  rendr.vert_array.set(t_builder.get_face_verts(tile0, 'top'));
  rendr.vert_array.set(t_builder.get_face_verts(tile1, 'top'), 12);
  rendr.color_array.set([
    1.0, 1.0, 0.0, 1.0, // tl
    1.0, 1.0, 0.0, 1.0, // bl
    1.0, 1.0, 0.0, 1.0, // br
    1.0, 1.0, 0.0, 1.0, // tr

    0.0, 1.0, 0.0, 1.0, // tl
    0.0, 1.0, 0.0, 1.0, // bl
    0.0, 1.0, 0.0, 1.0, // br
    0.0, 1.0, 0.0, 1.0 // tr
  ]);
  rendr.face_array.set([
    0, 1, 2,
    2, 3, 0,

    4, 5, 6,
    6, 7, 4
  ]);
  rendr.buffer_data();
  rendr.tile_face_count = 2;

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
