var testcr = {
  el: null,
  gl: null,
  tile_map: null, 
  clear_color: [0.35, 0.35, 0.7, 1.0],

  _kill: false,

  onload: function () {
    this.el = document.createElement('canvas');
    this.el.width = window.innerWidth;
    this.el.height = window.innerHeight;
    document.body.appendChild(this.el);
    this.gl = this.el.getContext('webgl');
    this.gl.clearColor.apply(this.gl, this.clear_color);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    flatsim.Shaders.init(this.gl);

    this.tile_map = new flatsim.TileMap(this.gl);


    var self = this;
    this.draw_wrapper = function () {
      self.draw();
    };
    this.draw_wrapper();

    this.setup_globs();
  },

  setup_globs: function () {
    tm = this.tile_map;
    rendr = this.tile_map.renderer;
  },

  draw: function () {
    if (this._kill) {
      return;
    }

    requestAnimationFrame(this.draw_wrapper);

    // this.tile_map.update();
    this.tile_map.draw();
  },
};
window.onload = function () {
  testcr.onload();
};
