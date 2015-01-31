var util = require('util');
var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var ColumnBuffer = require('./ColumnBuffer');
var ColumnStream = require('./ColumnStream');
var ColumnView = require('./ColumnView');

util.inherits(Column, PassThrough);


function Column(columns, name, opts) {

    opts = opts || {};    
    this.opts = opts;

    PassThrough.call(this);

    this.name = name;
    this.columns = columns;

    this.buffer = new ColumnBuffer(this);
    this.stream = new ColumnStream(this);
    this.view = new ColumnView(this);

    this.displaying = true;        

    if (opts.width) {
        this.width = opts.width;
    }
}


// column getter/setter properties

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
            }
        }

        this.opts.width = setWidth;

        if (typeof setWidth === 'number') {
            this.opts.fixed_width = setWidth;
        }

        this.columns.view.refresh();
    }
});

Object.defineProperty(Column.prototype, 'header', {
    get: function() {
        return this.opts.header;
    },
    set: function(header) {
        this.opts.header = header;
        this.view.redrawHeader();
    }
});


// column prototype methods

Column.prototype.redraw = function() {
    this.view.redrawAll();
};

Column.prototype.clear = function() {
    this.stream.data = [''];
    this.view.clear();
};

Column.prototype.remove = function() {
    this.columns.removeColumn(this.id);
};

Column.prototype.set = function(opts) {
    for (var option in opts) {
        this[option] = opts[option];
    }
};

Column.prototype.addColumn = function() {
    this.columns.addColumn.apply(null, arguments);
};


module.exports = exports = Column;
