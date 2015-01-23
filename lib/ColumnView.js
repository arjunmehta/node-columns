function ColumnView(column) {

    this.column = column;
    this.stream = column.stream;
    this.buffer = column.buffer;

    this.main = column.columns;

    this.cursorY = 0;
    this.current_line = 0;
    this.current_buffer_line = 0;

    this.display_cache = [];

    this.wrap = column.opts.wrap;

    this.x = 0;
    this.data_top = 0;
    this.data_height = 0;

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

    this.redraw();
};

ColumnView.prototype.redraw = function() {

    if (this.buffer.size > 0) {
        if (this.main.opts.flow === true) {
            this.redrawDataFlow();
        } else {
            this.printToCurrent();
            this.redrawDataEffeciently();
        }
    }
};

ColumnView.prototype.redrawHeader = function() {

    if (this.column.header) {
        cursorPos(this.x, this.main.margin.top + 0);
        writeToScreen(this.column.header.substring(0, this.width));

        if (this.main.header_separator) {
            cursorPos(this.x, this.main.margin.top + 1);
            writeToScreen(this.header_separator.substring(0, this.width));
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


ColumnView.prototype.printFromOverflow = function() {

    var numLines = this.current_buffer_line - this.current_line;

    for (var i = 0; i < numLines; i++) {
        line_array = this.buffer.line(i).trimmed(this.width, this.wrap);
        for (var j = 0; j < line_array.length; j++) {
            this.printLine(line_array[j], true);
        }
    }
};

ColumnView.prototype.redrawDataFlow = function() {

    this.buildDisplayCache();

    if (this.display_cache.length < this.data_height) {
        this.fillDown(0, this.data_height - 1, 0);
    } else {
        this.fillUp(this.data_height - 1, 0, this.buffer.size - 1);
    }
};

ColumnView.prototype.buildDisplayCache = function() {

    this.display_cache = [];

    for (var i = 0; i < this.buffer.size; i++) {
        this.display_cache = this.display_cache.concat(this.buffer.line(i).trimmed(this.width, this.wrap));
        // console.log(this.display_cache);
        if (this.display_cache.length > this.data_height) {
            // this.display_cache = this.display_cache.slice(this.data_height);
            break;
        }
    }
};


ColumnView.prototype.fillUp = function(from, to, buffer_line) {

    var line_array = this.buffer.line(buffer_line).trimmed(this.width, this.wrap),
        i = from,
        j = line_array.length - 1,
        dest = 0;


    while (i >= to) {

        this.cursorY = i;
        this.printLine(line_array[j], false);
        j--;

        if (j < dest) {
            buffer_line--;
            line_array = this.buffer.line(buffer_line).trimmed(this.width, this.wrap);
            j = line_array.length - 1;
            dest = 0;
        }

        i--;
    }
};

ColumnView.prototype.fillDown = function(from, to, buffer_line) {

    var line_array = this.buffer.line(buffer_line).trimmed(this.width, this.wrap),
        i = from,
        j = 0,
        dest = line_array.length - 1;

    while (i <= to) {

        this.cursorY = i;
        this.printLine(line_array[j], false);
        j++;

        if (j > dest) {

            buffer_line++;

            if (buffer_line > this.buffer.size - 1) break;

            line_array = this.buffer.line(buffer_line).trimmed(this.width, this.wrap);
            j = 0;
            dest = line_array.length - 1;
        }

        i++;
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

ColumnView.prototype.printBufferLine = function(buffer_index, height, reset_mode) {

    var line, num_lines, line_array;

    this.cursorY = 0;
    line_array = this.buffer.line(buffer_index).trimmed(this.width, this.wrap);

    for (var i = 0; i < line_array.length; i++) {
        this.printLine(line_array[i]);
    }
};

ColumnView.prototype.printLine = function(line, reset_mode) {

    if (this.main.opts.flow === false) {
        this.checkOverflow();
    }

    this.dataCursorPos(this.cursorY);
    writeToScreen(line);
    this.cursorY++;
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
