var keypress = require('keypress');
var request = require('request');
var brake = require('brake');


var columns = require('../main').create({
    overflow: 3,
    maximum_buffer: 300,
    tab_size: 2,
    column_separator: '  '
    // flow_mode: 'reset'
});

var a = columns.addColumn('SHERLOCK HOLMES', {width: '23%', wrap: true, raw: true}),
    b = columns.addColumn('RELATIVITY', {width: '17%', wrap: true, raw: true}),
    c = columns.addColumn('HUCKLEBERRY FINN', {width: '60%', raw: true});

    a.write('\033[31m'); // make this column red
    b.write('\033[32m'); // make this column green
    c.write('\033[36m'); // make this column blue

request('http://mirror.its.dal.ca/gutenberg/1/6/6/1661/1661.txt').pipe(brake(50)).pipe(a);
request('https://archive.org/download/theeinsteintheor11335gut/11335.txt').pipe(brake(50)).pipe(b);
request('http://mirror.its.dal.ca/gutenberg/7/1/0/7105/7105.txt').pipe(brake(50)).pipe(c);


// exit properly so we can restore state correctly

if (process.stdin.isTTY) {

    keypress(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', function(ch, key) {

        if (key && ((key.ctrl && key.name == 'c') || key.name == 'q')) {
            process.stdin.pause();
            process.exit(0);
        }
    });
}
