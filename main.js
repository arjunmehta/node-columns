// node-columns
// MIT © Arjun Mehta
// www.arjunmehta.net


var heartbeats = require('heartbeats');
heartbeats.createHeart(Math.round(1000 / 24), 'view_refresh');

var MainView = require('./lib/MainView');
var Column = require('./lib/Column');

var idCount = 0;


function create(opts) {
    return new Columns(opts);
}

function Columns(opts) {

    opts = opts || {};

    opts.margin = opts.margin || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    opts.flow = opts.flow_mode === 'reset' ? false : true;
    opts.overflow = opts.overflow !== undefined ? opts.overflow : 3;
    opts.maximum_buffer = opts.maximum_buffer || 500;
    opts.tab_size = opts.tab_size || 2;
    opts.print = opts.print || false;

    this.opts = opts;
    this.view = new MainView(this, opts.mode, opts.print);
    this.columns = {};
}


// core getter/setter properties

Object.defineProperty(Columns.prototype, 'flow_mode', {
    get: function() {
        return this.opts.flow === false ? 'reset' : 'push';
    },
    set: function(flow) {
        this.opts.flow = flow === 'reset' ? false : true;
    }
});

Object.defineProperty(Columns.prototype, 'overflow', {
    get: function() {
        return this.opts.overflow;
    },
    set: function(overflow) {
        this.opts.overflow = overflow;
    }
});

Object.defineProperty(Columns.prototype, 'margin', {
    get: function() {
        return this.opts.margin;
    },
    set: function(margin) {
        this.opts.margin = margin;
        this.view.refresh();
    }
});

Object.defineProperty(Columns.prototype, 'header_separator', {
    get: function() {
        return this.opts.header_separator !== undefined ? this.opts.header_separator : '_';
    },
    set: function(header_separator) {
        this.opts.header_separator = header_separator;
        this.view.refresh();
    }
});

Object.defineProperty(Columns.prototype, 'column_separator', {
    get: function() {
        return this.opts.column_separator !== undefined ? this.opts.column_separator : ' ';
    },
    set: function(column_separator) {
        this.opts.column_separator = column_separator;
        this.view.refresh();
    }
});


// core prototype methods

Columns.prototype.redraw = function() {
    this.view.refresh();
};

Columns.prototype.column = function(name) {
    return this.columns[name];
};

Columns.prototype.addColumn = function(name, opts) {

    if (typeof name === "object" && opts === undefined) {
        opts = name;
        name = undefined;
    }

    opts = opts || {};
    opts.header = opts.header !== undefined ? opts.header : name;

    name = name || 'column_' + (Math.random()).toString(36) + idCount++;
    this.columns[name] = new Column(this, name, opts);
    this.view.refresh();

    return this.columns[name];
};

Columns.prototype.removeColumn = function(name) {
    this.columns[name] = undefined;
    this.view.refresh();
};


module.exports = exports = {
    create: create
};
