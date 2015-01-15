var columns = require('../main');

exports['Exported Properly'] = function(test) {
    test.expect(2);
    
    test.equal(true, true);
    test.equal(true, true);

    test.done();
};

exports['Other Test'] = function(test) {
    test.expect(2);
    
    test.equal(true, true);
    test.equal(true, true);

    test.done();
};

exports['tearDown'] = function(done) {
    done();
};