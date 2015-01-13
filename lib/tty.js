
function TTY() {
    this.numTTYcolumns = process.stdout.columns;
    this.numTTYrows = process.stdout.rows;
    this.emptyLine = new Array(this.numTTYcolumns + 1).join(" ");
}

TTY.prototype.update = function() {
    this.numTTYcolumns = process.stdout.columns;
    this.numTTYrows = process.stdout.rows;
    this.emptyLine = new Array(this.numTTYcolumns + 1).join(" ");
};

module.exports = exports = new TTY();
