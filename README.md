# columns
[![Build Status](https://travis-ci.org/arjunmehta/node-protogram.svg?branch=master)](https://travis-ci.org/arjunmehta/node-columns)

![columns title image](https://raw.githubusercontent.com/arjunmehta/node-columns/image/image/cover.png)

This module takes **any number of text streams and puts them neatly into full screen columns** with optional headers, and your choice of column and header separators.

- **columns act as writable streams**
- **a minimal, yet easily scalable interface**
- **colour support and limited formatting support**
- **custom column headers as well as column and header separators**.
- **choice of flow modes (efficient or natural)**

#### `*` note: in active development
This module is in active development. Please consider contributing: [issues](https://github.com/arjunmehta/node-columns/issues/new), [feature requests](https://github.com/arjunmehta/node-columns/issues/new) and especially [development help](https://github.com/arjunmehta/node-columns).

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
Add columns to your program. Give them a name, and set options for them.Add option flags to your program. Shortcuts will automatically be made based on the first available character of the specified option name.

```javascript
var a = columns.addColumn("Column A");
// OR
columns
    .addColumn("Column B")
    .addColumn("Column C");
```

### Write or Pipe Text to Your Columns!

Columns act like any writable-stream would. Just add more to it, by calling the `write` method, or `pipe` from another readable stream.

```javascript
setInterval(function(){
    columns.column("Column A").write(new Date().getSeconds() % 2 == 0 ? "TICK\n" : "TOCK\n");
    columns.column("Column B").write("The Time: " + new Date() + "\n");    
}, 1000);

process.stdin.pipe(columns.column("Column C"));
```

### Customize The Appearance of Columnns

Finally, you can also customize the appearance of your columns.

#### Add Custom Headers
#### Adjust the Width of Columns
#### Add Custom Column and Header separators
#### Add Margins to the Column Set

## Additional Documentaton to Come...

## License

```
The MIT License (MIT)
Copyright (c) 2014 Arjun Mehta
```
