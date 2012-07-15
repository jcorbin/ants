// Generated by CoffeeScript 1.3.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.EventDispatcher = (function() {

    function EventDispatcher() {}

    EventDispatcher.prototype.callbacks = {};

    EventDispatcher.prototype.addListener = function(name, callback) {
      var _base, _ref;
      if ((_ref = (_base = this.callbacks)[name]) == null) {
        _base[name] = [];
      }
      return this.callbacks[name].push(callback);
    };

    EventDispatcher.prototype.dispatch = function(name, data) {
      var callback, _i, _len, _ref, _results;
      if (!(this.callbacks[name] != null)) {
        return;
      }
      if (data != null) {
        data = {};
      } else if (typeof data !== "object" || data instanceof Array) {
        data = {
          data: data
        };
      }
      data.target = this;
      data.name = name;
      _ref = this.callbacks[name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback(data));
      }
      return _results;
    };

    return EventDispatcher;

  })();

}).call(this);
