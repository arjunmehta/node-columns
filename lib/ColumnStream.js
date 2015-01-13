// Display Stream

var util = require('util');
var stream = require('stream');
var Writable = stream.Writable || require('readable-stream').Writable;

util.inherits(ColumnView, Writable);


function ColumnStream(column) {

    this.column = column;
    this.view = column.view;

    this.data = [];    
    this.displaying = true;

    Writable.call(this, opts);
}

ColumnStream.prototype._write = function(chunk, encoding, callback) {
    this.updateData(chunk.toString());
    callback();
};


ColumnStream.prototype.updateData = function(data) {

    var dataSplit = data.split("\n");
    var i = 0;

    if (dataSplit[dataSplit.length - 1] === '') dataSplit.pop();

    if (this.displaying === true) {

        if (this.column.flow === true) {

            this.data = this.data.concat(dataSplit);
            this.view.redrawFlow();

        } else {

            for (i = 0; i < dataSplit.length; i++) {
                this.data.push(dataSplit[i]);
                this.view.printLine(dataSplit[i]);                
            }
        }
    } else {
        this.data = this.data.concat(dataSplit);
    }
};


module.exports = exports = ColumnStream;
