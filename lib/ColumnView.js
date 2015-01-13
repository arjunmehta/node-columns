// Display View

var tty = require('./tty');


function ColumnView(name, column, columns, x) {

    var opts = {};

    this.id = name;
    this.column = column;
    this.stream = column.stream;
    this.data = column.stream.data;

    this.main = columns;

    this.overflow = 7;
    this.cursorY = 0;

    this.x = x;
    this.recalculate(x);
}


ColumnView.prototype.recalculate = function(x) {

    this.width = this.column.width;
    this.headerHeight = (this.column.header !== null ? (this.column.headerSeparator !== null ? 2 : 1) : 0);
    this.dataHeight = this.main.height - this.headerHeight;
    this.dataTop = this.main.padding.top + this.headerHeight;
    this.x = x;
};


ColumnView.prototype.drawHeader = function() {

    if (this.column.header !== null) {
        cursorPos(this.x, 0);
        writeToScreen(this.trim(this.column.header));
    }
    if (this.column.headerSeparator !== null) {
        cursorPos(this.x, 1);
        writeToScreen(this.trim(this.column.headerSeparator));
    }
};

ColumnView.prototype.redraw = function() {

    if (this.column.flow === true && this.data.length > 0) {
        this.redraw_flow();
    } else {
        this.redraw_effeciently();
    }

    this.drawHeader();
};

ColumnView.prototype.redraw_effeciently = function() {

    this.cursorY = 0;
    for (var i = this.data.length - this.dataHeight - 1; i < this.data.length; i++) {
        this.printLine(this.data[i], true);
    }
};

ColumnView.prototype.redraw_flow = function() {

    var data = this.data;
    var offset = (data.length > this.dataHeight) ? this.dataHeight : data.length;

    this.cursorY = 0;
    for (var i = data.length - offset; i < data.length; i++) {
        this.printLine(data[i], true);
    }
};

ColumnView.prototype.clear = function() {

    var startIndex = this.data.length - 1 - this.overflow;
    this.cursorY = 0;

    for (var i = 0; i < this.dataHeight; i++) {
        if (i < this.overflow) {
            this.printLine(this.data[startIndex + i + 1]);
        } else {
            this.printLine(tty.emptyLine);
        }
    }

    this.cursorY = this.overflow;
};

ColumnView.prototype.checkOverflow = function() {

    if (this.cursorY + 1 > this.dataHeight) {
        this.clear();
    }
};

ColumnView.prototype.printLine = function(line, redrawing) {

    if (redrawing === undefined) {
        this.checkOverflow();
    }

    this.dataCursorPos(this.cursorY);
    writeToScreen(this.trim(line));
    this.cursorY++;
};

ColumnView.prototype.trim = function(line) {

    return line.substring(0, this.width) + "\u001b[0m";
};

ColumnView.prototype.dataCursorPos = function(y) {
    cursorPos(this.x, this.cursorY + this.dataTop);
};



function cursorPos(x, y) {
    process.stdout.cursorTo(x, y);
}

function writeToScreen(line) {
    process.stdout.write(line);
}


module.exports = exports = ColumnView;
