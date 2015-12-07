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
  this.default_materials = {
    top: new this.default_material_args.material_type({color: 0x77ff00}),
    bottom: new this.default_material_args.material_type({color: 0x675B54}),
    north: new this.default_material_args.material_type({color: 0x675B54}),
    east: new this.default_material_args.material_type({color: 0x675B54}),
    south: new this.default_material_args.material_type({color: 0x675B54}),
    west: new this.default_material_args.material_type({color: 0x675B54}),
  };
  // TODO load all the textures
};
flatsim.MaterialManager.prototype = {
  materials: undefined,
  texture_loader: undefined,
  default_material_args: undefined,
  default_materials: undefined,

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
          mats[i][j] = new materialArgs.material_type({map: tex, color: materialArgs.color, name: materialArgs.id + '_' + i + '_' + j});
          tex = tex.clone();
        }
      }
      self.materials[materialArgs.id] = mats;

      if (materialArgs.on_finish) {
        materialArgs.on_finish(mats);
      }
    });
  },

  get_default: function (side) {
    return this.default_materials[side];
  },
  get: function (id, i, j) {
    var mat = this.materials[id];

    if (typeof mat === 'undefined') {
      throw '[flatsim][MaterialManager][load_materials] Material "' + id + ' ['+ i + ',' + j + ']" not found.';
    }

    if (typeof i === 'undefined') {
      i = 0;
    }

    if (mat.length <= i) {
      throw '[flatsim][MaterialManager][load_materials] Material "' + id + ' ' + i + ' ' + j + '" not found. i index is out of range';
    }

    mat = mat[i];

    if (typeof j === 'undefined') {
      j = 0;
    }

    if (mat.length <= j) {
      throw '[flatsim][MaterialManager][load_materials] Material "' + id + ' ' + i + ' ' + j + '" not found. j index is out of range';
    }

    return mat[j];
  },
  get_material_or_default: function (getArgs, side) {
    if (typeof getArgs === 'undefined') {
      return this.get_default(side);
    }
    return this.get.apply(this, getArgs);
  },
};
