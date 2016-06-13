libscope = gltile;

test_suite = {
  test_vars: {},

  title: 'TileSection tests',

  init: function () {
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', {});
    gltile.shaders.init(gl);

    this.test_vars.tile_section_3x3x3 = new libscope.TileSection({
      renderer: new libscope.Renderer({gl: gl}),
      tiles_we: 3,
      tiles_ns: 3,
      tiles_tb: 3
    });
  },

  tests: {
    is_adjacent: {
      center_all_flush: function (test_vars) {
        var ts = test_vars.tile_section_3x3x3;
        for (var i = 0; i < libscope.Tile.faces.length; i++) {
          var face = libscope.Tile.faces[i];

          chai.expect(ts.is_adjacent_flush(1, 1, 1, face)).equals(true, 'is_adjacent(1, 1, 1, "' + face + '")');
        }
      },
    },
  },
};