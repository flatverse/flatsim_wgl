flatsim.ArrayBuffer = function(gl, dataOrLength, arrayType, compCount) {
  this.gl = gl;
  this.array_type = arrayType || gl.ARRAY_BUFFER;
  this.comp_count = compCount || this.comp_count;

  // build array
  if (typeof dataOrLength === 'object' && typeof dataOrLength.length === 'number') {
    this.array = dataOrLength;
  } else {
    this.array = [];
    var i;
    for (i = 0; i < dataOrLength * this.comp_count; i++) {
      this.array.push(0.0);
    }
  }
  if (this.array_type === gl.ELEMENT_ARRAY_BUFFER) {
    this.array = new Uint16Array(this.array);
  } else {
    this.array = new Float32Array(this.array);
  }

  // create and fill gl buffer
  this.buffer = gl.createBuffer();
  gl.bindBuffer(this.array_type, this.buffer);
  gl.bufferData(this.array_type, this.array, gl.DYNAMIC_DRAW);
};
flatsim.ArrayBuffer.prototype = {
  gl: null,
  array_type: null,
  comp_count: 3,

  array: null,
  buffer: null,
  dirty_list: null,

  update: function () {
    if (!this.dirty_list) {
      return;
    }

    var arr = [];
    var dirty = _.toArray(this.dirty_list);
    var actualIx, i, ix, j;
    this.gl.bindBuffer(this.array_type, this.buffer);
    for (i = 0; i < dirty.length; i++) {
      ix = dirty[i];
      actualIx = ix * this.comp_count;
      for (j = 0; j < this.comp_count; j++) {
        arr.push(this.array[actualIx + j]);
      }
      this.gl.bufferSubData(this.array_type, actualIx, new Float32Array(arr));
    }

    this.dirty_list = null;
  },

  add_dirty: function (index) {
    this.dirty_list = this.dirty_list || {};
    this.dirty_list[index] = index;
  },

  set_x: function (index, val) {
    this.array[index * this.comp_count] = val;
    this.set_dirty(index);
  },

  set_y: function (index, val) {
    this.array[index * this.comp_count + 1] = val;
    this.set_dirty(index);
  },

  set_z: function (index, val) {
    this.array[index * this.comp_count + 2] = val;
    this.set_dirty(index);
  },

  set_w: function (index, val) {
    this.array[index * this.comp_count + 3] = val;
    this.set_dirty(index);
  },

  set: function (index) {
    var i;
    for (i = 1; i < arguments.length; i++) {
      this.array[(index * this.comp_count) + (i - 1)] = arguments[i];
    }
    this.set_dirty(index);
  },

  get_x: function (index) {
    return this.array[index * this.comp_count];
  },

  get_y: function (index) {
    return this.array[index * this.comp_count + 1];
  },

  get_z: function (index) {
    return this.array[index * this.comp_count + 2];
  },

  get_w: function (index) {
    return this.array[index * this.comp_count + 3];
  },

  get: function(index) {
    var vec = [];
    var i;
    for (i = 0; i < this.comp_count; i++) {
      vec[i] = this.array[index * this.comp_count + i];
    }
    return vec;
  },

  get_element_count: function () {
    return this.array.length / this.comp_count;
  },
};
