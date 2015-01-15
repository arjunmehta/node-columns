# columns
[![Build Status](https://travis-ci.org/arjunmehta/node-protogram.svg?branch=master)](https://travis-ci.org/arjunmehta/node-columns)

![columns title image](https://raw.githubusercontent.com/arjunmehta/node-columns/image/image/cover.png)

This module takes **any number of text streams and puts them neatly into full screen columns** with optional headers, and your choice of column and header separators.

- **columns act as writable streams**
- **a minimal, yet easily scalable interface**
- **colour support and limited formatting support**
- **custom column headers as well as column and header separators**.
- **choice of flow modes (efficient or natural)**


## `*` note: in active development
This module is in active development. Please consider contributing: [issues](), [feature requests]() and especially [development help]().

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

Finally, the most important step! Now that you've set everything up, you're ready to parse your program's arguments.

```javascript
program.parse(process.argv);
```

### View Examples


