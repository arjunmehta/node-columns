var util = require('util');
var stream = require('stream');
var Writable = stream.Writable || require('readable-stream').Writable;

util.inherits(ColumnStream, Writable);


function ColumnStream(column) {

    this.column = column;

    this.data = [];    
    this.displaying = true;

    Writable.call(this);
}


// column stream getter/setter properties

ColumnStream.prototype._write = function(chunk, encoding, callback) {
    this.updateData(chunk.toString());
    callback();
};

ColumnStream.prototype.updateData = function(data) {

    var dataSplit = data.split("\n");

    if (dataSplit[dataSplit.length - 1] === '') dataSplit.pop();

    if (this.displaying === true) {

        if (this.column.flow === true) {

            this.data = this.data.concat(dataSplit);
            this.column.view.redrawDataFlow();

        } else {

            for (var i = 0; i < dataSplit.length; i++) {
                this.data.push(dataSplit[i]);
                this.column.view.printLine(dataSplit[i]);                
            }
        }
    } else {
        this.data = this.data.concat(dataSplit);
    }
};


module.exports = exports = ColumnStream;
