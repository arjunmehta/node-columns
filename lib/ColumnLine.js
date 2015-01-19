var width = require('./width');
var empty_line = new Array(1000).join(' ');
var color_regex = /\x1b\[[0-9;]*m/g;

var MainView = require('./MainView');
var ANSIState = require('./ANSIState');


// column lines are very special strings.

function ColumnLine(value, legacy) {

    this._value = value || '';
    this.legacy = legacy !== undefined ? legacy.ansi_state : new ANSIState();
    this.codes = {};
    this.codeList = [];
    this.ansi_state = new ANSIState(this.legacy);

    Object.defineProperty(this, 'length', {
        get: function() {
            return this.value.length;
        }
    });

    this.buildCodes();
}

ColumnLine.prototype = new String;

ColumnLine.prototype.toString = ColumnLine.prototype.valueOf = function() {
    return this.value;
};


// column line prototype getter/setter properties

Object.defineProperty(ColumnLine.prototype, 'width', {
    get: function() {
        return width(this.value);
    }
});

Object.defineProperty(ColumnLine.prototype, 'value', {
    get: function() {
        return this._value;
    },
    set: function(value) {
        this._value = value;
        this.buildCodes();
    }
});


// column line prototype methods

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
        line = (this.codes.strippedLine + MainView.empty_line).substring(0, to_length),
        truncated = line.substring(0, to_length),
        truncated_width = width(truncated);

    while (truncated_width > to_length) {
        i++;
        truncated = line.substring(0, to_length - i);
        truncated_width = width(truncated);
    }

    truncated = this.insertCodes(truncated);

    return truncated;
};

ColumnLine.prototype.buildCodes = function() {

    var idx = 0,
        line = this._value,
        codes = this.match(color_regex),
        codeArray = [],
        code, codeObj, indexOfZero;

    if (codes !== null) {

        for (var i = 0; i < codes.length; i++) {

            idx = line.indexOf(codes[i]);
            code = codes[i];

            codeObj = {
                code: code,
                idx: idx
            };

            codeArray[i] = codeObj;
            line = spliceSlice(line, idx, code.length);
        }
    }

    this.ansi_state.updateWithRegexMatch(codes);

    this.codes = {
        codeArray: codeArray,
        strippedLine: line
    };
};

ColumnLine.prototype.insertCodes = function(line) {

    var codes = this.codes.codeArray,
        length = line.length,
        code, idx;

    for (var i = codes.length - 1; i >= 0; i--) {
        idx = codes[i].idx;

        if (idx < length) {
            code = codes[i].code;
            line = spliceSlice(line, idx, 0, code);
        }
    }

    line = this.legacy.code + line;

    return line + "\u001b[0m";
};


// helper methods

function spliceSlice(str, idx, count, add) {
    return str.slice(0, idx) + (add || "") + str.slice(idx + count);
}


module.exports = exports = ColumnLine;
