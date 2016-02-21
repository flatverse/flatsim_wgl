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
  },

  expand_array: function(array, scale) {
    var newArr = [];
    var i, j;
    for (i = 0; i < array.length; i++) {
      for (j = 0; j < scale; j++) {
        newArr.push(array[i]);
      }
    }
    return newArr;
  },

  verts_to_string: function (vertArray, faceArray) {
    var faceIx;
    var str = '';
    for (faceIx = 0; faceIx < faceArray.length; faceIx+=3) {
      str += flatsim.util.format_string(
        'face: {0}, {1}, {2}\n',
        faceArray[faceIx],
        faceArray[faceIx + 1],
        faceArray[faceIx + 2]
      );
    }
    for (faceIx = 0; faceIx < vertArray.length / 3; faceIx++) {
      str += this.vert_to_string(vertArray, faceIx) + '\n';
    }
    return str;
  },
  vert_to_string: function (vertArray, vertIx) {
    vertIx *= 3;
    return flatsim.util.format_string(
      'x: {0}, y: {1}, z: {2}', 
      vertArray[vertIx],
      vertArray[vertIx + 1],
      vertArray[vertIx + 2]
    );
  },
};
