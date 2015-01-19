var stripAnsi = require('strip-ansi');

var regex = /\x1b\[[0-9;]*m/g;

var wcwidth = require('wcwidth.js').config({ control: 0 });

module.exports = function(str) {
  return wcwidth(stripAnsi(str));
};

function stripColors(str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
}