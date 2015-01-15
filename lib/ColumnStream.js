var regex = /^(?!\x1b\[[0-9;]*m)(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;

function ColumnStream(column) {

    var stream = this;

    this.column = column;
    this.column.setEncoding('utf8');
    this.column.on('data', function(data) {
        stream.cleanData(data);
    });

    this.data = [];
}

ColumnStream.prototype.cleanData = function(data) {
    this.parseData(data.replace(regex, ''));
};

ColumnStream.prototype.parseData = function(data) {

    var dataSplit;

    if (data.indexOf('\n') > -1) {
        dataSplit = data.split('\n');
        this.data = this.data.concat(dataSplit);

    } else {

        if (this.data.length === 0) {
            this.data.push('');
        }

        this.data[this.data.length - 1] += data;
    }

    this.renderData();
};

ColumnStream.prototype.renderData = function(data) {

    if (this.column.displaying === true) {

        if (this.column.flow === true) {
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
