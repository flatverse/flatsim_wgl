(function (scope){

scope.shaders = {
  // this is filled by the individual shader js files
  sources: {},

  init: function (gl_context) {
    var simple_vert = this.compile_src(gl_context, this.sources.simple_color_vert, gl_context.VERTEX_SHADER);
    var simple_frag = this.compile_src(gl_context, this.sources.simple_color_frag, gl_context.FRAGMENT_SHADER);

    this.simple_color_shader = gl_context.createProgram();
    gl_context.attachShader(this.simple_color_shader, simple_vert);
    gl_context.attachShader(this.simple_color_shader, simple_frag);
    gl_context.linkProgram(this.simple_color_shader);

    if (!gl_context.getProgramParameter(this.simple_color_shader, gl_context.LINK_STATUS)) {
      scope.except('Can\'t link basic shader program');
      return;
    }
  },

  compile_src: function(gl_context, src, shader_type) {
    var shader = gl_context.createShader(shader_type);
    gl_context.shaderSource(shader, src);
    gl_context.compileShader(shader);
    if (!gl_context.getShaderParameter(shader, gl_context.COMPILE_STATUS)) {
      scope.except(gl_context.getShaderInfoLog(shader), 'shaders', 'compiling_src');
    }

    return shader;
  },
};

})(window.gltile);