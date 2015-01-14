var util = require('util');
var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var ColumnStream = require('./ColumnStream');
var ColumnView = require('./ColumnView');

util.inherits(Column, PassThrough);


function Column(columns, name, opts) {

    opts = opts || {};

    this.name = name;
    this.columns = columns;
    this.stream = new ColumnStream(this);
    this.view = new ColumnView(this);

    PassThrough.call(this);
    this.pipe(this.stream);

    opts.flow = opts.flow || true;
    this.opts = opts;

    if (opts.width) {
        this.width = opts.width;
    }
}


// column getter/setter properties

Object.defineProperty(Column.prototype, 'flow', {
    get: function() {
        return this.opts.flow;
    },
    set: function(flow) {
        this.opts.flow = flow;
    }
});

Object.defineProperty(Column.prototype, 'width', {
    get: function() {
        return this.opts.width;
    },
    set: function(width) {

        var setWidth = width;

        this.opts.percentage_width = undefined;
        this.opts.fixed_width = undefined;

        if (typeof width === 'string') {
            if (width.indexOf('%') > -1) {

                setWidth = width.replace(/ /g, '');
                width = setWidth.replace(/\%/g, '');
                this.opts.percentage_width = ~~width / 100;
            } else {
                setWidth = ~~width;
                this.opts.fixed_width = setWidth;
            }
        }

        this.opts.width = setWidth;
        this.columns.view.refresh();
    }
});

Object.defineProperty(Column.prototype, 'header', {
    get: function() {
        return this.opts.header;
    },
    set: function(header) {
        this.opts.header = header;
        this.view.redrawAll();
    }
});


// column prototype methods

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
    this.view.refresh();
};


module.exports = exports = Column;
