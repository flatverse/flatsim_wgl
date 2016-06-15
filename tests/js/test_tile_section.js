libscope = gltile;

test_suite = {
  test_vars: {},

  title: 'TileSection tests',

  init: function () {
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', {});
    gltile.shaders.init(gl);

    this.test_vars.gl = gl;
  },

  /*
  * NOTE:
  * These tests test multiple faces and should probably be split up into
  * multiple tests. Currently I am the only developer and am trying to save a
  * bit of time by putting tests in loops. Shame on me.
  */
  tests: {
    is_adjacent: {
      "center, all flush": function (test_vars) {
        var ts = new libscope.TileSection({
          renderer: new libscope.Renderer({gl: test_vars.gl}),
          tiles_we: 3,
          tiles_ns: 3,
          tiles_tb: 3
        });
        for (var i = 0; i < libscope.Tile.faces.length; i++) {
          var face = libscope.Tile.faces[i];

          chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent_flush(1, 1, 1, "' + face + '")');
        }
      },

      "center, wnt corner offset, west north top not flush": function (test_vars) {
        var ts = new libscope.TileSection({
          renderer: new libscope.Renderer({gl: test_vars.gl}),
          tiles_we: 3,
          tiles_ns: 3,
          tiles_tb: 3
        });
        ts.get_tile(1, 1, 1).corner_offsets.wnt = new Float32Array([-0.2, 0.1, 0.25]);
        for (var i = 0; i < libscope.Tile.faces.length; i++) {
          var face = libscope.Tile.faces[i];

          if (face === 'west' || face === 'north' || face === 'top') {
            chai.expect(false).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent_flush(1, 1, 1, "' + face + '")');
          } else {
            chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent_flush(1, 1, 1, "' + face + '")');
          }
        }
      },

      "center, wnt corner offset, all flush": function (test_vars) {
        var ts = new libscope.TileSection({
          renderer: new libscope.Renderer({gl: test_vars.gl}),
          tiles_we: 3,
          tiles_ns: 3,
          tiles_tb: 3
        });
        ts.get_tile(1, 1, 1).corner_offsets.wnt = new Float32Array([-0.2, 0.1, 0.25]);

        // same tb level (1)
        ts.get_tile(0, 1, 1).corner_offsets.ent = new Float32Array([-0.2, 0.1, 0.25]);
        ts.get_tile(0, 2, 1).corner_offsets.est = new Float32Array([-0.2, 0.1, 0.25]);
        ts.get_tile(1, 2, 1).corner_offsets.wst = new Float32Array([-0.2, 0.1, 0.25]);
        // above tb level (2)
        ts.get_tile(1, 1, 2).corner_offsets.wnb = new Float32Array([-0.2, 0.1, 0.25]);
        ts.get_tile(0, 1, 2).corner_offsets.enb = new Float32Array([-0.2, 0.1, 0.25]);
        ts.get_tile(0, 2, 2).corner_offsets.esb = new Float32Array([-0.2, 0.1, 0.25]);
        ts.get_tile(1, 2, 2).corner_offsets.wsb = new Float32Array([-0.2, 0.1, 0.25]);

        for (var i = 0; i < libscope.Tile.faces.length; i++) {
          var face = libscope.Tile.faces[i];

          chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent_flush(1, 1, 1, "' + face + '")');
        }
      },

      "edges not adjacent": function (test_vars) {
        var ts = new libscope.TileSection({
          renderer: new libscope.Renderer({gl: test_vars.gl}),
          tiles_we: 3,
          tiles_ns: 3,
          tiles_tb: 3
        });

        // top
        for (var we = 0; we < ts.tiles.length; we++) {
          for (var sn = 0; sn < ts.tiles[we].length; sn++) {
            chai.expect(false).equals(ts.is_adjacent_flush(we, sn, 2, 'top'), 'is_adjacent_flush(' + we + ', ' + sn + ', 2, "top")');
          }
        }
        // bottom
        for (var we = 0; we < ts.tiles.length; we++) {
          for (var sn = 0; sn < ts.tiles[we].length; sn++) {
            chai.expect(false).equals(ts.is_adjacent_flush(we, sn, 0, 'bottom'), 'is_adjacent_flush(' + we + ', ' + sn + ', 0, "bottom")');
          }
        }
        // west
        for (var sn = 0; sn < ts.tiles[0].length; sn++) {
          for (var tb = 0; tb < ts.tiles[0][sn].length; tb++) {
            chai.expect(false).equals(ts.is_adjacent_flush(0, sn, tb, 'west'), 'is_adjacent_flush(0, ' + sn + ', ' + tb + ', "west")');
          }
        }
        // east
        for (var sn = 0; sn < ts.tiles[0].length; sn++) {
          for (var tb = 0; tb < ts.tiles[0][sn].length; tb++) {
            chai.expect(false).equals(ts.is_adjacent_flush(2, sn, tb, 'east'), 'is_adjacent_flush(2, ' + sn + ', ' + tb + ', "east")');
          }
        }
        // north
        for (var we = 0; we < ts.tiles.length; we++) {
          for (var tb = 0; tb < ts.tiles[we][2].length; tb++) {
            chai.expect(false).equals(ts.is_adjacent_flush(we, 2, tb, 'north'), 'is_adjacent_flush(' + we + ', 2, ' + tb + ', "north")');
          }
        }
        // south
        for (var we = 0; we < ts.tiles.length; we++) {
          for (var tb = 0; tb < ts.tiles[we][0].length; tb++) {
            chai.expect(false).equals(ts.is_adjacent_flush(we, 0, tb, 'south'), 'is_adjacent_flush(' + we + ', 2, ' + tb + ', "south")');
          }
        }
      },

    }, // end is_adjacent category

    add_tile: {
      "wnt corner node check": function (test_vars) {
        var ts = new libscope.TileSection({
          renderer: new libscope.Renderer({gl: test_vars.gl}),
          tiles_we: 3,
          tiles_ns: 3,
          tiles_tb: 3
        });

        ts.add_tile(0, 2, 2);

        var node = ts.get_node(0, 2, 2);

        chai.expect(null).equals(node.bottom, 'add_tile(0, 2, 2) bottom should be null');
        chai.expect(null).equals(node.east, 'add_tile(0, 2, 2) east should be null');
        chai.expect(null).equals(node.south, 'add_tile(0, 2, 2) south should be null');

        chai.expect('number').equals(typeof node.top, 'add_tile(0, 2, 2) top should be a number');
        chai.expect('number').equals(typeof node.west, 'add_tile(0, 2, 2) west should be a number');
        chai.expect('number').equals(typeof node.north, 'add_tile(0, 2, 2) north should be a number');
      },
    }, // end add_tile category

    get_tiles_we: {

      "length 2": function (test_vars) {
        var ts222 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 2,
          tiles_ns: 2,
          tiles_tb: 2,
        });
        chai.expect(2).equals(ts222.get_tiles_we(), 'expted 2 tiles we for 2x2x2');

        var ts211 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 2,
          tiles_ns: 1,
          tiles_tb: 1,
        });
        chai.expect(2).equals(ts211.get_tiles_we(), 'expted 2 tiles we for 2x1x1');
      },

      "length 1": function (test_vars) {
        var ts111 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 1,
          tiles_ns: 1,
          tiles_tb: 1,
        });
        chai.expect(1).equals(ts111.get_tiles_we(), 'expted 1 tiles we for 1x1x1');
      },

      "length 0": function (test_vars) {
        var ts000 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 0,
          tiles_ns: 0,
          tiles_tb: 0,
        });
        chai.expect(0).equals(ts000.get_tiles_we(), 'expted 0 tiles we for 0x0x0');
      },
    }, // end get_tiles_we category

    get_tiles_sn: {

      "length 2": function (test_vars) {
        var ts222 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 2,
          tiles_ns: 2,
          tiles_tb: 2,
        });
        chai.expect(2).equals(ts222.get_tiles_sn(), 'expted 2 tiles sn for 2x2x2');

        var ts121 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 1,
          tiles_ns: 2,
          tiles_tb: 1,
        });
        chai.expect(2).equals(ts121.get_tiles_sn(), 'expted 2 tiles sn for 1x2x1');
      },

      "length 1": function (test_vars) {
        var ts111 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 1,
          tiles_ns: 1,
          tiles_tb: 1,
        });
        chai.expect(1).equals(ts111.get_tiles_sn(), 'expted 1 tiles sn for 1x1x1');
      },

      "length 0": function (test_vars) {
        var ts000 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 0,
          tiles_ns: 0,
          tiles_tb: 0,
        });
        chai.expect(0).equals(ts000.get_tiles_sn(), 'expted 0 tiles sn for 0x0x0');
      },
    }, // end get_tiles_sn category

    get_tiles_bt: {

      "length 2": function (test_vars) {
        var ts222 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 2,
          tiles_ns: 2,
          tiles_tb: 2,
        });
        chai.expect(2).equals(ts222.get_tiles_bt(), 'expted 2 tiles bt for 2x2x2');

        var ts112 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 1,
          tiles_ns: 1,
          tiles_tb: 2,
        });
        chai.expect(2).equals(ts112.get_tiles_bt(), 'expted 2 tiles bt for 1x1x2');
      },

      "length 1": function (test_vars) {
        var ts111 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 1,
          tiles_ns: 1,
          tiles_tb: 1,
        });
        chai.expect(1).equals(ts111.get_tiles_bt(), 'expted 1 tiles bt for 1x1x1');
      },

      "length 0": function (test_vars) {
        var ts000 = new libscope.TileSection({
          renderer: new libscope.Renderer({ gl: test_vars.gl}),
          tiles_we: 0,
          tiles_ns: 0,
          tiles_tb: 0,
        });
        chai.expect(0).equals(ts000.get_tiles_sn(), 'expted 0 tiles sn for 0x0x0');
      },
    }, // end get_tiles_bt category

  },
};
