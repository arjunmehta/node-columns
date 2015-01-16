# columns
[![Build Status](https://travis-ci.org/arjunmehta/node-columns.svg)](https://travis-ci.org/arjunmehta/node-columns)

![columns title image](https://raw.githubusercontent.com/arjunmehta/node-columns/image/image/cover.png)

#### In Active Development

This module is very new and is in active development. Please consider contributing: [issues](https://github.com/arjunmehta/node-columns/issues/new), [feature requests](https://github.com/arjunmehta/node-columns/issues/new) and especially [development help](https://github.com/arjunmehta/node-columns).

---

This module takes **any number of text streams and puts them neatly into full screen columns**.

- **columns act as writable streams**
- **a minimal, yet easily scalable interface**
- **colour support and limited formatting support**
- **custom column headers, and separators for headers and columns**.
- **choice of write efficiency modes (flow or overflow)**

## Installation
```bash
npm install --save columns
```


## Basic Usage

### Include and Create your Columns

```javascript
var columns = require('columns').create();
```

### Add Columns
Add columns to your program. Give them a name, and set options for them. Add option flags to your program. Shortcuts will automatically be made based on the first available character of the specified option name.

```javascript
var a = columns.addColumn("Column A");
// OR
columns.addColumn("Column B");
columns.addColumn("Column C");
```

### Write or Pipe Text to Your Columns!

Columns act like any writable-stream does. Just add more to it, by calling the `write` method, or `pipe` from another readable stream.

```javascript
setInterval(function(){
    columns.column("Column A").write((new Date().getSeconds() % 2 === 0) ? "TICK\n" : "TOCK\n");
    columns.column("Column B").write("The Time: " + new Date() + "\n");
}, 1000);

process.stdin.setRawMode(true);
process.stdin.pipe(columns.column("Column C"));
```


## Advanced Usage

The above was just to get you started. Columns can do a whole lot more, and can be customized in a few ways.

### Global Columns Settings

You can customize the appearance and behaviour of your columns with global settings, which can be set in a few ways: by passing `options` through when you first create your columns; or by setting them individual properties.

```javascript
var columns = require('columns').create({
    column_separator: "|"    
});
// OR
column.column_separator: "|"    
```

#### Add Custom Column and Header separators

Globally, you can set the appearance of your header and column separators to any character string. These will be repeated, for the width/height of your column. Set either to `false` to not render any header.

```javascript
columns.header_separator = "_-_-"
```

```javascript
columns.column_separator = "|-|"
```

#### Add Margins to the Column Set

If you'd like to add space around your column set, set the margin for the `top`, `right`, `bottom` and `left` of your column set. Values represent character spaces.

```javascript
columns.margin = {
    top: 3,
    right: 2,
    bottom: 0,
    left: 2
}
```


### Column Specific Settings

You can set column specific settings in two main ways: when you create them using options, or by setting properties on already instantiated columns.

```javascript
var a = columns.addColumn("A", {
    width: "25%"
});
// OR
a.width = "25%"
```

#### Column Widths

By default, columns distribute their widths evenly to the size of the TTY. But columns widths can be fixed or scaled to a percentage of the terminal width.

It should be noted that columns that do not fit in the terminal, based on their set width will not be rendered. They will still be able to receive input, and their buffer will be displayed  again if the terminal is scaled enough to fit them, or other columns are removed.

```javascript
columns.column("A").width = "25%" // approximately 25% of the tty width
// OR
columns.column("A").width = "30" //30 tty columns wide
```

#### Add Custom Headers

By default, columns are displayed with the given column name as the header. If you'd like to set a different header, this can be done easily with the `header` property for each column.

Set the `header` to `false` to hide the header and its separator.

```javascript
// custom header in green
columns.column("A").header = "\033[32mCustom Header\033[0m"; 
```


## API

### Columns.create(options)
Initialize and return your `columns` object. This will, by default, clear the screen and go into full terminal screen mode.

- `options` **Object**:
    - `header_separator` **String**: Specify a string to be repeated horizontally under defined headers.
    - `column_separator` **String**: Specify a string to be repeated vertically between columns.
    - `margin` **Object**: Set the margins for the entire column set in the form: `{top: Number, right: Number, bottom: Number, left: Number }`

```javascript
var columns = require('columns').create({
    column_separator: '|'
});
```

Will create a column set with columns separated by the `|` character.

----

### columns.addColumn(name, options)
Returns a new `Column` object and simultaneously adds it to your `columns`.

- `name` **String**: Set the name of your column. This will by default also set the header of your column to this value. If you do not provide a name, you will not be able to refer to it with the **columns.column()** method.
- `options` **Object**:
    - `width` **String|Number**: Set the width of this column. This can be as a percentage (**String** with `%`) or a number of terminal characters width (**Number**)
    - `header` **String**: Specify the header title of the column.
    
```javascript
var a = columns.addColumn("Column A", {
    width: "50%"
}); 
// OR
columns.addColumn("Column B");
// OR
var c = columns.addColumn({
    width: 26,
    header: "Column C"
});
```

### columns.column(name)
Return the column object with the given name from the column set.
```javascript
var b = columns.column("Column B")
b.width = "30%"
```

### columns.removeColumn(name)
Remove the column with the given name from the column set.

```javascript
var b = columns.column("Column B")
b.width = "30%"
```

### columns.flow = **Boolean**
Toggle flow mode, `true` or `false`. Default is `true`.

`true`: Will behave like any terminal would. When text is written to the column, it will be added to the bottom, and all text above will flow up.

`false`: When text reached the bottom of the column, the column is cleared, and text begins again at the top of the column. This is actually much more efficient (less re-writing of the screen) and recommended for remote connections.

### columns.header_separator = **String**
Sets the `header_separator` of all columns.

### columns.column_separator = **String**
Sets the `column_separator` between all columns.

----

### column.write(chunk)
Write data to your column!! Stream data will be encoded as `UTF8`.

### column.clear()
Clear the column's buffer and view.

### column.remove()
Remove the column and its view from the column set.


## License

```
The MIT License (MIT)
Copyright (c) 2014 Arjun Mehta
```
