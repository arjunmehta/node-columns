var columns = require('../main').create({
    mode: "debug"
});
var ColumnLine = require('../lib/ColumnLine');

var line = new ColumnLine("BB BBBBBB BBBBBBB BBBBB BBBBBBB BBBBBBBBBBB BBBBBB BBBBBBB BBBBBBBB");
console.log(line.trimmed(10, true));

exports['Exported Properly'] = function(test) {
    test.expect(2);

    test.equal(typeof columns, 'object');
    test.equal(typeof columns.addColumn, 'function');

    test.done();
};

exports['Column Line Code and Trim Support'] = function(test) {
    test.expect(2);

    var legacy_line = new ColumnLine("\033[32;33;35;31;37;32;33;38;5;24;35;31;37;31mHi there! How are you Today?");
    var line = new ColumnLine("Hi there! \033[32mHow are you Today?", {
        legacy: legacy_line
    });

    test.equal(typeof line, 'object');
    test.equal(line.trimmed(40), "\u001b[31mHi there! \u001b[32mHow are you Today?            \u001b[0m");

    test.done();
};


exports['tearDown'] = function(done) {
    done();
};
