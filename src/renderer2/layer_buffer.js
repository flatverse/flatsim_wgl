/*
 * base this off of TileBuffer
 * should be basically the same, but accepts norms instead of calc. them
 * and is aggregated by the render, not the other way around
 *
 * should maybe have an add and update face method
 */
flatsim.LayerBuffer = function (gl, verts, faces, colors, norms, name) {
  this.name = name;
  this.gl = gl;

  this.vert_buffer = new flatsim.ArrayBuffer(gl, verts);
  this.vert_buffer.name = (name || '') + '_verts';

  this.face_buffer = new flatsim.ArrayBuffer(gl, faces, gl.ELEMENT_ARRAY_BUFFER);
  this.face_buffer.name = (name || '') + '_faces';

  this.norm_buffer = new flatsim.ArrayBuffer(gl, norms);
  this.norm_buffer.name = (name || '') + '_norms';

  this.color_buffer = new flatsim.ArrayBuffer(gl, colors, gl.ARRAY_BUFFER, 4);
  this.color_buffer.name = (name || '') + '_colors';

  this.face_nodes = [];
};
flatsim.LayerBuffer.prototype = {
  name: null,
  gl: null,
  vert_buffer: null,
  face_buffer: null,
  norm_buffer: null,
  color_buffer: null,

  face_nodes: null,
  vert_top: 0,
  face_top: 0,
  color_top: 0,
  norm_top: 0,

  add_face: function (verts, faces, colors, norms) {
    var node = new flatsim.TileFaceNode(this.vert_top, this.face_top, this.color_top, this.norm_top);

    var i, ix;
    for (i = 0; i < verts.length / 3; i++) {
      this.vert_buffer.set(this.vert_top, verts[i], verts[i+1], verts[i+2]);
      this.vert_top++;
    }
    for (i = 0; i < faces.length / 3; i++) {
      ix = i * 3;
      this.face_buffer.set(this.face_top,
        faces[ix] + node.vert_start,
        faces[ix+1] + node.vert_start,
        faces[ix+2] + node.vert_start
      );
      this.face_top++;
    }
    for (i = 0; i < colors.length / 4; i++) {
      this.color_buffer.set(this.color_top, colors[i], colors[i+1], colors[i+2], colors[i+3]);
      this.color_top++;
    }
    for (i = 0; i < norms.length / 3; i++) {
      this.norm_buffer.set(this.norm_top, norms[i], norms[i+1], norms[i+2]);
      this.norm_top++;
    }

    this.face_nodes.push(node);
    return this.face_nodes.length - 1;
  },

  update: function () {
    this.vert_buffer.update();
    this.face_buffer.update();
    this.norm_buffer.update();
    this.color_buffer.update();
  },
  
  // TODO update_verts: function (faceIx, verts)
};
