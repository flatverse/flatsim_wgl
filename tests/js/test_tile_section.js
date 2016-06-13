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

          chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent(1, 1, 1, "' + face + '")');
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
            chai.expect(false).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent(1, 1, 1, "' + face + '")');
          } else {
            chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent(1, 1, 1, "' + face + '")');
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

          chai.expect(true).equals(ts.is_adjacent_flush(1, 1, 1, face), 'is_adjacent(1, 1, 1, "' + face + '")');
        }
      },

    }, // end is_adjacent category
  },
};