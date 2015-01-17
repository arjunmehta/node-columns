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
    overflow: 3
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

setInterval(function() {
    a.write(randomTruncate("A" + count + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") + "\n");
}, 500);

setInterval(function() {
    columns.column("A2").write(randomTruncate("B" + count + "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB") + "\n");
}, 500);


setInterval(function() {
    columns.column("A3").write(randomTruncate("C" + count + "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC") + "\n");
}, 500);


setInterval(function() {
    columns.column("A4").write(randomTruncate("D" + count + "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD") + "\n");
}, 500);

setInterval(function() {
    columns.column("A5").write(randomTruncate("E" + count + "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE") + "\n");
    count++;
}, 500);

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
