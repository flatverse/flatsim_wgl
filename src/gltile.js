(function (scope) {

scope.gltile = {
  name: 'gltile',
  version: '0.0.0',

  trace_message: function (message) {
    var final_msg = '[' + this.name + ']';
    for (var i = 1; i < arguments.length; i++) {
      final_msg += '[' + arguments[i] + ']';
    }
    final_msg += ' ' + message;
    return final_msg;
  },

  except: function (message) {
    throw this.trace_message.apply(this, arguments);
  }
};

}(window));

