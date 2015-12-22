var flatsim.TileMap = function (gl) {
  this.vert_buffer = new flatsim.VertexBuffer(gl, 8); // TODO don't hardcode vertex count
  this.face_buffer = new flatsim.VertexBuffer(gl, 6 * 3); // TODO don't hardcode face vert count
};
flatsim.TileMap.prototype = {
  vert_buffer: null,
  face_buffer: null,

  // TODO update and draw
};