var empty_line;

if (process.stdout.isTTY) {
    empty_line = new Array(process.stdout.columns).join(' ');
    process.stdout.on('resize', function() {
        empty_line = new Array(process.stdout.columns).join(' ');
    });
} else {
    empty_line = new Array(500).join(' ');
}


function MainView(columns, mode, print) {

    this.columns = columns;

    this.tty_columns = process.stdout.columns;
    this.tty_rows = process.stdout.rows;
    this.empty_line = empty_line;

    trackStdout(this);
    displayMode(this, mode, print);
}

Object.defineProperty(MainView, 'empty_line', {
    get: function() {
        return empty_line;
    }
});


// main view getter/setter properties

Object.defineProperty(MainView.prototype, 'width', {
    get: function() {
        return this.tty_columns - this.columns.opts.margin.left - this.columns.opts.margin.right;
    }
});

Object.defineProperty(MainView.prototype, 'height', {
    get: function() {
        return this.tty_rows - this.columns.opts.margin.top - this.columns.opts.margin.bottom;
    }
});

Object.defineProperty(MainView.prototype, 'empty_line', {
    get: function() {
        return empty_line;
    }
});


// main view prototype methods

MainView.prototype.refresh = function() {

    this.tty_columns = process.stdout.columns;
    this.tty_rows = process.stdout.rows;
    this.empty_line = new Array(this.tty_columns + 1).join(' ');
    process.stdout.write('\033[2J');

    this.buildColumnArray();
    this.calculateColumnWidths();
};

MainView.prototype.buildColumnArray = function() {

    this.column_view_array = [];

    for (var column_name in this.columns.columns) {
        if (this.columns.columns[column_name] !== undefined) {
            this.columns.columns[column_name].displaying = false;
            this.column_view_array.push(this.columns.columns[column_name]);
        }
    }
};

MainView.prototype.calculateColumnWidths = function() {

    var columns = this.columns;

    var column, column_width,
        separator_size = columns.column_separator.length,
        total_width = this.width,
        number_of_column_views = this.column_view_array.length,
        flex_columns = [],
        percentage_columns = [],
        min_width = 5,
        number_of_flex_columns = 0,
        flex_column_width,
        extra,
        i;

    var available_width = total_width - (separator_size * (number_of_column_views - 1));
    var main_width = available_width;
    var separator_percentage = separator_size / total_width;
    var total_separator_percentage = separator_percentage * (number_of_column_views - 1);
    var percentage_left = 1 - total_separator_percentage;

    for (i = 0; i < this.column_view_array.length; i++) {

        column = this.column_view_array[i];
        column_width = 0;

        if (column.opts.percentage_width) {

            column_width = Math.floor(column.opts.percentage_width * percentage_left * main_width);
            column.view.width = column_width;
            percentage_columns.push(column);

        } else if (column.opts.fixed_width) {

            column_width = column.opts.fixed_width;
            column.view.width = column_width;

        } else {

            flex_columns.push(column);

        }

        available_width -= column_width;
    }

    number_of_flex_columns = flex_columns.length;

    if (available_width - (number_of_flex_columns * min_width) < 0) {
        this.column_view_array.pop();
        this.calculateColumnWidths();
        return;
    }

    if (number_of_flex_columns > 0) {

        flex_column_width = Math.floor(available_width / number_of_flex_columns);
        extra = available_width - (flex_column_width * number_of_flex_columns);

        for (i = 0; i < number_of_flex_columns; i++) {
            flex_columns[i].view.width = flex_column_width + (extra > 0 ? 1 : 0);
            extra--;
        }

    } else if (percentage_columns.length > 0) {

        var percentage_column_extra = Math.floor(available_width / percentage_columns.length);
        extra = available_width - (percentage_column_extra * percentage_columns.length);
        for (i = 0; i < percentage_columns.length; i++) {
            percentage_columns[i].view.width = percentage_columns[i].view.width + percentage_column_extra + (extra > 0 ? 1 : 0);
            extra--;
        }
    }

    this.calculateColumnPositions();
};

MainView.prototype.calculateColumnPositions = function() {

    if (this.column_view_array.length > 0) {

        this.column_view_array[0].view.x = this.columns.margin.left;

        for (var i = 1; i < this.column_view_array.length; i++) {
            this.column_view_array[i].view.x = this.column_view_array[i - 1].view.x + this.column_view_array[i - 1].view.width + this.columns.column_separator.length;
        }

        this.redraw();
    }
};

MainView.prototype.redraw = function() {

    for (var i = 0; i < this.column_view_array.length; i++) {
        this.column_view_array[i].displaying = true;
        this.column_view_array[i].view.redrawAll(i !== 0 ? true : false);
    }
};


// add a listener for tty resizes

function trackStdout(view) {

    if (process.stdout.isTTY) {
        process.stdout.on('resize', function() {
            view.refresh();
        });
    }
}


// set view modes on start/end

function displayMode(main, mode, print) {

    var printer;
    var buffer;

    if (mode !== 'debug') {

        process.stdout.write('\033[?25l\033[?1049h\033[H');
        process.on('exit', function() {
            process.stdout.write('\033[?25h\033[?1049l');

            if (print) {
                for (var columnName in main.columns.columns) {

                    buffer = main.columns.columns[columnName].buffer;
                    console.log('========================================================================');
                    console.log(main.columns.columns[columnName].header)
                    console.log('========================================================================');

                    for (var i = buffer.offset; i < buffer.size; i++) {
                        console.log(buffer.line(i).toString());
                    }
                    process.stdout.write('\033[0m');
                }
            }
        });
    }
}


module.exports = exports = MainView;
