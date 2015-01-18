var stripAnsi = require('strip-ansi');
var wcwidth = require('wcwidth.js').config({ control: 0 });

module.exports = function(str) {
  return wcwidth(stripAnsi(str));
};