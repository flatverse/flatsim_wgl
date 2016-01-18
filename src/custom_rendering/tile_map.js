flatsim.TileMap = function (gl) {
  this.gl = gl;

  // TODO don't hardcode verts
  this.vert_buffer = new flatsim.VertexBuffer(gl, [
    -1,  1,  0, // tl
    -1, -1,  0, // bl
     1, -1,  0, // br
     1,  1,  0  // tr

    // -1,  1,  0, // tl
    // -1, -1,  0, // bl
    //  1, -1,  0, // br

    // -1,  1,  0, // tl
    //  1, -1,  0, // br
    //  1,  1,  0  // tr
  ]);
  this.face_buffer = new flatsim.VertexBuffer(gl, [
    0, 1, 2, // tl-bl-br
    0, 2, 3,  // tl-br-tr

    0, 2, 1, // tl-br-bl
    0, 3, 2  // tl-tr-br
  ], this.gl.ELEMENT_ARRAY_BUFFER);

  this.renderer = new flatsim.TileBufferRenderer(gl);

  // test code TODO don't hardcode this
  // this.vert_buffer.set(0,  -1, 1, -1); // tl
  // this.vert_buffer.set(1,  -1, -1, -1); // bl
  // this.vert_buffer.set(2,  1, -1, -1); // br
  // this.vert_buffer.set(3,  1, 1, -1); // tr

  // this.face_buffer.set(0,  0, 1, 2); // tl-bl-br
  // this.face_buffer.set(1,  0, 2, 3); // tl-br-tr
};
flatsim.TileMap.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  renderer: null,

  update: function () {
    this.vert_buffer.update();
    this.face_buffer.update();
  },

  draw: function () {
    this.renderer.draw(
      this.vert_buffer.buffer,
      this.face_buffer.buffer,
      this.face_buffer.get_vert_count()
    );
  },
};
