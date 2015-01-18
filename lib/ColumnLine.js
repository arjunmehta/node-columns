var width = require('./width');
var empty_line = new Array(1000).join(' ');

if (process.stdout.isTTY) {

    empty_line = new Array(process.stdout.columns).join(' ');

    process.stdout.on('resize', function() {
        empty_line = new Array(process.stdout.columns).join(' ');
    });
}


// column lines are very special strings.

function ColumnLine(value, previous) {

    this.value = value || '';
    this.codes = [];

    Object.defineProperty(this, 'length', {
        get: function() {
            return this.value.length;
        }
    });
}

ColumnLine.prototype = new String;


// column line prototype getter/setter properties

Object.defineProperty(ColumnLine.prototype, 'width', {
    get: function() {
        return width(this.value);
    }
});


// column line prototype methods

ColumnLine.prototype.toString = ColumnLine.prototype.valueOf = function() {
    return this.value;
};

ColumnLine.prototype.backspace = function() {
    this.value = this.slice(0, -2);
    return this;
};

ColumnLine.prototype.write = function(data) {
    this.value += data;
    return this;
};

ColumnLine.prototype.trimmed = function(to_length) {

    var i = 0,
        line = this.value + empty_line.substring(0, to_length),
        truncated = line,
        truncated_width = width(truncated);

    while (truncated_width > to_length) {

        truncated = line.substring(0, to_length - i);
        truncated_width = width(truncated);

        i++;
    }

    return truncated + "\u001b[0m";
};


module.exports = exports = ColumnLine;
