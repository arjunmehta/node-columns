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
            new_lines++;
        });

        setInterval(function() {
            if (new_lines > 0) {
                _this.renderData(new_lines);
                new_lines = 0;
            }
        }, Math.round(1000 / 12));
    }
}


// column stream prototype methods

ColumnStream.prototype.parseData = function(data) {

    var new_lines = 0;

    if (data === '\r') {
        if (this.newline_waiting === true) {
            this.buffer.newLine('');
            this.renderData(1);
        }
        this.newline_waiting = true;
    } else {

        if (data === '\n') {
            this.buffer.newLine('');
            new_lines++;
        } else if (data === '\b') {
            this.buffer.backspace();
        } else if (data.match(/\n/) !== null) {
            new_lines += this.buffer.addGeneric(data);
        } else if (data === '') {

        } else {
            if (this.newline_waiting === true) {
                this.buffer.newLine('');
                this.renderData(1);
            }
            this.buffer.writeToCurrentLine(data);
        }

        this.newline_waiting = false;
    }

    this.renderData(new_lines);
};




ColumnStream.prototype.renderData = function(new_lines) {

    // var buffer_size = this.buffer.size;
    // var new_lines = buffer_size - this.linesync;
    // this.linesync = buffer_size;

    if (this.column.displaying === true) {

        if (this.column.columns.opts.flow === true) {
            this.column.view.redrawDataFlow();
        } else {
            // console.log(new_lines);
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
