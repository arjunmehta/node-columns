// strip all codes except styles.
var regex = /^(?!\x1b\[[0-9;]*m)(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;


function ColumnStream(column) {

    var _this = this;

    this.column = column;
    this.buffer = column.buffer;

    this.column.setEncoding('utf8');
    this.column.on('data', function(data) {
        _this.cleanData(data);
    });
}


// column stream prototype methods

ColumnStream.prototype.cleanData = function(data) {
    this.parseData(data.replace(regex, ''));
};

ColumnStream.prototype.parseData = function(data) {

    if (data.match(/^(\r|\n)$/) !== null) {
        this.buffer.newLine(data);
    } else if (data === '\b') {
        this.buffer.backspace(data);
    } else if (data.match(/\r?\n/) !== null) {
        this.buffer.addGeneric(data);
    } else {
        this.buffer.writeToCurrentLine(data);
    }

    this.renderData();
};

ColumnStream.prototype.renderData = function(data) {

    if (this.column.displaying === true) {

        if (this.column.columns.opts.flow === true) {
            this.column.view.redrawDataFlow();
        } else {
            this.column.view.redrawDataEffeciently();
        }
    }
};


module.exports = exports = ColumnStream;
