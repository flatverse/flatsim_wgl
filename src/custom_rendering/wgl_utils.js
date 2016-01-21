// TODO when this branch gets merged into master and the file structure gets
// flattened, this should be merged with flatsim.util
flatsim.wgl_utils = {
  merge_float32_arrays: function () {
    var cnt = 0;
    for (i = 0; i < arguments.length; i++) {
      cnt += arguments[i].length;
    }
    var newArr = new Float32Array(cnt);
    cnt = 0;
    for (i = 0; i < arguments.length; i++) {
      newArr.set(arguments[i], cnt);
      cnt += arguments[i].length;
    }
    return newArr;
  }
};
