var keypress = require('keypress');


process.stdout.write("\033[?1049h\033[H");

if(process.stdin.isTTY){

  keypress(process.stdin);  
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', function (ch, key) {

    if (key && ((key.ctrl && key.name == 'c') || key.name == 'q') ) {
      process.stdin.pause();
      process.exit(0);
    }
  });
}

process.on('exit', function(){
	process.stdout.write("\033[?1049l");
});

var columns = require('../main').create({
    margin: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    }
});

columns.addColumn("A1");

columns.addColumn("A2", {
    width: "50%"
});

columns.addColumn("A3", {
    width: 40,
    header: "testing"
});

columns.addColumn("A4");

columns.addColumn("A5");


setInterval(function(){
	columns.column("A2").write("Hello\n" + new Date().getTime());
}, 500);


setInterval(function(){
	columns.column("A3").write("How are you Today???" + columns.column("A3").width + new Date().getTime() +  "\n");
}, 1000);

setInterval(function(){
	columns.column("A5").write("ZZZZzzZZ" + columns.column("A5").width + new Date().getTime() +  "\n");
}, 100);
