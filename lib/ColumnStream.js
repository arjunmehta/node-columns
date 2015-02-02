var split = require('split');
var stripBom = require('strip-bom');

// strip all codes except styles.
var regex = /^(?!\x1b\[[0-9;]*m)(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;


function ColumnStream(column) {

    var _this = this;
    var new_lines = 0;

    this.column = column;
    this.column.setEncoding('utf8');

    this.buffer = column.buffer;

    this.newline_waiting = false;
    this.linesync = 1;

    if (column.opts.raw) {
        this.column.on('data', function(data) {
            _this.parseData(cleanData(data));
        });
    } else {
        this.column.pipe(split()).on('data', function(data) {
            _this.buffer.newLine(cleanData(data));
        });
    }
}


// column stream prototype methods

ColumnStream.prototype.parseData = function(data) {

    if (data === '\r') {
        if (this.newline_waiting === true) {
            this.buffer.newLine('');
        }
        this.newline_waiting = true;
    } else {

        if (data === '\n') {
            this.buffer.newLine('');
        } else if (data === '\b') {
            this.buffer.backspace();
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
    }
};


// helper methods

function cleanData(data) {
    return stripBom(data).replace(regex, '');
}


module.exports = exports = ColumnStream;
