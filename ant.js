if (typeof(Ants) == 'undefined')
    Ants = {};

Ants.Ant = (function() {
    var Right = 1;
    var Left = 0;
    var DefaultTurns = "RL";

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
        this.row = row || -1;
        this.col = col || -1;
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
    };

    Ant.prototype.getInBounds = function() {
        // initital placement when added to grid
        var t = (this.grid.ants.length+1);
        ant.row = Math.floor((t * Math.sin(t) + 50)/100 * this.grid.rows);
        ant.col = Math.floor((t * Math.cos(t) + 50)/100 * this.grid.cols);
    };

    return Ant;
})();
