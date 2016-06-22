(function (scope) {

scope.Utils = {
  check_required: function (options, req_list, class_trace) {
    if (typeof options !== 'object') {
      scope.throw_error.apply(scope, ['missing options object'].concat(class_trace));
    }
    for (var i = 0; i < req_list.length; i++) {
      var req = req_list[i];

      if (Array.isArray(req)) {
        var found_req = false;
        for (var j = 0; j < req.length; j++) {
          console.log(req[j], req[j] in options);
          if (req[j] in options) {
            // scope.throw_error.apply(scope, [req.join(' or ') + ' is a required field'].concat(class_trace));
            found_req = true;
            console.log('found_req', found_req);
            continue;
          }
        }
        if (!found_req) {
          scope.throw_error.apply(scope, [req.join(' or ') + ' is a required field'].concat(class_trace));
        }
      } else if (!(req in options)) {
        scope.throw_error.apply(scope, [req + ' is a required field'].concat(class_trace));
      }
    }
  },

  remove_init_only_options: function (options, init_only_list) {
    for (var i = 0; i < init_only_list.length; i++) {
      delete options[init_only_list[i]];
    }
  },

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
