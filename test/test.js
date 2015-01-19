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

exports['Column Line'] = function(test) {
    test.expect(2);

    var legacy_line = new ColumnLine("\033[32;33;35;31;37;32;33;35;31;37;32;1mHi there! \033[31mHow are you Today?")
    var line = new ColumnLine("\033[22;32;24mHi there! \033[33mHow are you Today?", legacy_line);

    test.equal(typeof line, 'object');
    // test.equal(line, "\033[32;24mHi there! \033[11mHow are you Today?");
    test.equal(true, true);

    console.log(JSON.stringify(legacy_line.trimmed(100)));
    console.log(JSON.stringify(line.trimmed(100)));
    console.log(legacy_line.trimmed(100));
    console.log(line.trimmed(100));

    test.done();
};

exports['tearDown'] = function(done) {
    done();
};
