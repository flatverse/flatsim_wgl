flatsim.VertPtr = function (vertBuffer, index) {
  this.vert_buffer = vertBuffer;
  this.index = index;
};
flatsim.VertPtr.prototype = {
  vert_buffer: null,
  index: null,

  x: function (val) {
    if (typeof val !== 'undefined' && val !== null) {
      this.vert_buffer.set_x(this.index, val);
    } else {
      return this.vert_buffer.get_x(this.index);
    }
  },
  y: function (val) {
    if (typeof val !== 'undefined' && val !== null) {
      this.vert_buffer.set_y(this.index, val);
    } else {
      return this.vert_buffer.get_y(this.index);
    }
  },
  z: function (val) {
    if (typeof val !== 'undefined' && val !== null) {
      this.vert_buffer.set_z(this.index, val);
    } else {
      return this.vert_buffer.get_z(this.index);
    }
  }
};