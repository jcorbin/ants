if (typeof(Ants) == 'undefined')
    Ants = {};

Ants.Grid = (function() {
    var DefaultColors = ['#fff', '#000'];
    var DefaultRows = 50;
    var DefaultCols = 50;

    function Grid(canvas, rows, cols, colors) {
        this.colors = colors || DefaultColors;
        this.canvas = canvas;
        this.ants = [];
        this.rows = rows || DefaultRows;
        this.cols = cols || DefaultCols;
        this.data = [];
        for (var i=0; i<this.rows; i++) {
            var row = [];
            for (var j=0; j<this.cols; j++)
                row.push(0);
            this.data.push(row);
        }

        window.addEventListener('resize', this.updateSize.bind(this));
        this.updateSize();
    }

    Grid.prototype.setSize = function(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        // TODO: non-destructive size-change
        this.data = [];
        for (var i=0; i<this.rows; i++) {
            var row = [];
            for (var j=0; j<this.cols; j++)
                row.push(0);
            this.data.push(row);
        }

        // TODO: out of bound ants

        this.updateSize();
    };

    Grid.prototype.updateSize = function() {
        this.scale = Math.min(
            this.canvas.parentElement.clientWidth/this.cols,
            this.canvas.parentElement.clientHeight/this.rows
        );

        this.canvas.width = this.cols * this.scale;
        this.canvas.height = this.rows * this.scale;
        var ctx = this.canvas.getContext('2d');
        ctx.scale(this.scale, this.scale);

        this.render();
    };

    Grid.prototype.randomize = function() {
        var n_colors = this.colors.length;
        for (var i=0; i<this.rows; i++)
            for (var j=0; j<this.cols; j++)
                this.data[i][j] = Math.floor(Math.random() * n_colors);
    };

    Grid.prototype.drawCell = function(row, col) {
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = this.colors[this.data[row][col]];
        ctx.fillRect(row, col, 1, 1);
    };

    Grid.prototype.render = function() {
        var ctx = this.canvas.getContext('2d');

        // Flood fill color 0
        ctx.fillStyle = this.colors[0];
        ctx.fillRect(0, 0, this.cols, this.rows);

        // TODO does it pay to aggregate draws by fill color?
        for (var i=0; i<this.rows; i++)
            for (var j=0; j<this.cols; j++)
                if (this.data[i][j] != 0) // already flood filled 0
                    this.drawCell(i, j);

        for (var i=0; i<this.ants.length; i++)
            this.ants[i].draw();
    };

    Grid.prototype.addAnt = function(ant) {
        this.ants.push(ant);
        ant.grid = this;
        if (! this.isInBounds(ant.row, ant.col)) {
            // Place ants on a spiral initially
            var t = (this.ants.length+1);
            ant.row = Math.floor((t * Math.sin(t) + 50)/100 * this.rows);
            ant.col = Math.floor((t * Math.cos(t) + 50)/100 * this.cols);
        }
        ant.draw();
    };

    Grid.prototype.isInBounds = function(row, col) {
        return row >= 0 && col >= 0 && row <= this.rows && col <= this.cols;
    };

    Grid.prototype.step = function() {
        for (var i=0; i<this.ants.length; i++) {
            var ant = this.ants[i];
            var old_row = ant.row, old_col = ant.col;
            ant.step();
            this.drawCell(old_row, old_col);
            ant.draw();
        }
    };

    return Grid;
})();
