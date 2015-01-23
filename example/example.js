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
    maximum_buffer: 300,
    tab_size: 2,
    // mode: 'debug'
});

var a = columns.addColumn({
    wrap: true
});

columns.addColumn("A2", {
    width: "50%",
    wrap: true
});

columns.addColumn("A3", {
    width: 40,
    wrap: true,
    header: "CUSTOM HEADER"
});

columns.addColumn("A4");

columns.addColumn("A5");



// random writes

count = 0;
var color;

setInterval(function() {
    a.write("A" + count + "한 글\tB한 글한 글한 글한글한글한글한 글" + "\n");
}, 220);

// columns.column("A2").write('\033[43m');

setInterval(function() {
    if (count % 1 === 0) {
        color = Math.round(Math.random() * 255);
    }
    columns.column("A2").write("B" + '' + count + (count % 1 === 0 ? "\033[38;5;" + (color) + 'm' : '') + randomTruncate("BB BBBBBBBBBBBBBBBBBB BBBBBBB BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB") + "\n");
    count++;
}, 210);


setInterval(function() {
    columns.column("A3").write(randomTruncate("C" + count + "0 1 \t2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 ") + "\n");
}, 1000);


setInterval(function() {
    columns.column("A4").write(randomTruncate("D" + count + "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD") + "\n");
}, 500);

setInterval(function() {
    columns.column("A5").write(randomTruncate("E" + count + "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE") + "\n");
}, 200);

function randomTruncate(line) {
    return line.substring(0, 6 + Math.random() * (line.length - 6));
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
