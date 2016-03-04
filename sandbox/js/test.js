var testcr = {
  el: null,
  gl: null,
  tile_persp: null,
  tile_map: null,
  tile_layer: null, 
  clear_color: [0.35, 0.35, 0.7, 1.0],

  stats: null,

  _kill: false,
  _first_draw: false,

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

    // this.tile_persp = new flatsim.TilePerspective({});
    // this.tile_map = new flatsim.TileMap(this.tile_persp, 1, 1);
    // this.tile_layer = new flatsim.TileLayer(this.gl, this.tile_map);
  
    persp = new flatsim.TilePerspective();
    lbuff = new flatsim.LayerBuffer(this.gl, 4*6*3, 6*3, 4*6*4, 4*6*3);
    t = new flatsim.Tile(1, 1, {});
    tnode = new flatsim.TileNode(t, persp, lbuff);
    tnode.build_faces();
    // tlayer = new flatsim.TileLayer(this.gl);
    this.renderer = new flatsim.TileBufferRenderer(this.gl, lbuff); 
    mvMat = this.renderer.mv_mat;


    var self = this;
    this.draw_wrapper = function () {
      self.draw();
    };
    this.draw_wrapper();

    // this.setup_globs();
  },

  setup_globs: function () {
    tm = this.tile_map;
    t0 = this.tile_map.get(0, 0);
    tl = this.tile_layer;
    tn0 = tl.get_node(0, 0);
    tb = this.tile_layer.tile_buffer;
    rendr = tb.renderer;
    projMat = rendr.proj_mat;
    mvMat = rendr.mv_mat;
  },

  draw: function () {
    if (this._kill) {
      return;
    }

    requestAnimationFrame(this.draw_wrapper);

    if (!this.stats) {
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0';
      document.body.appendChild(this.stats.domElement);
    }
    this.stats.begin();

    // if (!this._first_draw) {
    //   flatsim.log('pre draw');
    // }
    // this.tile_layer.update();
    // this.tile_layer.update();
    // this.tile_layer.draw();
    this.renderer.draw();

    if (!this._first_draw) {
      this._first_draw = true;
      // flatsim.log('post draw');
    } else {
      // TEST CODE
      transZ(-1);
    }

    this.stats.end();
  },
};
window.onload = function () {
  flatsim.log('onload');
  testcr.onload();
  flatsim.log('post onload');
  rotX(Math.PI * 7 / 64);
};

var transX = function (val) {
  mat4.translate(mvMat, mvMat, new Float32Array([val, 0, 0]));
};
var transY = function (val) {
  mat4.translate(mvMat, mvMat, new Float32Array([0, val, 0]));
};
var transZ = function (val) {
  mat4.translate(mvMat, mvMat, new Float32Array([0, 0, val]));
};
var rotX = function (val) {
  mat4.rotateX(mvMat, mvMat, val);
}
var rotY = function (val) {
  mat4.rotateY(mvMat, mvMat, val);
}
var rotZ = function (val) {
  mat4.rotateZ(mvMat, mvMat, val);
}
