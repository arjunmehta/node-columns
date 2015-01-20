var keypress = require('keypress');

var columns = require('../main').create({
    margin: {
        top: 5,
        bottom: 2,
        right: 5,
        left: 5
    },
    column_separator: ' | ',
    header_separator: '-_-_',
    flow_mode: 'reset',
    overflow: 3,
    max_buffer: 30,
    tab_size: 4
    // mode: "debug"
});

var a = columns.addColumn();

columns.addColumn("A2", {
    width: "50%"
});

columns.addColumn("A3", {
    width: 40,
    header: "CUSTOM HEADER"
});

columns.addColumn("A4");

columns.addColumn("A5");



// random writes

count = 0;
var color;

setInterval(function() {
    a.write("A" + count + "한글\t한글한글한글한글한글한글한글한글한글한글한글한글한글한글한글한글한글" + "\n");
}, 10);

// columns.column("A2").write('\033[43m');

setInterval(function() {
    if (count % 1 === 0) {
        color = Math.round(Math.random() * 255);
    }
    columns.column("A2").write("B" + color + '' + count + (count % 1 === 0 ? "\033[38;5;" + (color) + 'm' : '') + randomTruncate("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB") + "\n");
    count++;
}, 10);


setInterval(function() {
    columns.column("A3").write(randomTruncate("C" + count + "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC") + "\n");
}, 10);


setInterval(function() {
    columns.column("A4").write(randomTruncate("D" + count + "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD") + "\n");
}, 10);

setInterval(function() {
    columns.column("A5").write(randomTruncate("E" + count + "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE") + "\n");
    count++;
}, 10);

function randomTruncate(line) {
    return line.substring(0, 6 + Math.random() * 50);
}




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
