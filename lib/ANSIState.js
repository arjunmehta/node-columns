var color_regex = /\x1b\[[0-9;]*m/g,
    attr,
    ansi_styles_flat = {};


// a set of related ansi style codes.
// only one of each group can be active at any time

var ansi_styles = {
    intensity: {
        1: "Bold",
        2: "Faint",
        21: "Bold Off",
        22: "Normal Intensity"
    },
    italic: {
        3: "Italic",
        20: "Fraktur",
        23: "Italic/Fraktur Off"
    },
    underline: {
        4: "Underline",
        24: "Underline Off"
    },
    blink: {
        5: "Blink: Slow",
        6: "Blink: Rapid",
        25: "Blink Off"
    },
    polarity: {
        7: "Negative Image",
        27: "Positive Image"
    },
    conceal: {
        8: "Conceal",
        28: "Conceal Off"
    },
    strikethrough: {
        9: "Crossed Out",
        29: "Crossed Out Off"
    },
    font: {
        10: "Primary Font",
        11: "Set Font 1",
        12: "Set Font 2",
        13: "Set Font 3",
        14: "Set Font 4",
        15: "Set Font 5",
        16: "Set Font 6",
        17: "Set Font 7",
        18: "Set Font 8",
        19: "Set Font 9"
    },
    foreground: {
        30: "Black",
        31: "Red",
        32: "Green",
        33: "Yellow",
        34: "Blue",
        35: "Magenta",
        36: "Cyan",
        37: "White",
        38: "Xterm Color Definition",
        39: "Default Foreground"
    },
    background: {
        40: "Black",
        41: "Red",
        42: "Green",
        43: "Yellow",
        44: "Blue",
        45: "Magenta",
        46: "Cyan",
        47: "White",
        48: "Xterm Color Definition",
        49: "Default Background"
    },
    framed: {
        51: "Framed",
        52: "Encircled",
        54: "Framed/Encircled Off"
    },
    overlined: {
        53: "Overlined",
        55: "Overlined Off"
    },
};


// build flatted ansi_styles table object with each element of the form:
// code: [attribute, description]

for (var attr_name in ansi_styles) {
    attr = ansi_styles[attr_name];
    for (var code in attr) {
        ansi_styles_flat[code] = [attr_name, attr[code]];
    }
}


// ANSI state constructor

function ANSIState(legacy) {

    this.attrs = {};
    this.reset = true;

    this.resetState();

    if (legacy !== undefined) {
        this.updateWithState(legacy);
    }
}


// ansi state prototype getter/setter properties

Object.defineProperty(ANSIState.prototype, 'code', {
    get: function() {
        return this.buildCode();
    }
});


// ANSI state prototype methods

ANSIState.prototype.update = function(codes) {

    var code;
    this.reset = false;

    for (var i = 0; i < codes.length; i++) {
        code = codes[i];
        if (code === '38' || code === '48') {
            this.updateWithSpecialCode(code, codes, i);
        } else {
            this.updateWithCode(code);
        }
    }
};

ANSIState.prototype.updateWithCode = function(code) {

    if (code === '0') {
        this.resetState();
    } else {
        if (ansi_styles_flat[code]) {
            this.attrs[ansi_styles_flat[code][0]] = code;
        }
    }
};

ANSIState.prototype.updateWithSpecialCode = function(code, codes, i) {

    switch (code) {
        case '38':
            this.xterm_foreground = xtermColor(codes, i);
            break;
        case '48':
            this.xterm_background = xtermColor(codes, i);
            break;
    }

    this.updateWithCode(code);
};

ANSIState.prototype.updateWithState = function(ansi_state) {

    var state_attributes = ansi_state.attrs;

    if (ansi_state.reset === true) {
        return;
    } else {
        this.reset = false;
        for (var attr_name in state_attributes) {
            this.attrs[attr_name] = state_attributes[attr_name];
        }
    }

    if (ansi_state.xterm_foreground) this.xterm_foreground = ansi_state.xterm_foreground;
    if (ansi_state.xterm_background) this.xterm_background = ansi_state.xterm_background;
};

ANSIState.prototype.updateWithRegexMatch = function(codes) {

    var code,
        codeList = [];

    if (codes !== null) {
        for (var i = 0; i < codes.length; i++) {
            code = codes[i];
            codeList = codeList.concat(code.replace(/[\x1b\[|m]/g, '').split(';'));
        }
    }

    this.update(codeList);
};

ANSIState.prototype.updateWithString = function(line) {

    var codes = line.match(color_regex),
        codeList = [],
        code;

    if (codes !== null) {
        for (var i = 0; i < codes.length; i++) {
            code = codes[i];
            codeList = codeList.concat(code.replace(/[\x1b\[|m]/g, '').split(';'));
        }
    }

    this.update(codeList);
};

ANSIState.prototype.resetState = function() {

    var attributes = this.attrs;

    for (var attr_name in ansi_styles) {
        attributes[attr_name] = null;
    }

    this.reset = true;
    this.xterm_foreground = undefined;
    this.xterm_background = undefined;
};

ANSIState.prototype.buildCode = function() {

    var attributes = this.attrs,
        line = '\033[',
        val,
        i = 0;

    if (this.reset === true) {

        line += '0m';

    } else {

        for (var attr_name in ansi_styles) {
            val = attributes[attr_name];
            if (val !== null) {

                if (val === '38') val += ";" + this.xterm_foreground.join(';');
                if (val === '48') val += ";" + this.xterm_background.join(';');

                line += (i === 0 ? '' : ';') + val;
                i++;
            }
        }

        line += 'm';
    }

    return line;
};


function xtermColor(codes, i) {
    var type = codes[i + 1];
    if (type === '2') {
        return codes.splice(i + 1, 4);
    } else {
        return codes.splice(i + 1, 2);
    }
}


module.exports = exports = ANSIState;
