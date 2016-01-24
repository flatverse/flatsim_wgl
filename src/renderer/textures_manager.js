/*
* Manages textures used by tiles
*/
flatsim.TexturesManager = function (baseMatArgs) {
  this.textures = {};
  this.texture_loader = new THREE.TextureLoader();
  this.default_texture_args = {
    id: null,
    file_path: null,
    tiles_wide: 1,
    tiles_high: 1,
    on_finish: null,
  };
  this.default_base_mat_args = {
    id: 'PLACEHOLDER',
    file_path: null,
    color: 0xffffff,
    type: THREE.MeshLambertMaterial,
    on_finish: null
  };
  if (typeof baseMatArgs.file_path === 'undefined') {
    throw '[flatsim][TexturesManager][init] "baseMatArgs.file_path" is a required argument.'
  }
  _.defaults(baseMatArgs, this.default_base_mat_args);
  var pTex = this.load_textures(baseMatArgs)
  this.base_mat = new baseMatArgs.type({color: baseMatArgs.color, map: pTex});

  // TODO load all the textures
};
flatsim.TexturesManager.prototype = {
  textures: undefined,
  texture_loader: undefined,
  default_texture_args: undefined,
  default_base_mat_args: undefined,
  base_mat: undefined,

  load_textures: function(textureArgs) {
    _.defaults(textureArgs, this.default_texture_args);
    if (!textureArgs.id || !textureArgs.file_path) {
      throw '[flatsim][TexturesManager][load_textures] textureArgs must include the properties "id" and "file_path"';
    }

    var self = this;
    return this.texture_loader.load(textureArgs.file_path, function (tex) {
      var tWidth = 1 / textureArgs.tiles_wide;
      var tHeight = 1 / textureArgs.tiles_high;
      tex.repeat.set(tWidth, tHeight);
      var texs = [];
      var i, j;
      for (i = 0; i < textureArgs.tiles_wide; i++) {
        texs[i] = [];
        for (j = 0; j < textureArgs.tiles_high; j++) {
          tex.offset.set(i * tWidth, j * tHeight);
          tex.needsUpdate = true;
          texs[i][j] = tex;
          tex = tex.clone();
        }
      }
      self.textures[textureArgs.id] = texs;

      if (textureArgs.on_finish) {
        textureArgs.on_finish(texs);
      }
    });
  },

  get: function (id, i, j) {
    var tex = this.textures[id];

    if (typeof tex === 'undefined') {
      throw '[flatsim][TexturesManager][load_textures] Texture "' + id + ' ['+ i + ',' + j + ']" not found.';
    }

    if (typeof i === 'undefined') {
      i = 0;
    }

    if (tex.length <= i) {
      throw '[flatsim][TexturesManager][load_textures] Texture "' + id + ' ' + i + ' ' + j + '" not found. i index is out of range';
    }

    tex = tex[i];

    if (typeof j === 'undefined') {
      j = 0;
    }

    if (tex.length <= j) {
      throw '[flatsim][TexturesManager][load_textures] Texture "' + id + ' ' + i + ' ' + j + '" not found. j index is out of range';
    }

    return tex[j];
  },

  get_or_default: function (tileTexVal) {
    if (typeof tileTexVal === 'undefined') {
      return this.base_mat.map;
    }
    return this.get.apply(this, tileTexVal);
  },
};
