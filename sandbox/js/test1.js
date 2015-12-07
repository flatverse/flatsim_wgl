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
    this.mat_manager = new flatsim.MaterialManager();
    var we, ns;
    for (we = 0; we < this.tiles_we; we++) {
      this.tiles.push([]);
      this.meshes.push([]);
      for (ns = 0; ns < this.tiles_ns; ns++) {
        var tile = new flatsim.Tile(we, ns);
        var mesh = new flatsim.TileMesh(tile, this.persp, this.mat_manager);
        this.tiles[we].push(tile);
        this.meshes[we].push(mesh);
      }
    }
  },

  onload: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 3;
    this.camera.translateY(-3);
    this.camera.rotateX(Math.PI / 4);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.forEach(function (tile, mesh) {
      this.scene.add(mesh.group);
    });

    // funzies
    this.tiles[1][1].height_top = 0.8;
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

    this.forEach(function (tile, mesh) {
      mesh.update();
      tile.refresh_state();
    });

    // test crap
    pl = new THREE.PointLight(0xffffff, 8, 24);
    pl.position.set(13, 14, 10);
    test1.scene.add(pl);
    plB = new THREE.PointLight(0xddddff, 1, 100);
    plB.position.set(-10, -10, -10);
    test1.scene.add(plB);
    //end test crap

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

  matcam: function (mat) {
    this.camera.applyMatrix(mat);
  },
};
test1.init();
window.onload = function () {
  test1.onload();
  t10 = test1.gt(1,0);
  m10 = test1.gm(1,0);

  test1.mat_manager.load_materials({
    id: 'box',
    file_path: 'textures/sprite_test.png',
    tiles_wide: 2,
    tiles_high: 2,
    on_finish: function () {
      t10.materials.top = ['box', 1, 1];
    }
  });
};
rotX = (new THREE.Matrix4()).makeRotationX(Math.PI / 8);
rotY = (new THREE.Matrix4()).makeRotationY(Math.PI / 8);
rotZ = (new THREE.Matrix4()).makeRotationZ(Math.PI / 8);
rotXNeg = (new THREE.Matrix4()).makeRotationX(Math.PI / -8);
rotYNeg = (new THREE.Matrix4()).makeRotationY(Math.PI / -8);
rotZNeg = (new THREE.Matrix4()).makeRotationZ(Math.PI / -8);
