## Scratchpad

What should the behaviour be for

### Column width

### Column height






## Column
source.pipe(column);

column.set(options);

column.clear();
column.write(lines);
column.redraw();

column.remove();

### Properties

column.flow = true

column.percentage_width = function(percentage){
    return 1/percentage;
}

column.width = {
                    get: function(){return this.opts.width},
                    set: function(width){
                        if(number) this.opts.width = width;
                        else{
                            this.opts.width = Math.round(tty.width*toPercentage(width))
                        }                
                    }
                }


column.height = "100%"

column.header = "akahkauy";

column.headerSeparator = "-";
column.separator = " | ";

column.background = "color"

## Columns

source.pipe(columns.column("A"));

columns.addColumns({name: options})
columns.addColumn("A", options)
columns.removeColumn("A")
columns.removeColumns([])

columns.offsetX = "0"
columns.offsetY = "0"

columns.width = "100%"
columns.height = "100%"

columns.padding = "X X X X"


