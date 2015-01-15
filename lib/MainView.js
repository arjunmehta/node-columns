function MainView(columns) {

    this.columns = columns;

    this.tty_columns = process.stdout.columns;
    this.tty_rows = process.stdout.rows;
    this.empty_line = new Array(this.tty_columns + 1).join(" ");

    trackStdout(this);
}


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


// main view prototype methods

MainView.prototype.refresh = function() {

    var main = this;
    this.tty_columns = process.stdout.columns;
    this.tty_rows = process.stdout.rows;
    this.empty_line = new Array(this.tty_columns + 1).join(" ");

    for (var i = 0; i < this.tty_rows; i++) {
        process.stdout.cursorTo(0, i);
        process.stdout.write('\033[2K');
    }

    process.stdout.write('\033[2J');

    this.buildColumnArray();

    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(function() {
        main.calculateColumnWidths(main.tty_columns);
    // }, 100);
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

MainView.prototype.calculateColumnWidths = function(screenWidth) {

    // if (screenWidth !== this.tty_columns) {
    //     return;
    // }

    var columns = this.columns;

    var column, column_width,
        separator_size = columns.separator.length,
        total_width = this.width,
        number_of_column_views = this.column_view_array.length,
        flex_columns = [],
        minWidth = 5,
        flex_column_width,
        extra,
        i;

    var available_width = total_width - (separator_size * (number_of_column_views - 1));
    var separator_percentage = separator_size / total_width;
    var total_separator_percentage = separator_percentage * (number_of_column_views - 1);
    var percentage_left = 1 - total_separator_percentage;

    for (i = 0; i < this.column_view_array.length; i++) {

        column = this.column_view_array[i];
        column_width = 0;

        if (column.opts.percentage_width) {
            column_width = Math.floor(column.opts.percentage_width * percentage_left * available_width);
            column.view.width = column_width;
        } else if (column.opts.fixed_width) {
            column_width = column.opts.fixed_width;
            column.view.width = column_width;
        } else {
            flex_columns.push(column);
        }

        available_width -= column_width;
    }

    if (available_width - (flex_columns.length * minWidth) < 0) {
        this.column_view_array.pop();
        this.calculateColumnWidths(screenWidth);
        return;
    }

    flex_column_width = Math.floor(available_width / flex_columns.length);
    extra = flex_columns % available_width - 1;

    for (i = 0; i < flex_columns.length; i++) {
        flex_columns[i].view.width = flex_column_width + (extra > 0 ? 1 : 0);
        extra--;
    }

    this.calculateColumnPositions();
};

MainView.prototype.calculateColumnPositions = function() {

    if (this.column_view_array.length > 0) {

        this.column_view_array[0].view.x = this.columns.margin.left;

        for (var i = 1; i < this.column_view_array.length; i++) {
            this.column_view_array[i].view.x = this.columns.margin.left + this.column_view_array[i - 1].view.x + this.column_view_array[i - 1].view.width + this.columns.separator.length;
        }

        this.redraw();
    }
};

MainView.prototype.redraw = function() {
    for (var i = 0; i < this.column_view_array.length; i++) {
        this.column_view_array[i].displaying = true;
        this.column_view_array[i].view.redrawAll();
    }
};


// add a listener for tty resizes

function trackStdout(view) {
    process.stdout.on('resize', function() {
        view.refresh();
    });
}

process.stdout.write("\033[?1049h\033[H");

process.on('exit', function(){
    process.stdout.write("\033[?1049l");
});


module.exports = exports = MainView;
