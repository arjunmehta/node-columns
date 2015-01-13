var keypress = require('keypress');
var ColumnView = require('../main');
var split = require('split');
var columnView = new ColumnView();
var wcwidth = require('wcwidth');


// process.stdout.pipe(columnView);
process.stdin.setEncoding('utf8');
process.stdin.pipe(columnView);
process.stdout.write("\033[6n");

process.stdin.on('data', function(data){
	if(data.toString().indexOf('\u001b[') > -1){
		console.log(data.split(';'));
	}
});

if(process.stdin.isTTY){

  keypress(process.stdin);  
  // process.stdin.setRawMode(true);

  process.stdin.on('keypress', function (ch, key) {
    // console.log('got "keypress"', key);
    if (key && ((key.ctrl && key.name == 'c') || key.name == 'q') ) {
      // process.stdin.pause();
      process.exit(0);
    }
  });
}

process.stdin.on('error', function(err) {
    console.error("STDIN Error",err);
    process.exit(0);
});



console.log("TAB WIDTH", wcwidth('\t'));
console.log("한 WIDTH", wcwidth('한'));
console.log("color code WIDTH", wcwidth('\x1b32m'));
console.log("X WIDTH", wcwidth('X'));