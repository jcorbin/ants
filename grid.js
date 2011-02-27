if (typeof(Ants) == 'undefined')
    Ants = {};

Ants.Grid = (function() {
    var DefaultColors = ['#fff', '#000'];
    var DefaultRows = 50;
    var DefaultCols = 50;

    function frozenMethod(f) {
        function wrapped() {
            var old = this.frozen;
            this.frozen = true;
            var r = f.apply(this, arguments);
            this.frozen = old;
            if (this.needsSizeUpdate)
                this.updateSize(); // calls render
            else
                this.render(); // or we do
            return r;
        }
        return wrapped;
    }

    function Grid(canvas, rows, cols, colors) {
        this.colors = colors || DefaultColors;
        this.canvas = canvas;
        this.ants = [];
        this.rows = rows || DefaultRows;
        this.cols = cols || DefaultCols;
        this.initial_state = [this.rows, this.cols];
        this.frozen = false;
        this.needsSizeUpdate = false;
        window.addEventListener('resize', this.updateSize.bind(this));
        this.reset();

        this.running = null;
        this.runDelay = 64;
        this.runSteps = 1;
    }

    Grid.prototype = new EventDispatcher();

    Grid.prototype.runStep = function() {
        this.step(this.runSteps);
    };

    Grid.prototype.play = function() {
        if (this.running == null) {
            this.running = setInterval(this.runStep.bind(this), this.runDelay);
            this.dispatch("play");
        }
    };

    Grid.prototype.stop = function() {
        if (this.running != null) {
            clearInterval(this.running);
            this.running = null;
            this.dispatch("stop");
        }
    };

    Grid.prototype.runFaster = function(factor) {
        if (this.runDelay > 1)
            this.runDelay /= factor;
        else
            this.runSteps *= factor;
        if (this.running != null) {
            clearInterval(this.running);
            this.running = setInterval(this.runStep.bind(this), this.runDelay);
        }
    };

    Grid.prototype.runSlower = function(factor) {
        if (this.runSteps > 1)
            this.runSteps /= factor;
        else
            this.runDelay *= factor;
        if (this.running != null) {
            clearInterval(this.running);
            this.running = setInterval(this.runStep.bind(this), this.runDelay);
        }
    };

    Grid.prototype.reset = frozenMethod(function() {
        this.rows = this.initial_state[0];
        this.cols = this.initial_state[1];

        this.data = [];
        for (var i=0; i<this.rows; i++) {
            var row = [];
            for (var j=0; j<this.cols; j++)
                row.push(0);
            this.data.push(row);
        }
        this.iteration = 0;
        for (var i=0; i<this.ants.length; i++)
            this.ants[i].reset();
        this.updateSize();
        this.dispatch("reset");
    });

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
        if (this.frozen) {
            this.needsSizeUpdate = true;
            return;
        }

        this.scale = Math.min(
            this.canvas.parentElement.clientWidth/this.cols,
            this.canvas.parentElement.clientHeight/this.rows
        );

        this.canvas.width = this.cols * this.scale;
        this.canvas.height = this.rows * this.scale;
        var ctx = this.canvas.getContext('2d');
        ctx.scale(this.scale, this.scale);

        this.render();

        if (this.needsSizeUpdate)
            this.needsSizeUpdate = false;
    };

    Grid.prototype.randomize = function() {
        var n_colors = this.colors.length;
        for (var i=0; i<this.rows; i++)
            for (var j=0; j<this.cols; j++)
                this.data[i][j] = Math.floor(Math.random() * n_colors);
    };

    Grid.prototype.drawCell = function(row, col) {
        if (this.frozen) return;
        var ctx = this.canvas.getContext('2d');
        ctx.fillStyle = this.colors[this.data[row][col]];
        ctx.fillRect(col, row, 1, 1);
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
        ant.reset();
    };

    Grid.prototype.isInBounds = function(row, col) {
        return row >= 0 && col >= 0 && row < this.rows && col < this.cols;
    };

    Grid.prototype.step = function(n) {
        for (var i=0; i<n; i++)
            for (var j=0; j<this.ants.length; j++)
                this.ants[j].step();
        this.iteration += n;
        this.dispatch("step");
    };

    Grid.prototype.setIteration = frozenMethod(function(i) {
        if (i == this.iteration)
            return;
        if (i < this.iteration)
            throw Error("unimplemented: rewinding simulation");
        this.step(i - this.iteration);
    });

    return Grid;
})();
