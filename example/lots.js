var keypress = require('keypress');
var spawn = require('child_process').spawn;

var columns = require('../main').create({
    // mode: 'debug'
    flow_mode: 'reset'
});


var a = columns.addColumn("Column A");
var b = columns.addColumn("Column B");
var c = columns.addColumn("Column C", {
    wrap: true,
    raw: true
});

var new_process = spawn('find', ['/', '*']);
// var new_process = spawn('find', ['../', 'node_modules']);
new_process.stdout.pipe(a, { end: false });
new_process.stderr.pipe(a, { end: false });

new_process.stdout.pipe(b, { end: false });
new_process.stderr.pipe(b, { end: false });

new_process.stdout.pipe(c, { end: false });
new_process.stderr.pipe(c, { end: false });

new_process.on('exit', function(code) {
    a.write('\nProcess exited with code: ' + code + '\n');
    b.write('\nProcess exited with code: ' + code + '\n');
    c.write('\nProcess exited with code: ' + code + '\n');
});
new_process.on('error', function(err) {
    console.log("Spawn Error:", err);
});


// exit the program gracefully to clean up terminal output properly

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    keypress(process.stdin);
    process.stdin.on('keypress', function(ch, key) {
        if (key && ((key.ctrl && key.name == 'c') || key.name == 'q')) {
            process.exit(0);
        }
    });
}
