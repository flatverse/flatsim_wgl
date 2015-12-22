flatsim.VertexBuffer = function (gl, vertCount) {
  this.gl = gl;

  this.array = [];
  var i;
  for (i = 0; i < vertCount * 3; i++) {
    this.array.push(0.0);
  }

  this.buffer = this.gl.createBuffer();

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32(this.array), this.gl.DYNAMIC_DRAW);

  this.dirty_list = {};
};
flatsim.VertexBuffer.prototype = {
  gl: null,
  array: null,
  buffer: null,
  dirty_list: null,

  update: function () {
    var arr;
    var actualIx;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    for(var ix in this.dirty_list) {
      actualIx = ix * 3;
      arr = [this.array[actualIx], this.array[actualIx + 1], this.array[actualIx + 2]];
      this.gl.bufferSubData(this.gl.ARRAY_BUFFER, actualIx, new Float32Array(arr));
    }
  },

  set_x: function (index, val) {
    this.array[index * 3] = val;
    if (typeof this.dirty_list[index] === 'undefined') {
      this.dirty_list[index] = index;
    }
  },
  set_y: function (index, val) {
    this.array[(index * 3) + 1] = val;
    if (typeof this.dirty_list[index] === 'undefined') {
      this.dirty_list[index] = index;
    }
  },
  set_z: function (index, val) {
    this.array[(index * 3) + 2] = val;
    if (typeof this.dirty_list[index] === 'undefined') {
      this.dirty_list[index] = index;
    }
  },

  get_x: function (index) {
    return this.array[index * 3];
  },
  get_y: function (index) {
    return this.array[(index * 3) + 1];
  },
  get_z: function (index) {
    return this.array[(index * 3) + 2];
  },
};