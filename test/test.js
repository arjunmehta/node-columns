var columns = require('../main').create({mode: "debug"});

exports['Exported Properly'] = function(test) {
    test.expect(2);
    
    test.equal(typeof columns, 'object');
    test.equal(typeof columns.addColumn, 'function');

    test.done();
};

exports['tearDown'] = function(done) {
    done();
};