(function(scope) {

scope.Renderer = function (options) {
  scope.Utils.check_required(options, ['gl']);
  _.extend(this, _.defaults(options || {}, {
    face_compiler: new gltile.FaceCompiler(),
    max_faces: 1000,
  }));

  // 4 verts per tile face, 3 components per vert
  this.vert_array = new Float32Array(this.max_faces * 4 * 3);
  // 4 colors per tile face, 4 components per vert
  this.color_array = new Float32Array(this.max_faces * 4 * 4);
  // 2 faces per tile face, 3 verts per face
  this.face_array = new Uint16Array(this.max_faces * 2 * 3);

  this.vert_buffer = this.gl.createBuffer();
  this.color_buffer = this.gl.createBuffer();
  this.face_buffer = this.gl.createBuffer();

  this.init_matrices();
  this.init_shader();
};
scope.Renderer.prototype = {
  tile_face_count: 0,

  vert_array: null,
  color_array: null,
  face_array: null,

  vert_buffer: null,
  color_buffer: null,
  face_buffer: null,

  proj_mat: null,
  mv_mat: null,

  shader: null,
  vert_attrib: null,
  color_attrib: null,
  proj_mat_uni: null,

  /*****************************************************************************
   * public methods
   ****************************************************************************/

  set_face: function (tile, face, ix) {
    this.vert_array.set(this.face_compiler.get_face_verts(tile, face), ix * 4 * 3);
    var cols = scope.Utils.float32_concat(tile[face].color, tile[face].color, tile[face].color, tile[face].color);
    this.color_array.set(cols, ix * 4 * 4);
    var face_vert_ix = ix * 4;
    var faces = new Uint16Array([
      face_vert_ix + 0, face_vert_ix + 1, face_vert_ix + 2,
      face_vert_ix + 2, face_vert_ix + 3, face_vert_ix + 0
    ]);
    this.face_array.set(faces, ix * 2 * 3);
  },

  add_face: function (tile, face) {
    this.set_face(tile, face, this.tile_face_count);
    return this.tile_face_count++;
  },

  update_face: function (tile, face, ix) {
    this.set_face(tile, face, ix);

    var vert_ix = ix * 4 * 3;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buffer);
    // the offset arg is number of bytes, in a Float32Array, there are 4 bytes
    // per element, hence vert_ix * 4
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, vert_ix * 4, this.vert_array.subarray(vert_ix, vert_ix + 12));

    var color_ix = ix * 4 * 4;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
    // the offset arg is number of bytes, in a Float32Array, there are 4 bytes
    // per element, hence color_ix * 4
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, color_ix * 4, this.color_array.subarray(color_ix, color_ix + 16));
  },

  buffer_data: function () {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vert_array, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.color_array, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.face_buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.face_array, this.gl.DYNAMIC_DRAW);
  },

  reset: function () {
    this.tile_face_count = 0;
  },

  /*****************************************************************************
   * internal init helpers
   ****************************************************************************/

  init_matrices: function () {
    this.proj_mat = mat4.perspective(
      mat4.create(),
      Math.PI / 4,
      this.gl.drawingBufferWidth / this.gl.drawingBufferHeight,
      0.1,
      1000
    );

    this.mv_mat = mat4.create();
    mat4.translate(this.mv_mat, this.mv_mat, [0.0, 0.0, -6.0]);
  },

  init_shader: function () {
    this.shader = scope.shaders.simple_color_shader;
    // this.gl.useProgram(this.shader);

    this.vert_attrib = this.gl.getAttribLocation(this.shader, 'vertPos');
    this.gl.enableVertexAttribArray(this.vert_attrib);

    this.color_attrib = this.gl.getAttribLocation(this.shader, 'vertColor');
    this.gl.enableVertexAttribArray(this.color_attrib);

    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'projMat');
    this.mv_mat_uni = this.gl.getUniformLocation(this.shader, 'mvMat');
  },

  /*****************************************************************************
   * internal drawing helpers
   ****************************************************************************/

  prep_shader: function () {
    this.gl.useProgram(this.shader);

    this.gl.uniformMatrix4fv(this.proj_mat_uni, false, this.proj_mat);

    this.gl.uniformMatrix4fv(this.mv_mat_uni, false, this.mv_mat);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buffer);
    this.gl.vertexAttribPointer(this.vert_attrib, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
    this.gl.vertexAttribPointer(this.color_attrib, 4, this.gl.FLOAT, false, 0, 0);
  },

  draw: function () {
    this.prep_shader();

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.face_buffer);
    this.gl.drawElements(this.gl.TRIANGLES, this.tile_face_count * 2 * 3, this.gl.UNSIGNED_SHORT, 0);
  },
};

})(gltile);
