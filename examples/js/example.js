window.addEventListener('load', function () {
  console.log('gltile', gltile.version);
  // TODO

  gt_canvas = document.getElementById('gltile-canvas');
  gt_canvas.width = window.innerWidth;
  gt_canvas.height = window.innerHeight;
  gt_gl = gt_canvas.getContext('webgl', {});

  gltile.shaders.init(gt_gl);

  rendr = new gltile.Renderer(gt_gl);
  rendr.vert_array.set([
    -0.5, 0.5, 0.5, // tl
    -0.5, -0.5, 0.5, // bl
    0.5, -0.5, 0.5, // br
    0.5, 0.5, 0.5 // tr
  ]);
  rendr.color_array.set([
    1.0, 1.0, 0.0, 1.0, // tl
    1.0, 1.0, 0.0, 1.0, // bl
    1.0, 1.0, 0.0, 1.0, // br
    1.0, 1.0, 0.0, 1.0 // tr
  ]);
  rendr.face_array.set([
    0, 1, 2,
    2, 3, 0
  ]);
  rendr.buffer_data();
  rendr.tile_face_count = 1;

  gt_gl.clearColor(0.0, 0.0, 0, 1.0);
  rendr.draw();
});
