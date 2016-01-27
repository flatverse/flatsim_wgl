flatsim.TileMapMesh = function (gl, tileMap) {
  this.gl = null;
  this.tile_map = tileMap;

  flatsim.log('building node graph');
  this.nodes = this.build_node_graph();

  flatsim.log('building buffer vals');
  var bufferVals = this.build_buffer_vals();
  flatsim.log('building map geo');
  this.tile_map_geo = new flatsim.TileMapGeo(
    gl,
    bufferVals.verts,
    bufferVals.faces,
    bufferVals.colors
  );
};
flatsim.TileMapMesh.prototype = {
  gl: null,
  tile_map: null,
  tile_map_geo: null,

  nodes: null,

  draw: function () {
    this.tile_map_geo.draw();
  },

  build_node_graph: function () {
    var persp = this.tile_map.persp;
    var nodes = [];
    var cur, westOf, northOf, we, ns;
    for (we = 0; we < this.tile_map.get_tiles_we(); we++) {
      nodes[we] = [];
      for (ns = 0; ns < this.tile_map.get_tiles_ns(); ns++) {
        cur = new flatsim.TileNode(this.tile_map.get(we, ns), persp);
        nodes[we][ns] = cur;
        if (we > 0) {
          cur.west = nodes[we - 1][ns];
          cur.west.east = cur;
        }
        if (ns > 0) {
          cur.north = nodes[we][ns - 1];
          cur.north.south = cur;
        }
      }
    }
    return nodes;
  },

  build_buffer_vals: function () {
    var persp = this.tile_map.persp;
    var verts_arr = [];
    var faces_arr = [];
    var colors_arr = [];
    // TODO supply vert norms
    // var norms_arr = [];
    var vertIx = 0;
    var we, ns, tileInfo;
    for (we = 0; we < this.tile_map.get_tiles_we(); we++) {
      for (ns = 0; ns < this.tile_map.get_tiles_ns(); ns++) {
        tileInfo = this.nodes[we][ns].build_all_faces(vertIx);
        verts_arr = verts_arr.concat(tileInfo.verts);
        faces_arr = faces_arr.concat(tileInfo.faces);
        colors_arr = colors_arr.concat(tileInfo.colors);
        vertIx += tileInfo.verts.length / 3;
      }
    }

    return {
      verts: verts_arr,
      faces: faces_arr,
      colors: colors_arr,
    };
  },
};
