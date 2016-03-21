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

  add_face: function (verts, faces, colors, norms, nodeIx) {
    var node = this.face_nodes[nodeIx] || null;
    var pushFace = false;
    if (!node) {
      nodeIx = this.face_nodes.length;
      node = new flatsim.TileFaceNode(this.vert_top, this.face_top, this.color_top, this.norm_top);
      this.vert_top += verts.length / 3;
      this.face_top += faces.length / 3;
      this.color_top += colors.length / 4;
      this.norm_top += norms.length / 3;
      pushFace = true;
    }
    var i, ix;
    for (i = 0; i < verts.length / 3; i++) {
      ix = i * 3;
      this.vert_buffer.set(node.vert_start + i, verts[ix], verts[ix+1], verts[ix+2]);
    }
    for (i = 0; i < faces.length / 3; i++) {
      ix = i * 3;
      this.face_buffer.set(node.face_start + i,
        faces[ix] + node.vert_start,
        faces[ix+1] + node.vert_start,
        faces[ix+2] + node.vert_start
      );
    }
    for (i = 0; i < colors.length / 4; i++) {
      ix = i * 4;
      this.color_buffer.set(node.colors_start + i, colors[ix], colors[ix+1], colors[ix+2], colors[ix+3]);
    }
    for (i = 0; i < norms.length / 3; i++) {
      ix = i * 3;
      this.norm_buffer.set(node.norms_start + i, norms[ix], norms[ix+1], norms[ix+2]);
    }


    if (pushFace) {
      this.face_nodes.push(node);
    }
      this.vert_buffer.all_dirty = true;
      this.face_buffer.all_dirty = true;
      this.norm_buffer.all_dirty = true;
      this.color_buffer.all_dirty = true;
    return nodeIx;
  },

  update: function () {
    this.vert_buffer.update();
    this.face_buffer.update();
    this.norm_buffer.update();
    this.color_buffer.update();
  },
  
  // TODO update_verts: function (faceIx, verts)
};
