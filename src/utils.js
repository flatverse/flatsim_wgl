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
};

})(window.gltile);