flatsim.Shaders = {
  basic_vert_src: `
    attribute vec3 aVertPos;
    // attribute vec3 aVertCol;

    uniform mat4 projMat;
    uniform mat4 mvMat;

    varying lowp vec4 vVertCol;

    void main() {
      gl_Position = projMat * mvMat * vec4(aVertPos, 1.0);
      // vVertCol = aVertCol;
      vVertCol = vec4(1.0, 1.0, 0.0, 1.0);
    }
  `, // end vertex shader

  basic_frag_src: `
    varying lowp vec4 vVertCol;

    void main() {
      gl_FragColor = vec4(0.75, 1.0, 0.0, 1.0);
    }
  `, // end fragment shader

  basic_vert_shader: null,
  basic_frag_shader: null,
  basic_program: null,

  init: function (gl) {
    this.basic_vert_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.basic_vert_shader, this.basic_vert_src);
    gl.compileShader(this.basic_vert_shader);
    if (!gl.getShaderParameter(this.basic_vert_shader, gl.COMPILE_STATUS)) {
      flatsim.error(
`Can't compile vertex shader
${gl.getShaderInfoLog(this.basic_vert_shader)}
(end compile error message)`
      );
      return;
    }

    // TODO remove code duplication
    this.basic_frag_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.basic_frag_shader, this.basic_frag_src);
    gl.compileShader(this.basic_frag_shader);
    if (!gl.getShaderParameter(this.basic_frag_shader, gl.COMPILE_STATUS)) {
      flatsim.error(
`Can't compile fragment shader
${gl.getShaderInfoLog(this.basic_frag_shader)}
(end compile error message)`
      );
      return;
    }

    this.basic_program = gl.createProgram();
    gl.attachShader(this.basic_program, this.basic_vert_shader);
    gl.attachShader(this.basic_program, this.basic_frag_shader);
    gl.linkProgram(this.basic_program);

    if (!gl.getProgramParameter(this.basic_program, gl.LINK_STATUS)) {
      flatsim.error('Can\'t link basic shader program');
      return;
    }
  },
};