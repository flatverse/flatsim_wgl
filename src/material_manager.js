/*
* Manages materials used by tiles
*
* TODO: pool materials to create a way to request materials that won't be used
* by other objects
*/
flatsim.MaterialManager = function (texturesInfo) {
  this.materials = {};
  this.texture_loader = new THREE.TextureLoader();
  this.default_material_args = {
    id: null,
    file_path: null,
    tiles_wide: 1,
    tiles_high: 1,
    color: 0xffffff,
    material_type: THREE.MeshLambertMaterial,
    on_finish: null,
  };
  // TODO load all the textures
};
flatsim.MaterialManager.prototype = {
  materials: undefined,
  texture_loader: undefined,
  default_material_args: undefined,

  load_materials: function(materialArgs) {
    _.defaults(materialArgs, this.default_material_args);
    if (!materialArgs.id || !materialArgs.file_path) {
      throw '[flatsim][MaterialManager][load_materials] materialArgs must include the properties "id" and "file_path"';
    }

    var self = this;
    this.texture_loader.load(materialArgs.file_path, function (tex) {
      var tWidth = 1 / materialArgs.tiles_wide;
      var tHeight = 1 / materialArgs.tiles_high;
      tex.repeat.set(tWidth, tHeight);
      var mats = [];
      var i, j;
      for (i = 0; i < materialArgs.tiles_wide; i++) {
        mats[i] = [];
        for (j = 0; j < materialArgs.tiles_high; j++) {
          tex.offset.set(i * tWidth, j * tHeight);
          tex.needsUpdate = true;
          mats[i][j] = new materialArgs.material_type({map: tex, color: materialArgs.color});
          tex = tex.clone();
        }
      }
      self.materials[materialArgs.id] = mats;

      if (materialArgs.on_finish) {
        materialArgs.on_finish(mats);
      }
    });
  },
};
