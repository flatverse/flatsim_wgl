flatsim.TileBufferRenderer = function (gl) {
  this.gl = gl;

  this.init_matrices();
  this.init_shader();
};
flatsim.TileBufferRenderer.prototype = {
  gl: null,

  proj_mat: null,
  mv_mat: null,
  norm_mat: null,
  // TODO: move this out
  light_pos: new Float32Array([-2, 2, 4]),
  amb_color: new Float32Array([0.3, 0.3, 0.3, 0.0]),

  shader: null,
  vert_buffer_attrib: null,
  norm_buffer_attrib: null,
  color_buffer_attrib: null,

  proj_mat_uni: null,
  mv_mat_uni: null,
  norm_mat_uni: null,
  light_pos_uni: null,
  amb_color_uni: null,

  draw: function (vert_buffer, face_buffer, norm_buffer, color_buffer) {
    this.gl.useProgram(this.shader);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.set_attribs(vert_buffer, norm_buffer, color_buffer);

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
    this.norm_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertNorm');
    this.gl.enableVertexAttribArray(this.norm_buffer_attrib);
    this.color_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertColor');
    this.gl.enableVertexAttribArray(this.color_buffer_attrib);

    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'projMat');
    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'mvMat');
    this.norm_mat_uni = this.gl.getUniformLocation(this.shader, 'normMat');
    this.light_pos_uni = this.gl.getUniformLocation(this.shader, 'lightPosition');
    this.amb_color_uni = this.gl.getUniformLocation(this.shader, 'ambientColor');
  },

  init_matrices: function () {
    this.proj_mat = mat4.perspective(
      mat4.create(),
      Math.PI / 4,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.mv_mat = mat4.create();
    mat4.translate(this.mv_mat, this.mv_mat, [0.0, 0.0, -6.0]);
    this.norm_mat = mat3.normalFromMat4(mat3.create(), this.mv_mat);
  },

  /*
   * drawing helper functions
   */
  set_uniforms: function () {

    this.proj_mat_uni = this.gl.getUniformLocation(this.shader, 'projMat');
    this.gl.uniformMatrix4fv(this.proj_mat_uni, false, this.proj_mat);

    this.mv_mat_uni = this.gl.getUniformLocation(this.shader, 'mvMat');
    this.gl.uniformMatrix4fv(this.mv_mat_uni, false, this.mv_mat);

    mat3.normalFromMat4(this.norm_mat, this.mv_mat);
    this.mv_mat_uni = this.gl.getUniformLocation(this.shader, 'normMat');
    this.gl.uniformMatrix3fv(this.norm_mat_uni, false, this.norm_mat);

    this.light_pos_uni = this.gl.getUniformLocation(this.shader, 'lightPosition');
    this.gl.uniform3fv(this.light_pos_uni, this.light_pos);

    this.amb_color_uni = this.gl.getUniformLocation(this.shader, 'ambientColor');
    this.gl.uniform4fv(this.amb_color_uni, this.amb_color);
  },

  set_attribs: function (vert_buffer, norm_buffer, color_buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vert_buffer.buffer);
    this.vert_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertPos');
    this.gl.vertexAttribPointer(this.vert_buffer_attrib, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, norm_buffer.buffer);
    this.norm_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertNorm');
    this.gl.vertexAttribPointer(this.norm_buffer_attrib, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, color_buffer.buffer);
    this.color_buffer_attrib = this.gl.getAttribLocation(this.shader, 'aVertColor');
    this.gl.vertexAttribPointer(this.color_buffer_attrib, 4, this.gl.FLOAT, false, 0, 0);
  },
};
