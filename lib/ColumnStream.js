var regex = /^(?!\x1b\[[0-9;]*m)(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/g;

function ColumnStream(column) {

    var stream = this;

    this.column = column;
    this.column.setEncoding('utf8');
    this.column.on('data', function(data) {
        stream.cleanData(data);
    });

    this.data = [''];
}

ColumnStream.prototype.cleanData = function(data) {
    this.parseData(data.replace(regex, ''));
    // console.log("FLOWWW", this.column.columns.flow);
};

ColumnStream.prototype.parseData = function(data) {

    var dataSplit;

    if (data.match(/^(\r|\n)$/)) {

        this.data.push('');

    } else if (data === '\b') {

        this.data[this.data.length - 1] = this.data[this.data.length - 1].slice(0, -2);

    } else if (data.match(/\r?\n/)) {

        dataSplit = data.split(/\r?\n/);
        this.data[this.data.length - 1] += dataSplit.shift();
        this.data = this.data.concat(dataSplit);

    } else {

        this.data[this.data.length - 1] += data;
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
