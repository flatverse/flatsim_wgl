var flatsim = {
  version: '0.0.0',
  dev_mode: true,

  logging_options: {
    prepend_info: true,
    default_log_strength: 1,
    log_color_quiet: '#205080',
    log_color_mid: '#00ff00',
    log_color_loud: '#00ff00',
    log_bg_quiet: '#ffffff',
    log_bg_loud: '#222222',
  },

  init: function () {
    if (this.dev_mode) {
      // this.log(1, 'intializing...');
      this.log(1, 'initialized');
    }
  },

  log: function(howLoud, str) {
    if (typeof howLoud === 'number') {
      str = this.util.format_string.apply(this, this.util.slice_func_arguments(arguments, 1));
    } else {
      str = this.util.format_string.apply(this, arguments);
      howLoud = this.logging_options.default_log_strength;
    }

    var colFrom, colTo;
    var colorPerc;
    if (howLoud <= 0.5) {
      colFrom = this.logging_options.log_color_quiet;
      colTo = this.logging_options.log_color_mid;
      colorPerc = howLoud / 0.5;
    } else {
      colFrom = this.logging_options.log_color_mid;
      colTo = this.logging_options.log_color_loud;
      colorPerc = (howLoud - 0.5) / 0.5;
    }

    var logColor = this.util.interpolate_between_color_arrays(
      this.util.array_from_css_color(colFrom),
      this.util.array_from_css_color(colTo), colorPerc);
    logColor = this.util.css_color_from_array(logColor);
    var logBg = this.util.interpolate_between_color_arrays(
      this.util.array_from_css_color(this.logging_options.log_bg_quiet),
      this.util.array_from_css_color(this.logging_options.log_bg_loud), howLoud);
    logBg = this.util.css_color_from_array(logBg);
    var logCSS = this.util.format_string('color: {0}; background-color: {1}; ', logColor, logBg);

    var versionInfo = '';
    if (this.logging_options.prepend_info) {
      this.util.format_string('[flatsim][{0}] ', this.version);
    }

    console.log('%c%s%c%s', logCSS + 'font-weight: 900;', versionInfo, logCSS + 'font-weight: normal;', str)
  },

  warn: function (str) {
    str = this.util.format_string.apply(this, arguments);
    console.warn('[flatsim][%s] %s', this.version, str);
  },

  error: function (str) {
    str = this.util.format_string.apply(this, arguments);
    console.error('[flatsim][%s] %s', this.version, str);
  },

  /****************************************
  * utilities
  ****************************************/
  util: {
    format_string: function(str) {
      if (typeof str === 'undefined') {
        return '<undefined>';
      }
      if (str === null) {
        return '<null>';
      }
      str = str.toString();
      if (arguments.length === 1) {
        return str;
      }

      var rr = /\{[0-9]*\}/g;
      var rn = /[0-9]+/g;

      var split = str.split(rr);

      var ixs = [];
      var match = rr.exec(str);
      while(typeof match !== 'undefined' && match !== null) {
        match = match[0].match(rn);
        ixs.push(parseInt(match[0]));
        match = rr.exec(str);
      }

      var result = '';
      var i;
      for (i = 0; i < ixs.length; i++) {
        var replStr = arguments[ixs[i] + 1];
        if (typeof replStr === 'undefined') {
          replStr = '<undefined>';
        } else if (typeof replStr === 'null') {
          replStr = '<null>';
        }
        result += split[i] + replStr;
      }
      result += split[split.length - 1];

      return result;
    },

    slice_func_arguments: function(argumentsArr, fromIx) {
      var newArgs = [];
      var i;
      for (i = 1; i < argumentsArr.length; i++) {
        newArgs.push(argumentsArr[i]);
      }
      return newArgs;
    },

    array_from_css_color: function (cssColorStr) {
      if (cssColorStr.length === 7) {
        cssColorStr = cssColorStr.substring(1);
      }
      var r = cssColorStr.substring(0, 2);
      r = parseInt(r, 16) / 255;
      var g = cssColorStr.substring(2, 4);
      g = parseInt(g, 16) / 255;
      var b = cssColorStr.substring(4);
      b = parseInt(b, 16) / 255;

      return [r, g, b];
    },

    css_color_from_array: function (colArr) {
      var str = '';
      var i;
      var colChan;
      for (i = 0; i < colArr.length; i++) {
        colChan = Math.floor(colArr[i] * 255).toString(16);
        if (colChan.length === 1) {
          colChan = '0' + colChan;
        }
        str += colChan;
      }
      return '#' + str;
    },

    interpolate_between_color_arrays: function (colArr1, colArr2, perc) {
      var result = [];
      var i;
      var col1, col2;
      var delt;
      for (i = 0; i < colArr1.length; i++) {
        col1 = colArr1[i];
        col2 = colArr2[i];
        delt = Math.abs(col2 - col1) * perc;

        if (col1 > col2) {
          result.push(col1 - delt);
        } else {
          result.push(col1 + delt);
        }
      }
      return result;
    },
  },
};
