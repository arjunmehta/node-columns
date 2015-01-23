var split = require('split');
var stripBom = require('strip-bom');

// strip all codes except styles.
var regex = /^(?!\x1b\[[0-9;]*m)(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;


function ColumnStream(column) {

    var _this = this;

    this.column = column;
    this.buffer = column.buffer;

    this.newline_waiting = false;
    this.linesync = 1;

    this.column.setEncoding('utf8');

    if (column.opts.raw) {
        this.column.on('data', function(data) {
            _this.parseData(cleanData(data));
        });
    } else {
        this.column.pipe(split()).on('data', function(data) {
            _this.buffer.newLine(cleanData(data));
            _this.renderData();
        });
    }
}


// column stream prototype methods

ColumnStream.prototype.parseData = function(data) {

    if (data === '\r') {
        if (this.newline_waiting === true) {
            this.buffer.newLine('');
            this.renderData();
        }
        this.newline_waiting = true;
    } else {

        if (data === '\n') {
            this.buffer.newLine('');
        } else if (data === '\b') {
            this.buffer.backspace(data);
        } else if (data.match(/\n/) !== null) {
            this.buffer.addGeneric(data);
        } else if (data === '') {

        } else {
            if (this.newline_waiting === true) {
                this.buffer.newLine('');
            }
            this.buffer.writeToCurrentLine(data);
        }

        this.newline_waiting = false;
        this.renderData();
    }
};

ColumnStream.prototype.renderData = function(data) {

    var buffer_size = this.buffer.size;
    var new_lines = buffer_size - this.linesync;
    this.linesync = buffer_size;

    if (this.column.displaying === true) {

        if (this.column.columns.opts.flow === true) {
            this.column.view.redrawDataFlow();
        } else {
            if (new_lines > 0) {
                this.column.view.printNewLines(new_lines);
            } else {
                this.column.view.redrawCurrentLine();
            }
        }
    }
};


// helper methods

function cleanData(data) {
    return stripBom(data).replace(regex, '');
}


module.exports = exports = ColumnStream;
