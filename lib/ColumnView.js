function ColumnView(column) {

    this.column = column;
    this.stream = column.stream;
    this.buffer = column.buffer;

    this.main = column.columns;

    this.cursorY = 0;
    this.x = 0;
    this.data_top = 0;
    this.data_height = 0;
    this.current_line = 0;
    this.modulo = 0;

    this.header_separator = new Array(this.main.view.width).join(this.main.header_separator);
}


// // column view prototype methods

ColumnView.prototype.recalculate = function() {

    var headerHeight = (this.column.header ? (this.main.header_separator ? 2 : 1) : 0);

    this.data_height = this.main.view.height - headerHeight;
    this.data_top = this.main.margin.top + headerHeight;

    this.header_separator = new Array(this.main.view.width).join(this.main.header_separator);
};

ColumnView.prototype.redrawAll = function(separator) {

    this.recalculate();
    this.redrawHeader();

    if (separator === true) {
        this.redrawSeparator();
    }

    if (this.buffer.size > 0) {
        if (this.main.opts.flow === true) {
            this.redrawDataFlow();
        } else {
            this.printToCurrent();
            this.redrawDataEffeciently();
        }
    }
};

ColumnView.prototype.redraw = function() {
    if (this.main.opts.flow === true && this.buffer.size > 0) {
        this.redrawDataFlow();
    } else {
        this.redrawDataEffeciently();
    }
};

ColumnView.prototype.redrawHeader = function() {

    if (this.column.header) {
        cursorPos(this.x, this.main.margin.top + 0);
        writeToScreen(this.trim(this.column.header));

        if (this.main.header_separator) {
            cursorPos(this.x, this.main.margin.top + 1);
            writeToScreen(this.trim(this.header_separator));
        }
    }
};

ColumnView.prototype.redrawSeparator = function() {

    var column_separator = this.main.column_separator;

    if (column_separator) {
        var x = this.x - column_separator.length;

        for (var i = 0; i < this.main.view.height; i++) {
            cursorPos(x, this.main.margin.top + i);
            writeToScreen(column_separator);
        }
    }
};

ColumnView.prototype.redrawDataEffeciently = function() {

    var overflow = (this.current_line < this.data_height) ? false : true;
    var data_length = this.buffer.size;

    this.setModulo();
    this.cursorY = overflow ? this.modulo + this.main.overflow : this.modulo;
    this.printLine(this.buffer.line(this.current_line).trimmed(this.width));

    if (this.current_line < data_length - 1) {
        this.current_line++;
        this.redrawDataEffeciently();
    }
};

ColumnView.prototype.setModulo = function() {

    var modulo = this.current_line > this.data_height + this.main.overflow ? (this.current_line - this.main.overflow) % (this.data_height - this.main.overflow) : this.current_line % this.data_height;

    if (modulo === 0 && modulo !== this.modulo) {
        this.clear();
        this.printOverflow();
    }

    this.modulo = modulo;
};

ColumnView.prototype.printToCurrent = function() {

    this.setModulo();

    var overflow = (this.current_line < this.data_height) ? false : true;
    var numLines = overflow ? this.modulo + this.main.overflow : this.modulo;

    this.cursorY = 0;

    for (var i = this.current_line - numLines; i < this.current_line; i++) {
        this.printLine(this.buffer.line(i).trimmed(this.width));
    }
};

ColumnView.prototype.printOverflow = function() {

    this.cursorY = 0;
    for (var i = this.current_line - this.main.overflow; i < this.current_line; i++) {
        this.printLine(this.buffer.line(i).trimmed(this.width));
    }
};

ColumnView.prototype.redrawDataFlow = function() {

    var buffer_size = this.buffer.size;
    var offset = (buffer_size > this.data_height) ? this.data_height : buffer_size;

    this.cursorY = 0;
    for (var i = buffer_size - offset; i < buffer_size; i++) {
        this.printLine(this.buffer.line(i).trimmed(this.width), true);
    }
};

ColumnView.prototype.clear = function() {

    this.cursorY = 0;
    for (var i = 0; i < this.data_height; i++) {
        this.printLine(this.main.view.empty_line.substring(0, this.width));
    }
    this.cursorY = 0;
};

ColumnView.prototype.checkOverflow = function() {

    if (this.cursorY + 1 > this.data_height) {
        this.clear();
    }
};

ColumnView.prototype.printLine = function(line, redrawing) {

    if (redrawing === undefined) {
        this.checkOverflow();
    }

    this.dataCursorPos(this.cursorY);
    writeToScreen(line);
    this.cursorY++;
};

ColumnView.prototype.trim = function(line) {
    return (line + this.main.view.empty_line).substring(0, this.width) + '\u001b[0m';
};

ColumnView.prototype.dataCursorPos = function(y) {
    cursorPos(this.x, this.cursorY + this.data_top);
};


// helper methods

function cursorPos(x, y) {
    process.stdout.cursorTo(x, y);
}

function writeToScreen(line) {
    process.stdout.write(line);
}


module.exports = exports = ColumnView;
