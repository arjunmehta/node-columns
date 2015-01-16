var keypress = require('keypress');

var columns = require('../main').create({
    margin: {
        top: 5,
        bottom: 2,
        right: 5,
        left: 5
    },
    separator: ' | ',
    header_separator: false
});

var a = columns.addColumn();

columns.addColumn("A2", {
    width: "50%"
});

columns.addColumn("A3", {
    width: 40,
    header: "testing"
});

columns.addColumn("A4");

columns.addColumn("A5");



// random writes

setInterval(function(){
	a.write(randomTruncate("AAAAAAAA" + new Date().getSeconds() + "\nAAAAAAAAAAAAAAABBBBSBBSBBBSAAAA"));
}, 550);

setInterval(function(){
	columns.column("A2").write(randomTruncate("Hello0000\n" + new Date() + "JJJJJJJJJJJJJJJAJJAGHAKJGAJHGAJAHGJAHGAJHGAJHGAJHGAJHAGJAHGJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ"));
}, 500);


setInterval(function(){
	columns.column("A3").write(randomTruncate("\033[32mCCCCCCCCCCCC\n" + new Date().getTime() + "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"));
}, 500);


setInterval(function(){
	columns.column("A4").write(randomTruncate("How are you Today???\n" + columns.column("A3").width + new Date().getTime() +  "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK\n"));
}, 1000);

setInterval(function(){
	columns.column("A5").write(randomTruncate("\033[2KDDDDDDDDDDDDDDDDDD\nDDDDD" + columns.column("A5").width + new Date().getTime() +  "\n"));
}, 100);

function randomTruncate(line){
	return line.substring(0, 6 + Math.random()*50);
}


// exit properly so we can restore state correctly

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
