var test1 = {
  tiles_ns: 4,
  tiles_we: 3,
  tiles: [],
  meshes: [],

  funzies: {
    up_down_vel: 0.01
  },

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
    this.camera.position.z = 3;
    this.camera.translateY(-2.25);
    this.camera.rotateX(Math.PI / 6);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.forEach(function (tile, mesh) {
      this.scene.add(mesh.group);
    });

    // funzies
    this.tiles[1][1].color = 0x0000ff;
    this.tiles[1][1].height_top = 0.8;
    this.meshes[1][1].base_mesh.material.opacity = 0x80 / 0xff;
    this.meshes[1][1].base_mesh.material.transparent = true;
    // end funzies

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

    // var upDownTile = this.tiles[1][1];
    // upDownTile.height_top += this.funzies.up_down_vel;
    // if (upDownTile.height_top >= 2 || upDownTile.height_top <= 0.75) {
    //   this.funzies.up_down_vel = -this.funzies.up_down_vel;
    // }

    this.forEach(function (tile, mesh) {
      mesh.update();
      tile.refresh_state();
    });
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
