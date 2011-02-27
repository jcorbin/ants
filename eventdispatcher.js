var EventDispatcher = function() {};

EventDispatcher.prototype = {
    callbacks: {},

    addListener: function(name, callback) {
        if (! this.callbacks[name])
            this.callbacks[name] = [];
        this.callbacks[name].push(callback);
    },

    dispatch: function(name, data) {
        var chain = this.callbacks[name];
        if (! chain) return;
        if (! data)
            data = {};
        else if (typeof data != "object" || data instanceof Array)
            data = {data: data};
        data.target = this;
        data.name = name;
        chain.forEach(function(callback) {
            callback(data);
        });
    }
};
