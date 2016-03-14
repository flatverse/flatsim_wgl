/*
 * like the old one, but keeps track of a face index from layerBuffer
 */
flatsim.TileNode = function (tile, tilePersp, layerBuffer) {
  this.tile = tile;
  this.persp = tilePersp;
  this.buffer = layerBuffer;
};
flatsim.TileNode.prototype = {
  tile: null,
  persp: null,
  buffer: null,

  face_nodes: {
    west: null,
    north: null,
    east: null,
    south: null,
    top: null,
    bottom: null,
  },

  normals: {
    west: [-1, 0, 0],
    north: [0, 1, 0],
    east: [1, 0, 0],
    south: [0, -1, 0],
    top: [0, 0, 1],
    bottom: [0, 0, -1],
  },

  face_order: [
    0, 1, 2,
    2, 3, 0,
  ],

  build_faces: function () {
    var bnds = this.persp.scene_box_from_tile(this.tile);

    var dir;
    for (dir in this.face_nodes) {
      this.build_face(dir, bnds);
    }
  },

  build_face: function (dir, bnds) {
    bnds = bnds || this.persp.scene_box_from_tile(this.tile);

    var verts = _.flatten(this.vert_funcs[dir](bnds));
    var faces = this.face_order;
    var colors = [
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
      0.0, 1.0, 0.5, 1.0,
    ];
    var norms = this.get_norm(dir, 4);

    this.face_nodes[dir] = this.buffer.add_face(verts, faces, colors, norms);
  },

  get_verts_from_bnds: function(dir, bnds) {
    return this.vert_funcs[dir](bnds);
  },

  vert_funcs: {
    west: function (bnds) {
      return [
        bnds.top_nw, bnds.bot_nw,
        bnds.bot_sw, bnds.top_sw,
      ];
    },
    north: function (bnds) {
      return [
        bnds.top_ne, bnds.bot_ne,
        bnds.bot_nw, bnds.top_nw,
      ];
    },
    east: function (bnds) {
      return [
        bnds.top_se, bnds.bot_se,
        bnds.bot_ne, bnds.top_ne,
      ];
    },
    south: function (bnds) {
      return [
        bnds.top_sw, bnds.bot_sw,
        bnds.bot_se, bnds.top_se,
      ];
    },
    top: function (bnds) {
      return [
        bnds.top_nw, bnds.top_sw,
        bnds.top_se, bnds.top_ne,
      ];
    },
    bottom: function (bnds) {
      return [
        bnds.bot_ne, bnds.bot_se,
        bnds.bot_sw, bnds.bot_nw,
      ];
    }
  },

  get_norm: function (dir, vertCount) {
    var template = this.normals[dir];
    var arr = [];
    for (var i = 0; i < vertCount; i++) {
      arr.push(template[0]);
      arr.push(template[1]);
      arr.push(template[2]);
    }
    return arr;
  },
};

flatsim.TileNode.directions = [
  'west',
  'north',
  'east',
  'south',
  'top',
  'bottom'
];
