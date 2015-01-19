var width = require('./width');
var empty_line = new Array(1000).join(' ');
var color_regex = /\x1b\[[0-9;]*m/g;

var MainView = require('./MainView');


// column lines are very special strings.

function ColumnLine(value, legacy) {

    this._value = value || '';
    this.legacy = getLegacyCodes(legacy);
    this.codes = {};
    this.codeList = [];

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

    var line = (this.codes.strippedLine + MainView.empty_line).substring(0, to_length);

    var i = 0,
        // line = this.value + empty_line.substring(0, to_length),
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
        codeList = [],
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

            codeList = codeList.concat(code.replace(/[\x1b\[|m]/g, '').split(';'));
        }

        indexOfZero = codeList.lastIndexOf(0);
        if (indexOfZero > -1) {
            codeList = codeList.slice(indexOfZero + 1);
        }
    }

    this.codeList = this.legacy.concat(codeList);
    this.codes = {
        codeArray: codeArray,
        strippedLine: line
    };
};

ColumnLine.prototype.insertCodes = function(line) {

    var codes = this.codes.codeArray,
        legacy = this.legacy,
        length = line.length,
        code, idx;

    for (var i = codes.length - 1; i >= 0; i--) {
        idx = codes[i].idx;

        if (idx < length) {
            code = codes[i].code;
            line = spliceSlice(line, idx, 0, code);
        }
    }

    if (legacy.length > 0) {
        line = "\033[" + legacy.join(';') + "m" + line;
    }
    return line + "\u001b[0m";
};


// helper methods

function getLegacyCodes(line) {
    var legacy = [];

    if (line !== undefined) {
        legacy = line.codeList;
    }

    return legacy;
}

function spliceSlice(str, idx, count, add) {
    return str.slice(0, idx) + (add || "") + str.slice(idx + count);
}


module.exports = exports = ColumnLine;
