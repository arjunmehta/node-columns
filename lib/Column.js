var tty = require('./tty');

var util = require('util');
var stream = require('stream');
var Writable = stream.Writable || require('readable-stream').Writable;

util.inherits(Column, Writable);

function Column(name, columns, opts) {

    opts = opts || {};

    opts.width = opts.width ? calculateWidth(opts.width) : undefined;

    this.id = name;
    this.columns = columns;
    this.stream = new ColumnStream(this);
    this.view = new ColumnView(name, this, columns, x);

    Writable.call(this);

    this.pipe(this.stream);
}

Object.defineProperty(ColumnView.prototype, 'flow', {
    get: function() {
        return this.opts.flow;
    },
    set: function(flow) {
        this.opts.flow = flow;
    }
});

Object.defineProperty(ColumnView.prototype, 'percentage_width', {
    get: function() {
        return this.opts.percentage_width;
    },
    set: function(percentage) {
        this.opts.percentage_width = 1 / percentage;
    }
});

Object.defineProperty(ColumnView.prototype, 'width', {
    get: function() {
        return this.opts.width !== undefined ? this.opts.width : 0;
    },
    set: function(width) {
        if (typeof width === 'number') {
            this.opts.width = width;
        } else {
            this.opts.width = Math.round(tty.width * toPercentage(width));
        }
        this.columns.redraw();
    }
});

Object.defineProperty(ColumnView.prototype, 'header', {
    get: function() {
        return this.opts.header;
    },
    set: function(header) {
        this.opts.header = header;
        this.view.renderHeader();
    }
});

Column.prototype.remove = function() {
    this.columns.removeColumn(this.id);
};

Column.prototype.set = function(opts) {
    for (var option in opts) {
        this[option] = opts[option];
    }
};

Column.prototype.clear = function() {
    this.view.clear();
};

Column.prototype.redraw = function() {
    this.view.redraw();
};
