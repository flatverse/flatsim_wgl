(function(scope) {

scope.Renderer = function (gl_context, options) {
  this.gl = gl_context;
  _.extend(this, _.defaults(options || {}, {
    max_faces: 1000,
  }));

  // 4 verts per tile face, 3 components per vert
  this.vert_array = new Float32Array(this.max_faces * 4 * 3);
  // 4 colors per tile face, 4 components per vert
  this.color_array = new Float32Array(this.max_faces * 4 * 4);
  // 2 faces per tile face, 3 verts per face
  this.face_array = new Float32Array(this.max_faces * 2 * 3);

  this.vert_buffer = this.gl.createBuffer();
  this.color_buffer = this.gl.createBuffer();
  this.face_buffer = this.gl.createBuffer();
};
scope.Renderer.prototype = {
  vert_array: null,
  color_array: null,
  face_array: null,

  vert_buffer: null,
  color_buffer: null,
  face_buffer: null,

  buffer_data: function () {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vert_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vert_array, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.color_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.color_array, this.gl.DYNAMIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.face_buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.face_array, this.gl.DYNAMIC_DRAW);
  },
};

})(gltile);
