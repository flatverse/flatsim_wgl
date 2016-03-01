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

  this.face_ptrs = [];
};
flatsim.LayerBuffer.prototype = {
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  norm_buffer: null,
  color_buffer: null,

  face_nodes: null,
  vert_top: 0,
  faces_top: 0,
  colors_top: 0,
  norms_top: 0,

  add_face: function (verts, faces, colors, norms) {
    var node = new TileFaceNode(this.vert_top, this.faces_top, this.colors_top, this.norms_top);

    var i;
    for (i = 0; i < verts.length / 3; i++) {
      this.vert_buffer.set(this.vert_top, verts[i], verts[i+1], verts[i+2]);
      this.vert_top++;
    }
    for (i = 0; i < faces.length / 3; i++) {
      this.face_buffer.set(this.face_top,
        faces[i] + node.vert_Start,
        faces[i+1] + node.vert_Start,
        faces[i+2] + node.vert_Start,
      );
      this.faces_top++;
    }
    for (i = 0; i < colors.length / 3; i++) {
      this.colors_buffer.set(this.colors_top, colors[i], colors[i+1], colors[i+2]);
      this.colors_top++;
    }
    for (i = 0; i < norms.length / 3; i++) {
      this.norms_buffer.set(this.norms_top, norms[i], norms[i+1], norms[i+2]);
      this.norms_top++;
    }

    this.face_nodes.push(node);
    return this.face_nodes.length - 1;
  },
  
  // TODO update_verts: function (faceIx, verts)
};
