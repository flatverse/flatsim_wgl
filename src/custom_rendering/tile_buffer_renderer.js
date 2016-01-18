flatsim.TileBufferRenderer = function (gl) {
  this.gl = gl;

  this.init_matrices();
  this.init_shader();
};
flatsim.TileBufferRenderer.prototype = {
  gl: null,

  proj_mat: null,
  mv_mat: null,

  shader: null,
  vert_buffer_attrib: null,

  proj_mat_uni: null,
  mv_mat_uni: null,

  draw: function (vert_buffer, face_buffer) {
    this.gl.useProgram(this.shader);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.set_attribs(vert_buffer);

    this.set_uniforms();

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, face_buffer.buffer);
    this.gl.drawElements(this.gl.TRIANGLES, face_buffer.array.length, this.gl.UNSIGNED_SHORT, 0);
  },

  /*
   * init helper functions
   */
  init_shader: function () {
    this.shader = flatsim.Shaders.basic_program;
    this.gl.useProgram(this.shader);

    this.vert_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertPos');
    this.gl.enableVertexAttribArray(this.vert_buffer_attrib);

    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'projMat');
    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'mvMat');

    // mat4.identity(this.mv_mat);
  },

  init_matrices: function () {
    this.proj_mat = mat4.perspective(
      mat4.create(),
      Math.PI / 4,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.mv_mat = mat4.create();
    mat4.translate(this.mv_mat, this.mv_mat, [0.0, 0.0, -6.0]);
  },

  /*
   * drawing helper functions
   */
  set_uniforms: function () {
    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'projMat');
    this.gl.uniformMatrix4fv(this.proj_mat_uni, false, this.proj_mat);

    this.mv_mat_uni = this.gl.getUniformLocation(this.shader, 'mvMat');
    this.gl.uniformMatrix4fv(this.mv_mat_uni, false, this.mv_mat);
  },

  set_attribs: function (vert_buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vert_buffer.buffer);
    this.vert_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertPos');
    this.gl.vertexAttribPointer(this.vert_buffer_attrib, 3, this.gl.FLOAT, false, 0, 0);
  },
};
