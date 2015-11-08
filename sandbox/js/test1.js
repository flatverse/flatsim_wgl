var test1 = {
  tiles_ns: 4,
  tiles_we: 3,
  tiles: [],
  meshes: [],

  _kill: false,
  init: function () {
    this.persp = new flatsim.TilePerspective();
    this.persp.center_x = -(this.tiles_we / 2) + 0.5;
    this.persp.center_y = -(this.tiles_ns / 2) + 0.5;
    var we, ns;
    for (we = 0; we < this.tiles_we; we++) {
      this.tiles.push([]);
      this.meshes.push([]);
      for (ns = 0; ns < this.tiles_ns; ns++) {
        var tile = new flatsim.Tile(we, ns);
        var mesh = new flatsim.TileMesh(tile, this.persp);
        this.tiles[we].push(tile);
        this.meshes[we].push(mesh);
      }
    }
  },

  onload: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.forEach(function (tile, mesh) {
      this.scene.add(mesh.group);
    });

    var self = this;
    this._drawwrapper = function () {
      self.draw();
    };
    this.draw();
  },

  draw: function () {
    if (this._kill) {
      return;
    }

    requestAnimationFrame(this._drawwrapper);
    this.renderer.render(this.scene, this.camera);
  },

  forEach: function (callback, self) {
    if (typeof self === 'undefined') {
      self = this;
    }
    var we, ns;
    var tile, mesh;
    for (we = 0; we < this.tiles.length; we++) {
      for (ns = 0; ns < this.tiles[we].length; ns++) {
        tile = this.tiles[we][ns];
        mesh = this.meshes[we][ns];
        callback.apply(self, [tile, mesh]);
      }
    }
  },

  gt: function (we, ns) {
    return this.tiles[we][ns];
  },
  gm: function (we, ns) {
    return this.meshes[we][ns];
  },
};
test1.init();
window.onload = function () {
  test1.onload();
};