// Columns

var tty = require('./lib/tty');
var idCount = 0;


function create(opts) {
    opts = opts || {};
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

    this.columns = {};
    trackStdout(this);
}

Object.defineProperty(Columns.prototype, 'width', {
    get: function() {
        return tty.width - this.opts.margin.left - this.opts.margin.right;
    }
});

Object.defineProperty(Columns.prototype, 'height', {
    get: function() {
        return tty.width - this.opts.margin.left - this.opts.margin.right;
    }
});

Object.defineProperty(Columns.prototype, 'margin', {
    get: function() {
        return this.opts.margin;
    },
    set: function(margin) {
        this.opts.margin = margin;
        this.redraw();
    }
});

Object.defineProperty(Columns.prototype, 'headerSeparator', {
    get: function() {
        return this.opts.headerSeparator;
    },
    set: function(headerSeparator) {
        this.opts.headerSeparator = headerSeparator;
        this.redraw();
    }
});

Object.defineProperty(Columns.prototype, 'separator', {
    get: function() {
        return this.opts.separator;
    },
    set: function(separator) {
        this.opts.separator = separator;
        this.redraw();
    }
});

Columns.prototype.column = function(name) {
    return this.columns[name];
};

Columns.prototype.addColumn = function(name, opts) {
    name = name || "column_" + (Math.random()).toString(36) + idCount++;
    this.columns[name] = new Column(name, this, opts);
    this.redraw();
};

Columns.prototype.removeColumn = function(name) {
    this.columns[name] = undefined;
    this.redraw();
};

Columns.prototype.redraw = function() {

    var nextX = null,
        current;

    for (var column_name in this.columns) {
        current = this.columns[column_name];
        if (current !== undefined) {
            current.view.recalculate(nextX !== null ? nextX : this.margin.left);
            current.view.redraw();
            nextX = this.getNextX(current);
        }
    }
};

Columns.prototype.getNextX = function(column) {
    return column.width + this.margin.left + this.separator.width;
};


function trackStdout(columns) {
    process.stdout.on('resize', function() {
        tty.update();
        columns.redraw();
    });
}


module.exports = exports = create;
