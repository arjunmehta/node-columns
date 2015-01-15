function ColumnView(column) {

    this.column = column;
    this.stream = column.stream;

    this.main = column.columns;

    this.overflow = 7;
    this.cursorY = 0;
}


// // column view prototype methods

ColumnView.prototype.recalculate = function() {
    var headerHeight = (this.column.header ? (this.main.header_separator ? 2 : 1) : 0);
    this.dataHeight = this.main.view.height - headerHeight;
    this.dataTop = this.main.margin.top + headerHeight;
};

ColumnView.prototype.redrawAll = function() {

    this.recalculate();
    this.redrawHeader();

    if (this.column.flow === true && this.stream.data.length > 0) {
        this.redrawDataFlow();
    } else {
        this.redrawDataEffeciently();
    }
};

ColumnView.prototype.redraw = function() {
    if (this.column.flow === true && this.stream.data.length > 0) {
        this.redrawDataFlow();
    } else {
        this.redrawDataEffeciently();
    }
};

ColumnView.prototype.redrawHeader = function() {

    if (this.column.header) {
        cursorPos(this.x, 0);
        writeToScreen(this.trim(this.column.header));
    }
    if (this.column.header_separator) {
        cursorPos(this.x, 1);
        writeToScreen(this.trim(this.column.header_separator));
    }
};

ColumnView.prototype.redrawDataEffeciently = function() {

    this.cursorY = 0;
    var start = (this.stream.data.length > this.dataHeight) ? this.stream.data.length - this.dataHeight - 1 : 0;

    for (var i = start; i < this.stream.data.length; i++) {
        this.printLine(this.stream.data[i], true);
    }
};

ColumnView.prototype.redrawDataFlow = function() {

    var data = this.stream.data;
    var offset = (data.length > this.dataHeight) ? this.dataHeight : data.length;

    // console.log("ColumnStream", this.column.name, "Writing...:", data);

    this.cursorY = 0;
    for (var i = data.length - offset; i < data.length; i++) {
        this.printLine(data[i], true);
    }
};

ColumnView.prototype.clear = function() {

    var startIndex = this.stream.data.length - 1 - this.overflow;
    this.cursorY = 0;

    for (var i = 0; i < this.dataHeight; i++) {
        if (i < this.overflow) {
            this.printLine(this.stream.data[startIndex + i + 1]);
        } else {
            this.printLine(this.main.view.empty_line);
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
    // console.log("Cursor Pos:", this.x, this.cursorY, this.dataTop);
    cursorPos(this.x, this.cursorY + this.dataTop);
};


// helper methods

function cursorPos(x, y) {
    process.stdout.cursorTo(x, y);
}

function writeToScreen(line) {
    process.stdout.write(line);
}


module.exports = exports = ColumnView;
