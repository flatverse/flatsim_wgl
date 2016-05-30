(function (scope) {

scope.Utils = {
  float32_concat: function (arr0, arr1, optional_arrN) {
    var final_length = 0;
    for (var i = 0; i < arguments.length; i++) {
      final_length += arguments[i].length;
    }
    var offset = 0;
    var arr;
    var final_array = new Float32Array(final_length);
    for (var i = 0; i < arguments.length; i++) {
      arr = arguments[i];
      final_array.set(arr, offset);
      offset += arr.length;
    }
    return final_array;
  },

  mat_string: function (mat, columns, rows, optional_sep) {
    optional_sep = optional_sep || ' ';

    var formatted = [];
    var max_digits = 0;
    for (var i = 0; i < mat.length; i++) {
      var val = '' + Math.round(mat[i] * 100) / 100;
      formatted[i] = val;
      if (val.length > max_digits) {
        max_digits = val.length;
      }
    }

    var str = '\n';
    for (var row = 0; row < rows; row++) {
      for (var column = 0; column < columns; column++) {
        var val = formatted[(row * columns) + column];
        var pad_width = max_digits - val.length;
        for (var i = 0; i < pad_width; i++) {
          val = ' ' + val;
        }
        str += val;
        if (column < columns - 1) {
          str += optional_sep;
        }
      }
      str += '\n';
    }
    return str;
  }
};

})(window.gltile);