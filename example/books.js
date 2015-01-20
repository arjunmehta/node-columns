var keypress = require('keypress');
var request = require('request');
var brake = require('brake');


var columns = require('../main').create({
    overflow: 3,
    maximum_buffer: 300,
    tab_size: 2,
    column_separator: '  '
});

var a = columns.addColumn('SHERLOCK HOLMES', {width: '23%', raw: true}), //http://www.gutenberg.org/ebooks/1661.txt.utf-8
    b = columns.addColumn('RELATIVITY', {width: '17%', raw: true}), //http://www.gutenberg.org/ebooks/7105.txt.utf-8
    c = columns.addColumn('HUCKLEBERRY FINN', {width: '60%', raw: true}); //http://www.gutenberg.org/ebooks/5001.txt.utf-8

    a.write('\033[31m'); // make this column red
    b.write('\033[32m'); // make this column green
    c.write('\033[36m'); // make this column blue

request('http://www.gutenberg.org/ebooks/1661.txt.utf-8').pipe(brake(300)).pipe(a);
request('http://www.gutenberg.org/ebooks/5001.txt.utf-8').pipe(brake(300)).pipe(b);
request('http://www.gutenberg.org/ebooks/7105.txt.utf-8').pipe(brake(300)).pipe(c);


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
