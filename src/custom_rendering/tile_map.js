flatsim.TileMap = function (gl) {
  this.gl = gl;

  // TODO don't hardcode verts
  var testZ = 0;
  var farScale = 2;
  this.vert_buffer = new flatsim.VertexBuffer(gl, [
    -1,  1,  testZ, // tlnear 0
    -1, -1,  testZ, // blnear 1
     1, -1,  testZ, // brnear 2
     1,  1,  testZ,  // trnear 3

     -farScale,  farScale, testZ - (2 * farScale), // tlfar 4
     -farScale, -farScale, testZ - (2 * farScale), // blfar 5
     farScale,  farScale, testZ - (2 * farScale), // trfar 6
     farScale, -farScale, testZ - (2 * farScale), // brfar 7
  ]);
  // TODO don't hardcode faces 
  this.face_buffer = new flatsim.VertexBuffer(gl, [
    0, 1, 2, // tln-bln-brn
    0, 2, 3, // tln-brn-trn

    4, 5, 0, // tlf-blf-tln
    0, 5, 1, // tln-blf-bln

    3, 7, 6, // trn-brf-trf
    3, 2, 7, // trn-brn-brf
  ], this.gl.ELEMENT_ARRAY_BUFFER);

  this.renderer = new flatsim.TileBufferRenderer(gl);
};
flatsim.TileMap.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  renderer: null,

  update: function () {
    // this.vert_buffer.update();
    // this.face_buffer.update();
  },

  draw: function () {
    this.renderer.draw(this.vert_buffer, this.face_buffer);
  },
};
