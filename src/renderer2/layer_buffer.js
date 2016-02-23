/*
 * base this off of TileBuffer
 * should be basically the same, but accepts norms instead of calc. them
 * and is aggregated by the render, not the other way around
 *
 * should maybe have an add and update face method
 */
flatsim.LayerBuffer = function (gl, verts, faces, colors, norms) {
  this.gl = gl;
  this.vert_buffer = new flatsim.ArrayBuffer(gl, verts);
  this.face_buffer = new flatsim.ArrayBuffer(gl, faces, gl.ELEMENT_ARRAY_BUFFER);
  this.norm_buffer = new flatsim.ArrayBuffer(gl, norms);
  this.color_buffer = new flatsim.ArrayBuffer(gl, colors, 4);
};
flatsim.LayerBuffer.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  norm_buffer: null,
  color_buffer: null,

  set_face: function (verts, faces, colors, norms, faceIx) {
    // TODO
  }
};
