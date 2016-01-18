flatsim.VertexBuffer = function (gl, vertCount, arrayType) {
  this.gl = gl;
  this.array_type = arrayType || this.gl.ARRAY_BUFFER;

  if (typeof vertCount === 'object' && typeof vertCount.length === 'number') {
    this.array = vertCount;
  } else {
    this.array = [];
    var i;
    for (i = 0; i < vertCount * 3; i++) {
      this.array.push(0.0);
    }
  }
  if (this.array_type === this.gl.ELEMENT_ARRAY_BUFFER) {
    this.array = new Uint16Array(this.array);
  } else {
    this.array = new Float32Array(this.array);
  }

  this.buffer = this.gl.createBuffer();

  this.gl.bindBuffer(this.array_type, this.buffer);
  this.gl.bufferData(this.array_type, this.array, this.gl.DYNAMIC_DRAW);

  this.dirty_list = {};
};
flatsim.VertexBuffer.prototype = {
  gl: null,
  array_type: null,
  array: null,
  buffer: null,
  dirty_list: null,

  update: function () {
    var arr;
    var actualIx;
    this.gl.bindBuffer(this.array_type, this.buffer);
    for(var ix in this.dirty_list) {
      actualIx = ix * 3;
      arr = [this.array[actualIx], this.array[actualIx + 1], this.array[actualIx + 2]];
      this.gl.bufferSubData(this.array_type, actualIx, new Float32Array(arr));
    }
    this.dirty_list = {};
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

  set: function (index, x, y, z) {
    var startIx = index * 3;
    this.array[startIx + 0] = x;
    this.array[startIx + 1] = y;
    this.array[startIx + 2] = z;
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

  get_vert_count: function () {
    return this.array.length / 3;
  },
};
