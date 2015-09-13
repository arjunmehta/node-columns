var heartbeats = require('heartbeats');
var ColumnLine = require('./ColumnLine');


function ColumnView(column) {

    var _this = this,
        buffer = column.buffer,
        buffer_new_lines = buffer.new_lines,
        new_lines = 0,
        threshold = true;

    this.column = column;
    this.stream = column.stream;
    this.buffer = buffer;

    this.main = column.columns;

    this.display_cache = [];
    this.buffer_cache = [];

    this.wrap = column.opts.wrap;
    this.flow = this.main.opts.flow;

    this.cursorY = 0;
    this.current_line = column.opts.raw === true ? 0 : -1;
    this.current_line_height = column.opts.raw === true ? 1 : 0;

    this.x = 0;
    this.data_top = 0;
    this.data_height = 0;

    this.header_separator = new Array(this.main.view.width).join(this.main.header_separator);

    heartbeats.heart('view_refresh').createEvent(1, function(heartbeat, last) {

        if (column.displaying === true) {

            buffer_new_lines = buffer.new_lines;
            threshold = (buffer_new_lines < _this.data_height || buffer_new_lines - new_lines < 1000 || buffer_new_lines === new_lines) ? true : false;
            new_lines = buffer_new_lines;

            if (threshold === true) {
                _this.renderBuffer(buffer_new_lines);
                buffer.reset();
            }
        }
    });
}


// column view prototype methods

ColumnView.prototype.recalculate = function() {

    var headerHeight = (this.column.header ? (this.main.header_separator ? 2 : 1) : 0);

    this.data_height = this.main.view.height - headerHeight;
    this.data_top = this.main.margin.top + headerHeight;

    this.header_separator = new Array(this.main.view.width).join(this.main.header_separator);
};

ColumnView.prototype.redrawAll = function(separator) {

    this.recalculate();
    this.redrawHeader();
    this.rebuildFrontDisplayCache();
    this.rebuildEndDisplayCache();

    if (separator === true) {
        this.redrawSeparator();
    }

    this.redraw();
};

ColumnView.prototype.redraw = function() {

    if (this.buffer.size > 0) {
        if (this.flow === true) {
            this.redrawDataFlow(0);
        } else {
            this.redrawDataEffeciently();
        }
    }
};

ColumnView.prototype.redrawHeader = function() {

    if (this.column.header) {
        cursorPos(this.x, this.main.margin.top + 0);
        writeToScreen(new ColumnLine(this.column.header).trimmed(this.width)[0]);


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

ColumnView.prototype.redrawDataFlow = function(new_lines) {

    this.current_line += new_lines;
    this.rebuildFrontDisplayCache();

    if (this.display_cache.length < this.data_height - 1) {
        this.fillDown(0, this.data_height - 1, 0);
    } else {
        this.fillUp(this.data_height - 1, 0, this.buffer.size - 1);
    }
};

ColumnView.prototype.redrawDataEffeciently = function() {

    if (this.buffer_cache.length > this.data_height) {
        this.clearToOverflow();
    } else {
        this.clear();
        this.fillUpUsingBuffer(this.buffer_cache.length, 0);
    }
};

ColumnView.prototype.renderBuffer = function(new_lines) {

    if (this.flow === true) {
        if (new_lines > 0) {
            this.redrawDataFlow(new_lines);
        } else if (this.buffer.current_modified === true) {
            this.redrawCurrentLineFlow();
        }
    } else {
        if (this.buffer.current_modified === true) {
            this.redrawCurrentLine();
        }
        if (new_lines > 0) {
            this.printNewLines(new_lines);
        }
    }
};

ColumnView.prototype.rebuildFrontDisplayCache = function() {

    this.display_cache = [];

    for (var i = 0; i < this.current_line; i++) {
        this.display_cache = this.display_cache.concat(this.buffer.line(i).trimmed(this.width, this.wrap));
        if (this.display_cache.length > this.data_height) {
            break;
        }
    }
};

ColumnView.prototype.rebuildEndDisplayCache = function() {

    this.buffer_cache = [];

    for (var i = this.current_line; i >= 0; i--) {
        this.buffer_cache = this.buffer_cache.concat(this.buffer.line(i).trimmed(this.width, this.wrap).reverse());
        if (this.buffer_cache.length > this.data_height) {
            break;
        }
    }
};

ColumnView.prototype.fillUpUsingBuffer = function(from, to) {

    var length = from - to > this.buffer_cache.length ? this.buffer_cache.length : from - to;
    from = length - to;

    for (var i = 0; i < length; i++) {
        this.cursorY = from - i - 1;
        this.printLineDirect(this.buffer_cache[i]);
    }

    this.cursorY = from;
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

    this.cursorY = from + 1;
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

    var blank_line = this.main.view.empty_line.substring(0, this.width);

    this.cursorY = 0;
    for (var i = 0; i < this.data_height; i++) {
        this.printLineDirect(blank_line);
    }
    this.cursorY = 0;
};

ColumnView.prototype.clearFrom = function(from, num_lines) {

    var blank_line = this.main.view.empty_line.substring(0, this.width);

    for (var i = 0; i < num_lines; i++) {
        this.cursorY = from - i;
        this.printLineDirect(blank_line);
    }
    this.cursorY = from - num_lines;
};

ColumnView.prototype.checkOverflow = function() {

    if (this.cursorY + 1 > this.data_height) {
        this.clearToOverflow();
    }
};

ColumnView.prototype.clearToOverflow = function() {
    this.clear();
    this.fillUpUsingBuffer(this.main.overflow, 0);
};

ColumnView.prototype.printNewLines = function(num_lines) {

    if (num_lines > this.data_height) {
        this.current_line += num_lines;
        this.fillUp(this.data_height - 1, 0, this.current_line);
    } else {
        for (var i = 0; i < num_lines; i++) {
            this.current_line++;
            this.printBufferLine(this.current_line);
        }
    }
};

ColumnView.prototype.printBufferLine = function(buffer_index) {

    var line_array = this.buffer.line(buffer_index).trimmed(this.width, this.wrap);
    this.current_line_height = line_array.length;

    for (var i = 0; i < line_array.length; i++) {
        this.printLine(line_array[i]);
    }
};

ColumnView.prototype.clearCurrentLine = function() {
    this.clearFrom(this.cursorY, this.current_line_height);
    for (var i = 0; i < this.current_line_height; i++) {
        this.buffer_cache.shift();
    }
};

ColumnView.prototype.redrawCurrentLine = function() {
    this.clearCurrentLine();
    this.printBufferLine(this.current_line);
};

ColumnView.prototype.redrawCurrentLineFlow = function() {

    var line_array = this.buffer.line(this.current_line).trimmed(this.width, this.wrap);

    if (this.current_line_height < line_array.length) {
        this.redrawDataFlow(0);
        return;
    }

    this.clearCurrentLine();
    this.current_line_height = line_array.length;

    for (var i = 0; i < line_array.length; i++) {
        this.printLine(line_array[i]);
    }
};

ColumnView.prototype.printLine = function(line) {

    if (this.flow === false) {
        this.checkOverflow();
    }

    this.addToBufferCache(line);
    this.printLineDirect(line);
};

ColumnView.prototype.printLineDirect = function(line) {

    this.dataCursorPos(this.cursorY);
    writeToScreen(line);
    this.cursorY++;
};

ColumnView.prototype.addToBufferCache = function(line) {

    this.buffer_cache.unshift(line);

    if (this.buffer_cache.length > this.data_height) {
        this.buffer_cache.pop();
    }
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
