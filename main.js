// node-columns
// MIT © Arjun Mehta
// www.arjunmehta.net


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

    this.opts = opts;
    this.view = new MainView(this);
    this.columns = {};
}


// core getter/setter properties

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
        return this.opts.header_separator || '_';
    },
    set: function(header_separator) {
        this.opts.header_separator = header_separator;
        this.view.refresh();
    }
});

Object.defineProperty(Columns.prototype, 'separator', {
    get: function() {
        return this.opts.separator || ' ';
    },
    set: function(separator) {
        this.opts.separator = separator;
        this.view.refresh();
    }
});


// core prototype methods

Columns.prototype.column = function(name) {
    return this.columns[name];
};

Columns.prototype.addColumn = function(name, opts) {

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
