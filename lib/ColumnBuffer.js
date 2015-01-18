var ColumnLine = require('./ColumnLine');

function ColumnBuffer(column) {

    this.data = [new ColumnLine()];
    this.codes = [{}];
    this.max_size = 5000;
}




Object.defineProperty(ColumnBuffer.prototype, 'size', {
    get: function() {
        return this.data.length;
    }
});




ColumnBuffer.prototype.line = function(num, length) {
    return this.data[num];
};

ColumnBuffer.prototype.newLine = function(data) {
    this.data.push(new ColumnLine());
};

ColumnBuffer.prototype.backspace = function(data) {
    this.data[this.data.length - 1].backspace();
};

ColumnBuffer.prototype.addGeneric = function(data) {
    var dataSplit = data.split(/\r?\n/);

    this.data[this.data.length - 1].write(dataSplit.shift());

    for (var i = 0; i < dataSplit.length; i++) {
        this.data.push(new ColumnLine(dataSplit[i]));
    }
};

ColumnBuffer.prototype.writeToCurrentLine = function(data) {
    this.data[this.data.length - 1].write(data);
};



module.exports = exports = ColumnBuffer;
