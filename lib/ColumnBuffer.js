var ColumnLine = require('./ColumnLine');


function ColumnBuffer(column) {

    this.column = column;
    this.max_size = column.columns.opts.maximum_buffer;
    this.tab_size = column.columns.opts.tab_size;

    this.data = column.opts.raw === true ? [new ColumnLine('', {tab_size: this.tab_size})] : [];

    this.offset = 0;
}


// column buffer prototype getter/setter properties

Object.defineProperty(ColumnBuffer.prototype, 'size', {
    get: function() {
        return this.data.length + this.offset;
    }
});


// column buffer prototype methods

ColumnBuffer.prototype.line = function(num) {

    if (num - this.offset < 0) {
        return new ColumnLine(new Array(400).join('-'));
    } else {
        return this.data[num - this.offset];
    }
};

ColumnBuffer.prototype.add = function(line) {

    this.data.push(new ColumnLine(line, {
        legacy: this.data[this.data.length - 1],
        tab_size: this.tab_size
    }));

    if (this.data.length > this.max_size) {
        this.data.shift();
        this.offset++;
    }
};

ColumnBuffer.prototype.newLine = function(data) {
    this.add(data || '');
};

ColumnBuffer.prototype.backspace = function(data) {
    this.data[this.data.length - 1].backspace();
};

ColumnBuffer.prototype.addGeneric = function(data) {

    var dataSplit = data.split(/\n/);

    this.data[this.data.length - 1].write(dataSplit.shift());

    for (var i = 0; i < dataSplit.length; i++) {
        this.add(dataSplit[i]);
    }
};

ColumnBuffer.prototype.writeToCurrentLine = function(data) {
    this.data[this.data.length - 1].write(data);
};


module.exports = exports = ColumnBuffer;
