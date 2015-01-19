var ColumnLine = require('./ColumnLine');

function ColumnBuffer(column) {

    this.data = [new ColumnLine()];
    this.max_size = 5000;
}


// column buffer prototype getter/setter properties

Object.defineProperty(ColumnBuffer.prototype, 'size', {
    get: function() {
        return this.data.length;
    }
});


// column buffer prototype methods

ColumnBuffer.prototype.line = function(num, length) {
    return this.data[num];
};

ColumnBuffer.prototype.add = function(line) {
    this.data.push(new ColumnLine(line, this.data[this.data.length - 1]));

    if (this.data.length > this.max_size) {
        this.data.shift();
    }
};

ColumnBuffer.prototype.newLine = function(data) {
    this.add('');
};

ColumnBuffer.prototype.backspace = function(data) {
    this.data[this.data.length - 1].backspace();
};

ColumnBuffer.prototype.addGeneric = function(data) {
    var dataSplit = data.split(/\r?\n/);

    this.data[this.data.length - 1].write(dataSplit.shift());

    for (var i = 0; i < dataSplit.length; i++) {
        this.add(dataSplit[i]);
    }
};

ColumnBuffer.prototype.writeToCurrentLine = function(data) {
    this.data[this.data.length - 1].write(data);
};


module.exports = exports = ColumnBuffer;
