var test1 = {
  tiles_ns: 4,
  tiles_we: 3,
  // tiles: [],
  // meshes: [],
  tile_grid: undefined,

  first_draw: false,
  camera_step: 0.01,
  camera_rotate_step: Math.PI / 128,

  _kill: false,
  init: function () {
    this.persp = new flatsim.TilePerspective();
    this.persp.center_x = -(this.tiles_we / 2) + 0.5;
    this.persp.center_y = -(this.tiles_ns / 2) + 0.5;
    this.textures_manager = new flatsim.TexturesManager({file_path: 'textures/1x1.png'});
    // var we, ns;
    // for (we = 0; we < this.tiles_we; we++) {
    //   this.tiles.push([]);
    //   this.meshes.push([]);
    //   for (ns = 0; ns < this.tiles_ns; ns++) {
    //     var tile = new flatsim.Tile(we, ns);
    //     var mesh = new flatsim.TileMesh(tile, this.persp, this.textures_manager);
    //     this.tiles[we].push(tile);
    //     this.meshes[we].push(mesh);
    //   }
    // }
    this.tile_grid = new flatsim.TileMeshGrid(this.tiles_we, this.tiles_ns, this.persp, this.textures_manager);
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

    // this.forEach(function (tile, mesh) {
    //   this.scene.add(mesh.group);
    // });
    this.tile_grid.add_to_scene(this.scene);

    // funzies
    this.tile_grid.get_tile(1, 1).height_top = 0.8;
    // end funzies
    // test crap
    pl = new THREE.PointLight(0xffffff, 8, 24);
    pl.position.set(13, 14, 10);
    test1.scene.add(pl);
    plB = new THREE.PointLight(0xddddff, 1, 100);
    plB.position.set(-10, -10, -10);
    test1.scene.add(plB);
    //end test crap

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '40px';
    this.stats.domElement.style.top = '40px';
    document.body.appendChild(this.stats.domElement);

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

    this.stats.begin();

    // this.forEach(function (tile, mesh) {
    //   mesh.update();
    //   tile.refresh_state();
    // });
    this.tile_grid.update();

    this.move_cam();

    this.renderer.render(this.scene, this.camera);
    this.first_draw = true;

    this.stats.end();
  },

  // forEach: function (callback, self) {
  //   if (typeof self === 'undefined') {
  //     self = this;
  //   }
  //   var we, ns;
  //   var tile, mesh;
  //   for (we = 0; we < this.tiles.length; we++) {
  //     for (ns = 0; ns < this.tiles[we].length; ns++) {
  //       tile = this.tiles[we][ns];
  //       mesh = this.meshes[we][ns];
  //       callback.apply(self, [tile, mesh]);
  //     }
  //   }
  // },

  gt: function (we, ns) {
    return this.tile_grid.get_tile(we, ns);
  },
  gm: function (we, ns) {
    return this.tile_grid.get_mesh(we, ns);
  },

  matcam: function (mat) {
    this.camera.applyMatrix(mat);
  },

  move_cam: function () {
    if (!this.first_draw) {
      return;
    }
    var mat = new THREE.Matrix4();
    if (test_controls.button_is_pressed('up')) {
      mat.makeTranslation(0, 0, this.camera_step);
    }
    if (test_controls.button_is_pressed('down')) {
      mat.makeTranslation(0, 0, -this.camera_step);
    }
    if (test_controls.button_is_pressed('left')) {
      mat.makeTranslation(-this.camera_step, 0, 0);
    }
    if (test_controls.button_is_pressed('right')) {
      mat.makeTranslation(this.camera_step, 0, 0);
    }
    if (test_controls.button_is_pressed('forward')) {
      mat.makeTranslation(0, this.camera_step, 0);
    }
    if (test_controls.button_is_pressed('backward')) {
      mat.makeTranslation(0, -this.camera_step, 0);
    }

    if (test_controls.button_is_pressed('clockwise')) {
      mat.makeRotationZ(this.camera_rotate_step);
    }
    if (test_controls.button_is_pressed('counter')) {
      mat.makeRotationZ(-this.camera_rotate_step);
    }

    this.camera.applyMatrix(mat);
  },
};
test1.init();
window.onload = function () {
  test1.onload();
  t10 = test1.gt(1,0);
  m10 = test1.gm(1,0);

  // setTimeout(function () {
    test1.tile_grid.textures.load_textures({
      id: 'box',
      file_path: 'textures/sprite_test.png',
      tiles_wide: 2,
      tiles_high: 2,
      on_finish: function () {
        t10.colors.top = 0xffffff;
        t10.textures.top = ['box', 0, 1];
        t10.colors.south = 0xffffff;
        t10.textures.south = ['box', 0, 0];
        var t = test1.gt(2, 0);
        t.colors.top = 0xffffff;
        t.textures.top = ['box', 1, 1];
        t.colors.south = 0xffffff;
        t.textures.south = ['box', 1, 0];
      }
    });
  // }, 3000);
  
  test_controls.init();
};
rotX = (new THREE.Matrix4()).makeRotationX(Math.PI / 8);
rotY = (new THREE.Matrix4()).makeRotationY(Math.PI / 8);
rotZ = (new THREE.Matrix4()).makeRotationZ(Math.PI / 8);
rotXNeg = (new THREE.Matrix4()).makeRotationX(Math.PI / -8);
rotYNeg = (new THREE.Matrix4()).makeRotationY(Math.PI / -8);
rotZNeg = (new THREE.Matrix4()).makeRotationZ(Math.PI / -8);
