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

    function Ant(row, col, heading, color, turns) {
        this.row = row || null;
        this.col = col || null;
        this.heading = heading || 0;
        this.color = color || '#f00';
        this.setTurnString(turns || DefaultTurns);
        if (this.row != null && this.col != null)
            this._saveInitialState();
        else
            this.initial_state = null;
    }

    Ant.prototype = new EventDispatcher();

    Ant.TurnLeft = Left;
    Ant.TurnRight = Right;

    Ant.Turn2Name = function(turn) {
        switch (turn) {
            case Right:
                return "Right";
            case Left:
                return "Left";
        }
    }

    Ant.Name2Turn = function(name) {
        switch (name.toLowerCase()) {
            case "right":
                return Right;
            case "left":
                return Left;
        }
    };

    Ant.prototype.getTurnString = function() {
        return this.turns.map(function(turn) {
            return Ant.Turn2Name(turn)[0].toUpperCase();
        }).join("");
    };

    Ant.prototype.setTurnString = function(s) {
        s = s.toLowerCase();
        if (this.turns && s == this.getTurnString().toLowerCase())
            return;
        var d = [];
        for (var i=0; i<s.length; i++) {
            var c = s[i];
            if (c == 'r')
                d.push(Right);
            else if (c == 'l')
                d.push(Left);
            else
                throw Error('Invalid turn direction');
        }
        this.turns = d;
        this.dispatch("turnsChanged");
        if (this.grid) {
            if (this.grid.length == d.length)
                this.grid.reset();
            else
                this.grid.setNumColors(d.length);
        }
    };

    Ant.prototype._saveInitialState = function() {
        this.initial_state = [this.row, this.col, this.heading];
    };

    Ant.prototype.reset = function() {
        if (this.initial_state) {
            this.grid.drawCell(this.row, this.col);
            this.row = this.initial_state[0];
            this.col = this.initial_state[1];
            this.heading = this.initial_state[2];
        }
        this.getInBounds();
        this.draw();
    };

    Ant.prototype.draw = function() {
        if (this.grid.frozen) return;
        // TODO: oriented shape
        var ctx = this.grid.canvas.getContext('2d');
        ctx.fillStyle = this.color;
        ctx.fillRect(this.col+0.25, this.row+0.25, 0.5, 0.5);
    };

    var HalfPI = Math.PI/2;
    var TwoPI = 2*Math.PI;

    Ant.prototype.step = function() {
        // Update current cell
        var c = this.grid.data[this.row][this.col];
        this.grid.data[this.row][this.col] = (c + 1) % this.grid.colors.length;
        this.grid.drawCell(this.row, this.col);

        // Move
        var t = this.turns[c];
        switch (t) {
            case Right:
                this.heading = (this.heading + HalfPI) % TwoPI;
                break;
            case Left:
                this.heading = (this.heading - HalfPI) % TwoPI;
                break;
        }
        this.col += Math.round(Math.cos(this.heading));
        this.row += Math.round(Math.sin(this.heading));

        // Bound check, resize grid if we went outside the rid
        if (! this.grid.isInBounds(this.row, this.col)) {
            var leftof = rightof = above = below = 0;
            if (this.row < 0)
                above = 0 - this.row;
            else if (this.row >= this.grid.rows)
                below = this.grid.rows - this.row + 1;
            if (this.col < 0)
                leftof = 0 - this.col;
            else if (this.col >= this.grid.cols)
                rightof = this.grid.cols - this.col + 1;
            this.grid.resizeBy(leftof, rightof, above, below);
        }

        this.draw();
    };

    Ant.prototype.getInBounds = function() {
        if (this.row == null || this.col == null) {
            // initial placement when added to grid
            var t = (this.grid.ants.length+1);
            this.row = Math.floor((t * Math.sin(t) + 50)/100 * this.grid.rows);
            this.col = Math.floor((t * Math.cos(t) + 50)/100 * this.grid.cols);
            this._saveInitialState();
        } else if (! this.grid.isInBounds(this.row, this.col)) {
            // grid resized leaving this ant out of bounds
            throw Error('unimplemented');
        }
    };

    return Ant;
})();
