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

    Grid.prototype.corners = function() {
        var right = this.cols-1;
        var bottom = this.rows-1;
        return [
            [0, 0],
            [0, bottom],
            [right, bottom],
            [right, 0]
        ];
    };

    Grid.prototype.resize = function(rows, cols) {
        var dc = (cols - this.cols)/2,
            dr = (rows - this.rows)/2;
        this.resizeBy(
            Math.floor(dc), Math.ceil(dc),
            Math.floor(dr), Math.ceil(dr)
        );
    };

    Grid.prototype.resizeBy = function(leftof, rightof, above, below) {
        if (leftof > 0)
            for (var i=0; i<this.rows; i++)
                for (var j=0; j<leftof; j++)
                    this.data[i].unshift(0);
        else if (leftof < 0)
            for (var i=0; i<this.rows; i++)
                for (var j=0; j<leftof; j++)
                    this.data[i].shift();
        this.cols += leftof;

        if (rightof > 0)
            for (var i=0; i<this.rows; i++)
                for (var j=0; j<rightof; j++)
                    this.data[i].push(0);
        else if (rightof < 0)
            for (var i=0; i<this.rows; i++)
                for (var j=0; j<rightof; j++)
                    this.data[i].pop();
        this.cols += rightof;

        var newRow = function() {
            var row = [];
            for (j=0; j<this.cols; j++)
                row.push(0);
            return row;
        }.bind(this);

        if (above > 0)
            for (var i=0; i<above; i++)
                this.data.unshift(newRow());
        else if (above < 0)
            for (var i=0; i<above; i++)
                this.data.shift();
        this.rows += above;

        if (below > 0)
            for (var i=0; i<below; i++)
                this.data.push(newRow());
        else if (below < 0)
            for (var i=0; i<below; i++)
                this.data.pop();
        this.rows += below;

        for (var i=0; i<this.ants.length; i++) {
            var ant = this.ants[i];
            ant.row += above;
            ant.col += leftof;
            ant.getInBounds();
        }

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
        ant.getInBounds();
        ant.draw();
    };

    Grid.prototype.isInBounds = function(row, col) {
        return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
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
