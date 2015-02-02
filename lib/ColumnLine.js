var width = require('wcwidth.js');
var ANSIState = require('ansi-state');

var MainView = require('./MainView');
var color_regex = /\x1b\[[0-9;]*m/g;


// column lines are very special strings.

function ColumnLine(value, opts) {

    opts = opts || {};

    this._value = value || '';

    this.tab_size = opts.tab_size || 2;
    this.legacy_state = opts.legacy !== undefined ? opts.legacy.ansi_state : new ANSIState();
    this.ansi_state = new ANSIState(this.legacy_state);
    this.wrap_state = null;

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
    return this._value;
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


ColumnLine.prototype.trimmed = function(to_length, wrap) {

    if (wrap === true) {
        return this.trimmedWrap(to_length);
    } else {
        return this.trimmedNoWrap(to_length);
    }
};

ColumnLine.prototype.trimmedNoWrap = function(to_length) {

    var i = 0,
        line = (this.replaceTabs(this.codes.strippedLine) + MainView.empty_line).substring(0, to_length),
        truncated = line.substring(0, to_length),
        truncated_width = width(truncated);

    while (truncated_width > to_length) {
        i++;
        truncated = line.substring(0, to_length - i);
        truncated_width = width(truncated);
    }

    truncated = this.insertCodes(truncated, 0);

    return [truncated];
};

ColumnLine.prototype.trimmedWrap = function(to_length, raw_line, offset, total_length, lineArray) {

    lineArray = lineArray === undefined ? [] : lineArray;
    offset = offset === undefined ? 0 : offset;
    raw_line = raw_line || this.replaceTabs(this.codes.strippedLine);
    total_length = total_length === undefined ? raw_line.length : total_length;

    var i = 0,
        line = raw_line + MainView.empty_line,
        truncated = line.substring(offset, offset + to_length),
        truncated_width = width(truncated);

    while (truncated_width > to_length) {
        i++;
        truncated = line.substring(offset, offset + to_length - i);
        truncated_width = width(truncated);
    }

    for (var new_offset = offset + to_length - i; new_offset >= offset; new_offset--) {
        if ((line[new_offset - 1] !== ' ' && line[new_offset] === ' ') || (line[new_offset - 1] === ' ' && line[new_offset] !== ' ')) break;
    }

    if (new_offset > offset) {
        truncated = line.substring(offset, new_offset);
        truncated_width = width(truncated);
        while (line[new_offset] === ' ') {
            new_offset++;
        }
    } else {
        new_offset = offset + to_length - i;
    }

    lineArray.push(this.insertCodes(truncated, offset) + MainView.empty_line.substring(0, to_length - truncated_width));

    if (new_offset < total_length) {
        this.trimmedWrap(to_length, raw_line, new_offset, total_length, lineArray);
    }

    return lineArray;
};

ColumnLine.prototype.replaceTabs = function(line) {

    var j = 0,
        tab_size = this.tab_size;

    for (var i = 0; i < line.length; i++) {
        if (line[i] === '\t') line = spliceSlice(line, i, 1, '         '.slice(0, tab_size - (j % tab_size)));
        else if (line[i] === '\r') line = spliceSlice(line, i, 1, '');
        j += width(line[i]);
    }

    return line;
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

    this.ansi_state.updateWithArray(codes);

    this.codes = {
        codeArray: codeArray,
        strippedLine: line
    };
};

ColumnLine.prototype.insertCodes = function(line, offset) {

    var codes = this.codes.codeArray,
        length = line.length,
        state = [],
        code, idx;

    if (offset === 0) {
        this.wrap_state = new ANSIState(this.legacy_state);
    }

    for (var i = codes.length - 1; i >= 0; i--) {
        idx = codes[i].idx;

        if (idx < length + offset && idx >= offset) {
            code = codes[i].code;
            state.unshift(code);
            line = spliceSlice(line, idx - offset, 0, code);
        }
    }

    line = this.wrap_state.code + line;
    this.wrap_state.updateWithArray(state);

    return line + '\u001b[0m';
};


// helper methods

function spliceSlice(str, idx, count, add) {
    return str.slice(0, idx) + (add || '') + str.slice(idx + count);
}


module.exports = exports = ColumnLine;
