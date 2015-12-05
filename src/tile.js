flatsim.Tile = function (coordWE, coordNS, options) {
  this.coord_we = coordWE;
  this.coord_ns = coordNS;

  this.corner_heights = {
    nw: 0,
    ne: 0,
    se: 0,
    sw: 0
  };
  this.colors = {
    top: 0x77ff00,
    bottom: 0x675B54,
    north: 0x675B54,
    east: 0x675B54,
    south: 0x675B54,
    west: 0x675B54,
  };

  _.extend(this, options);
};
flatsim.Tile.prototype = {
  coord_we: undefined,
  coord_ns: undefined,
  height_bottom: 0,
  height_top: 1,
  corner_heights: undefined,
  colors: undefined,
  grid_color: 0xdddddd,

  get_nw_corner_height: function () {
    return this.height_top + this.corner_heights.nw;
  },
  get_ne_corner_height: function () {
    return this.height_top + this.corner_heights.ne;
  },
  get_se_corner_height: function () {
    return this.height_top + this.corner_heights.se;
  },
  get_sw_corner_height: function () {
    return this.height_top + this.corner_heights.sw;
  },

  refresh_state: function () {
    this.last_state = this.create_state();
  },

  create_state: function () {
    var state = {};
    var key, val;
    for(key in this) {
      val = this[key];
      if (key !== 'last_state' && typeof val !== 'function') {
        state[key] = _.clone(val);
      }
    };
    return state;
  },

  was_changed: function (propertyNames) {
    if (typeof propertyNames === 'string') {
      propertyNames = [propertyNames];
    }
    if (typeof this.last_state !== 'object') {
      return true;
    }
    var i;
    for (i = 0; i < propertyNames.length; i++) {
      if (!_.isEqual(this.last_state[propertyNames[i]], this[propertyNames[i]])) {
        return true;
      }
    }
    return false;
  },
};