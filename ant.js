if (typeof(Ants) == 'undefined')
    Ants = {};

Ants.Ant = (function() {
    var Right = 1;
    var Left = 0;
    var DefaultTurns = "RL";

    function closestPoint(ref, points) {
        var cur = null, q = 0;
        points.forEach(function(point) {
            var pq =
                Math.pow(ref[0] - point[0], 2) +
                Math.pow(ref[1] - point[1], 2);
            if (cur == null || pq < q) {
                cur = point;
                q = pq;
            }
        });
        return cur;
    }

    function parseTurnDirections(s) {
        var d = [];
        s = s.toLowerCase();
        for (var i=0; i<s.length; i++) {
            var c = s[i];
            if (c == 'r')
                d.push(Right);
            else if (c == 'l')
                d.push(Left);
            else
                throw Error('Invalid turn direction');
        }
        return d;
    }

    function Ant(row, col, heading, color, turns) {
        this.row = row || null;
        this.col = col || null;
        this.heading = heading || 0;
        this.color = color || '#f00';
        this.turns = parseTurnDirections(turns || DefaultTurns);
    }

    Ant.prototype.draw = function() {
        // TODO: oriented shape
        var ctx = this.grid.canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(this.row+0.25, this.col+0.25, 0.5, 0.5);
    };

    var HalfPI = Math.PI/2;
    var TwoPI = 2*Math.PI;

    Ant.prototype.step = function() {
        var c = this.grid.data[this.row][this.col];
        var t = this.turns[c];
        switch (t) {
            case Right:
                this.heading = (this.heading + HalfPI) % TwoPI;
                break;
            case Left:
                this.heading = (this.heading - HalfPI) % TwoPI;
                break;
        }
        this.grid.data[this.row][this.col] = (c + 1) % this.grid.colors.length;
        this.col += Math.round(Math.cos(this.heading));
        this.row += Math.round(Math.sin(this.heading));

        if (! this.grid.isInBounds(this.row, this.col)) {
            // TODO smallest non-zero diff
            var dr, dc;
            if (this.row < 0)
                dr = 0 - this.row;
            else if (this.row >= this.grid.rows)
                dr = this.grid.rows - this.row + 1;
            else
                dr = 0;
            if (this.col < 0)
                dc = 0 - this.col;
            else if (this.col >= this.grid.cols)
                dc = this.grid.cols - this.col + 1;
            else
                dc = 0;
            var delta = Math.max(dc, dr)*2;
            this.grid.setSize(this.grid.rows+delta, this.grid.cols+delta);
        }
    };

    Ant.prototype.getInBounds = function() {
        if (this.row == null || this.col == null) {
            // initital placement when added to grid
            var t = (this.grid.ants.length+1);
            ant.row = Math.floor((t * Math.sin(t) + 50)/100 * this.grid.rows);
            ant.col = Math.floor((t * Math.cos(t) + 50)/100 * this.grid.cols);
        } else if (! this.grid.isInBounds(this.row, this.col)) {
            // grid resized leaving this ant out of bounds
            throw Error('unimplemented');
        }
    };

    return Ant;
})();
