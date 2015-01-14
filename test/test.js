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
    width: "25%"
});

columns.addColumn("A3", {
    width: 40,
    header: "testing"
});

columns.addColumn("A4");

columns.addColumn("A5");


setInterval(function(){
	columns.column("A2").write("Hello\n");
}, 500);