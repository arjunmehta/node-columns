# columns
[![Build Status](https://travis-ci.org/arjunmehta/node-columns.svg)](https://travis-ci.org/arjunmehta/node-columns)

![columns title image](https://raw.githubusercontent.com/arjunmehta/node-columns/image/image/cover.png)

![demo image](https://raw.githubusercontent.com/arjunmehta/node-columns/image/image/demo-main.gif)

#### In Active Development

This module is very new and is in active development. Please consider contributing: [issues](https://github.com/arjunmehta/node-columns/issues/new), [feature requests](https://github.com/arjunmehta/node-columns/issues/new) and especially [development help](https://github.com/arjunmehta/node-columns), and [tests](https://github.com/arjunmehta/node-columns).

This module takes **any number of text streams and puts them neatly into full screen columns**.

- **columns act as writable streams**
- **a minimal, yet easily scalable interface**
- **ANSI code support (colours and text styles), line wrapping and raw modes(!)**
- **custom column headers, and separators for headers and columns**.
- **choice of buffer flow modes for display efficiency control**


## Installation
```bash
npm install --save columns
```


## Basic Usage

### Include and Create your Columns

```javascript
var columns = require('columns').create()
```

### Add Columns
Add columns to your program. Give them a name, and set options for them.

```javascript
var a = columns.addColumn('Column A')
// OR
columns.addColumn('Column B')
// OR
var c = columns.addColumn('Column C', {raw : true}) // character feed
```

### Write or Pipe Text to Your Columns!

Columns act like any writable-stream does. Just add more to it, by calling the `write` method, or `pipe` from another readable stream.

```javascript
setInterval(function(){
    a.write((new Date().getSeconds() % 2 === 0) ? 'TICK\n' : 'TOCK\n')
    columns.column("Column B").write('The Time: ' + new Date() + '\n')
}, 1000)

process.stdin.setRawMode(true)
process.stdin.pipe(c)
```


## Advanced Usage

The above was just to get you started. Columns can do a whole lot more, and can be customized in a few ways.

### Column Specific Settings

You can set column specific settings in two main ways: when you create them using options, or by setting properties on already instantiated columns. **Some settings can only be set upon creation**.

```javascript
var a = columns.addColumn('A', {
    width: '25%',
    header: 'Column A'
})
// OR
a.width = '25%'
a.header = 'Column A'
```

#### Column Width

By default, columns distribute their widths evenly to the size of the TTY. But column widths can also be set to a fixed value, or scaled to a percentage of the terminal width.

Columns that do not fit in the terminal based on their determined width will be automatically hidden from view. They will still be able to receive input to their buffer, so written data will be displayed again if the terminal is scaled enough to fit them, or other columns are removed.

```javascript
columns.column('A').width = '25%' // approximately 25% of the tty width
// OR
columns.column('A').width = 30 //30 tty columns wide
```

#### Line Wrapping

By default, column lines are not wrapped. If you'd like to enable this experimental feature, use the `wrap` option when adding your column.

```javascript
var a = columns.addColumn('A', {wrap: true})
```


#### Custom Header

By default, columns are displayed with the given column name as the header. If you'd like to set a different header, this can be done easily with the `header` property for each column.

Set the `header` to `false` to hide the header and its separator.

```javascript
// custom header in green
columns.column('A').header = '\033[32mCustom Header\033[0m' 
```


#### RAW mode

By default, columns parse incoming data by new lines. If you'd like to have your columns display as the buffer comes in, create it with the `raw` option. This must be set when you create your column.

```javascript
var a = columns.addColumn('A', {raw: true})
```


### Global Columns Settings

You can customize the appearance and behaviour of your columns with global settings, which can be set in a few ways: by passing `options` through when you first create your columns; or by setting them individual properties.

```javascript
var columns = require('columns').create({
    column_separator: '|'    
})
// OR
column.column_separator: '|'    
```

#### Print All Column Buffers on Exit
Because this module uses a special print mode during regular display, on Exit, all contents on the screen are wiped. You can optionally print out the contents of each column linearly upon exiting. Just set to the `print` option to `true`.

```javascript
var columns = require('columns').create({
    print: true    
})
```

#### Add Custom Column and Header separators

Globally, you can set the appearance of your header and column separators to any character string. These will be repeated, for the width/height of your column. Set either to `false` to not render any header.

```javascript
columns.header_separator = '_-_-'
```

```javascript
columns.column_separator = '|-|'
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

#### Flow Mode
You have two options with how your columns handle overflows:

**Push Mode**: When your column buffer fills up past the height of your column, the text will 'push' the previous buffer up, the same behaviour as most terminals. This will essentially redraw the column output, because it is shifting every line up by 1. This is the default.

**Reset Mode**: When text reaches the bottom of the column, the column view is cleared (though the buffer remains), and printing begins again at the top of the column. This is actually much more efficient (less re-writing of the screen) and recommended for remote connections. It also makes the terminal do less work. If you set this mode, you can also set how many rows of the buffer will `overflow` after reset.

If you need to adjust the flow mode, it must be set when you create your columns:

```javascript
var columns = require('columns').create({
    flow_mode: 'reset',
    overflow: 4
})
```


#### Maximum Buffer Size
By default, the maximum buffer size will be `500` lines per column. If you need more or less, adjust the `maximum_buffer` option to control this. Again, you'll need to set this when you are creating your columns instance:

```javascript
var columns = require('columns').create({
    maximum_buffer: 2000
}) 
```


#### Tab Size
Columns has to use its own tab parsing. Set the number of spaces you'd like your tabs to print as with the `tab_size` option. Defaults to `2`.

```javascript
columns.tab_size = 4
```


## API

### Columns.create(options)
Initialize and return your `columns` object. This will, by default, clear the screen and go into full terminal screen mode.

- `options` **Object**:
    - `header_separator` **String**: Specify a string to be repeated horizontally under defined headers.
    - `column_separator` **String**: Specify a string to be repeated vertically between columns.
    - `margin` **Object**: Set the margins for the entire column set in the form: `{top: Number, right: Number, bottom: Number, left: Number }`
    - `flow_mode` **String**: Set the type of flow mode to use when rendering buffer overflows: `reset` or `push`. If using `reset` you can also set the `overflow` option.
    - `overflow` **Number**: Set along with `flow_mode:'reset'`, the number of buffer lines to overflow after reset.
    - `maximum_buffer` **Number**: Set the number of lines you want available stored in your buffer (Default 500).
    - `tab_size` **Number**: Set the number of spaces you want to render your tabs as.

```javascript
var columns = require('columns').create({
    column_separator: '|',
    flow_mode: 'push'
})
```

Will create a column set with columns separated by the `|` character with the `push` flow mode.

### columns.addColumn(name, options)
Returns a new `Column` object and simultaneously adds it to your `columns`.

- `name` **String**: Set the name of your column. This will by default also set the header of your column to this value. If you do not provide a name, you will not be able to refer to it with the **columns.column()** method.
- `options` **Object**:
    - `width` **String|Number**: Set the width of this column. This can be as a percentage (**String** with `%`) or a number of terminal characters width (**Number**).
    - `header` **String**: Specify the header title of the column. Set to `false` to show no header.
    - `raw` **Boolean**: Set if you want the stream to be read in by character instead of by line.
    - `wrap` **Boolean**: Set to enable line wrapping. (Experimental).
    
```javascript
var a = columns.addColumn('Column A', {
    width: '50%'
}) 
// OR
columns.addColumn('Column B')
// OR
var c = columns.addColumn({
    width: 26,
    header: 'Column C'
})
```

### columns.column(name)
Return the column object with the given name from the column set.
```javascript
var b = columns.column('Column B')
b.width = '30%'
```

### columns.removeColumn(name)
Remove the column with the given name from the column set.

```javascript
var b = columns.column('Column B')
b.width = '30%'
```

### columns[setting]
Some settings can be set dynamically after your column set has been instantiated:

- `header_separator` **String|false**: Set this to any repeatable string, and it will show up under headers for columns that have headers. Set to `false` if you'd prefer not to have header separators.
- `column_separator` **String|false**: Set this to any vertically repeatable string and it will show up between columns. Set to `false` if you'd prefer not to have column separators.

```javascript
columns.header_separator = '_-_-'
columns.column_separator = ' | '
```

### column.write(chunk)
Write data to your column stream!! Stream data will be encoded as `utf8`.

```javascript
setInterval(function(){
    column.write('The Time: ' + new Date() + '\n')
}, 1000)
```

### column.clear()
Clear the column's buffer and view.

```javascript
column.clear()
```

### column.remove()
Remove the column and its view from the column set.

```javascript
column.remove()
```

### column[setting]
Some settings can be set dynamically after your column has been instantiated:

- `width` **String|Number**: Set the width of this column. This can be as a percentage (**String** with `%`) or a number of terminal characters width (**Number**).
- `header` **String|false**: Specify the header title of the column. Set to `false` to show no header.

```javascript
columns.header_separator = '_-_-'
columns.column_separator = ' | '
```

## License

```
The MIT License (MIT)
Copyright (c) 2014 Arjun Mehta
```
