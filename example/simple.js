var keypress = require('keypress');
var columns = require('../main').create({flow_mode: 'reset'});


var a = columns.addColumn("Column A");
var b = columns.addColumn("Column B");
columns.addColumn("Column C", {raw: true, wrap: true});

setInterval(function() {
    a.write((new Date().getSeconds() % 2 === 0) ? "TICK\n" : "TOCK\n");
    b.write("The Time: " + new Date() + "\n");
}, 1000);

process.stdin.setRawMode(true);
process.stdin.pipe(columns.column("Column C"));
columns.column("Column C").write("Try typing something...");


// exit the program gracefully to clean up terminal output properly

if (process.stdin.isTTY) {

    keypress(process.stdin);
    process.stdin.on('keypress', function(ch, key) {
        if (key && ((key.ctrl && key.name == 'c') || key.name == 'q')) {
            process.exit(0);
        }
        if (key && key.name === "backspace") {
            columns.column("Column C").write('\b');
        }
    });
}
