var columns = require('../main').create({
    mode: "debug"
});
var ColumnLine = require('../lib/ColumnLine');


exports['Exported Properly'] = function(test) {
    test.expect(2);

    test.equal(typeof columns, 'object');
    test.equal(typeof columns.addColumn, 'function');

    test.done();
};

exports['Column Line Code and Trim Support'] = function(test) {
    test.expect(3);

    var legacy_line = new ColumnLine("\033[32;33;35;31;37;32;33;38;5;24;35;31;37;31mHi there! How are you Today?");
    var line = new ColumnLine("Hi there! \033[32mHow are you Today?", {
        legacy: legacy_line
    });

    test.equal(typeof line, 'object');
    test.equal(line.trimmed(40).length, 1);

    test.equal(line.trimmed(40)[0], "\u001b[31mHi there! \u001b[32mHow are you Today?            \u001b[0m");

    test.done();
};

exports['Column Line Wrap'] = function(test) {
    test.expect(3);

    var line = new ColumnLine("BB BBBBBB BBBBBBB BBBBB BBBBBBB BBBBBBBBBBB BBBBBB BBBBBBB BBBBBBBB");    

    test.equal(line.trimmed(10, true).length, 8);
    test.equal(line.trimmed(10, true)[0], '\u001b[mBB BBBBBB \u001b[0m');
    test.equal(line.trimmed(10, true)[4], '\u001b[mBBBBBBBBBB\u001b[0m');

    test.done();
};

exports['tearDown'] = function(done) {
    done();
};
