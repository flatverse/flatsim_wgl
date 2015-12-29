var flatsim.TileMap = function (gl) {
  this.gl = gl;
  this.vert_buffer = new flatsim.VertexBuffer(gl, 4); // TODO don't hardcode vertex count
  this.face_buffer = new flatsim.VertexBuffer(gl, 2 * 3); // TODO don't hardcode face vert count
};
flatsim.TileMap.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,

  // TODO update and draw
  update: function () {
    this.vert_buffer.update();
    this.face_buffer.update();
  },

  draw: function () {

  },
};