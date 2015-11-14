flatsim.TilePerspective = function (options) {
  if (typeof options === 'undefined') {
    options = {};
  }

  _.extend(this, options);
};
flatsim.TilePerspective.prototype = {
  tile_dim_we: 1,
  tile_dim_ns: 1,
  tile_dim_h: 1,
  center_x: 0,
  center_y: 0,
  center_z: 0,

  scene_coord_from_tile_coord: function (coordWE, coordNS) {
    var x = this.center_x + (coordWE * this.tile_dim_we);
    var y = this.center_y + (coordNS * this.tile_dim_ns);

    return {x: x, y: y};
  },

  scene_height_from_tile_height: function (height) {
    var z = this.center_z + (height * this.tile_dim_h);
    return z;
  },

  scene_box_from_tile: function (tile) {
    var xy = this.scene_coord_from_tile_coord(tile.coord_we, tile.coord_ns);
    var topZ = this.scene_height_from_tile_height(tile.height_top);
    var botZ = this.scene_height_from_tile_height(tile.height_bottom);

    var halfWE = this.get_dim_we() / 2;
    var halfNS = this.get_dim_ns() / 2;

    var bnds = {
      top_nw: new THREE.Vector3(xy.x - halfWE, xy.y + halfNS, topZ),
      top_ne: new THREE.Vector3(xy.x + halfWE, xy.y + halfNS, topZ),
      top_se: new THREE.Vector3(xy.x + halfWE, xy.y - halfNS, topZ),
      top_sw: new THREE.Vector3(xy.x - halfWE, xy.y - halfNS, topZ),
      bot_nw: new THREE.Vector3(xy.x - halfWE, xy.y + halfNS, botZ),
      bot_ne: new THREE.Vector3(xy.x + halfWE, xy.y + halfNS, botZ),
      bot_se: new THREE.Vector3(xy.x + halfWE, xy.y - halfNS, botZ),
      bot_sw: new THREE.Vector3(xy.x - halfWE, xy.y - halfNS, botZ),
    };

    return bnds;
  },

  get_unit_box: function (heightTop, heightBottom) {
    var halfWE = this.get_dim_we() / 2;
    var halfNS = this.get_dim_ns() / 2;
    var topZ = this.scene_height_from_tile_height(heightTop);
    var botZ = this.scene_height_from_tile_height(heightBottom);

    var bnds = {
      top_nw: new THREE.Vector3(-halfWE, halfNS, topZ),
      top_ne: new THREE.Vector3(halfWE, halfNS, topZ),
      top_se: new THREE.Vector3(halfWE, -halfNS, topZ),
      top_sw: new THREE.Vector3(-halfWE, -halfNS, topZ),
      bot_nw: new THREE.Vector3(-halfWE, halfNS, botZ),
      bot_ne: new THREE.Vector3(halfWE, halfNS, botZ),
      bot_se: new THREE.Vector3(halfWE, -halfNS, botZ),
      bot_sw: new THREE.Vector3(-halfWE, -halfNS, botZ),
    };

    return bnds;
  },

  get_dim_we: function () {
    return this.tile_dim_we;
  },
  get_dim_ns: function () {
    return this.tile_dim_ns;
  },
  get_dim_h: function () {
    return this.tile_dim_h;
  },
};