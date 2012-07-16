// Generated by CoffeeScript 1.3.3
(function() {
  var root, _base, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if ((_ref = (_base = (root = typeof exports !== "undefined" && exports !== null ? exports : this)).Ants) == null) {
    _base.Ants = {};
  }

  root.Ants.GridData = (function() {

    function GridData(shape, initValue) {
      this.initValue = initValue;
      if (shape.length !== 2) {
        throw Error("unsupported Grid dimensonality " + shape.length);
      }
      this.shape = shape;
      this.reset();
    }

    GridData.prototype.reset = function() {
      var i, j;
      return this._data = (function() {
        var _i, _ref1, _results;
        _results = [];
        for (i = _i = 1, _ref1 = this.shape[0]; 1 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 1 <= _ref1 ? ++_i : --_i) {
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (j = _j = 1, _ref2 = this.shape[1]; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 1 <= _ref2 ? ++_j : --_j) {
              _results1.push(this.initValue);
            }
            return _results1;
          }).call(this));
        }
        return _results;
      }).call(this);
    };

    GridData.prototype.get = function(pos) {
      return this._data[pos[0]][pos[1]];
    };

    GridData.prototype.set = function(pos, val) {
      return this._data[pos[0]][pos[1]] = val;
    };

    GridData.prototype.each = function(f) {
      var i, j, row, val, _i, _len, _ref1, _results;
      _ref1 = this._data;
      _results = [];
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        row = _ref1[i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
            val = row[j];
            _results1.push(f([i, j], val));
          }
          return _results1;
        })());
      }
      return _results;
    };

    GridData.prototype.resizeBy = function(delta) {
      var above, below, i, j, leftof, rightof, row, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _o, _p, _q, _r, _ref1, _ref2, _ref3, _ref4, _s, _t;
      if (delta.length !== this.shape.length * 2) {
        throw Error("Need " + (this.shape.length * 2) + " deltas, got " + delta.length);
      }
      above = delta[0], below = delta[1], leftof = delta[2], rightof = delta[3];
      if (above > 0) {
        for (i = _i = 1; 1 <= above ? _i <= above : _i >= above; i = 1 <= above ? ++_i : --_i) {
          this._data.unshift((function() {
            var _j, _ref1, _results;
            _results = [];
            for (j = _j = 1, _ref1 = this.shape[1]; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
              _results.push(this.initValue);
            }
            return _results;
          }).call(this));
        }
      } else if (above < 0) {
        for (i = _j = above; above <= -1 ? _j <= -1 : _j >= -1; i = above <= -1 ? ++_j : --_j) {
          this._data.shift();
        }
      }
      this.shape[0] += above;
      if (below > 0) {
        for (i = _k = 1; 1 <= below ? _k <= below : _k >= below; i = 1 <= below ? ++_k : --_k) {
          this._data.push((function() {
            var _l, _ref1, _results;
            _results = [];
            for (j = _l = 1, _ref1 = this.shape[1]; 1 <= _ref1 ? _l <= _ref1 : _l >= _ref1; j = 1 <= _ref1 ? ++_l : --_l) {
              _results.push(this.initValue);
            }
            return _results;
          }).call(this));
        }
      } else if (below < 0) {
        for (i = _l = below; below <= -1 ? _l <= -1 : _l >= -1; i = below <= -1 ? ++_l : --_l) {
          this._data.pop();
        }
      }
      this.shape[0] += below;
      if (leftof > 0) {
        _ref1 = this._data;
        for (_m = 0, _len = _ref1.length; _m < _len; _m++) {
          row = _ref1[_m];
          for (j = _n = 1; 1 <= leftof ? _n <= leftof : _n >= leftof; j = 1 <= leftof ? ++_n : --_n) {
            row.unshift(this.initValue);
          }
        }
      } else if (leftof < 0) {
        _ref2 = this._data;
        for (_o = 0, _len1 = _ref2.length; _o < _len1; _o++) {
          row = _ref2[_o];
          for (j = _p = 1; 1 <= leftof ? _p <= leftof : _p >= leftof; j = 1 <= leftof ? ++_p : --_p) {
            row.shift();
          }
        }
      }
      this.shape[1] += leftof;
      if (rightof > 0) {
        _ref3 = this._data;
        for (_q = 0, _len2 = _ref3.length; _q < _len2; _q++) {
          row = _ref3[_q];
          for (j = _r = 1; 1 <= rightof ? _r <= rightof : _r >= rightof; j = 1 <= rightof ? ++_r : --_r) {
            row.push(this.initValue);
          }
        }
      } else if (rightof < 0) {
        _ref4 = this._data;
        for (_s = 0, _len3 = _ref4.length; _s < _len3; _s++) {
          row = _ref4[_s];
          for (j = _t = 1; 1 <= rightof ? _t <= rightof : _t >= rightof; j = 1 <= rightof ? ++_t : --_t) {
            row.pop();
          }
        }
      }
      return this.shape[1] += rightof;
    };

    return GridData;

  })();

  root.Ants.Grid = (function(_super) {
    var colorGenerator, cols, rows;

    __extends(Grid, _super);

    Grid.frozenMethod = function(f) {
      return function() {
        var old, r;
        old = this.frozen;
        this.frozen = true;
        r = f.apply(this, arguments);
        this.frozen = old;
        if (this.needsSizeUpdate) {
          this.updateSize();
        } else {
          this.render();
        }
        return r;
      };
    };

    Grid.HueWheelGenerator = function(s, l) {
      s = (s * 100).toFixed(1) + '%';
      l = (l * 100).toFixed(1) + '%';
      return function(ncolors) {
        var i, _i, _ref1, _results;
        _results = [];
        for (i = _i = 0, _ref1 = ncolors - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          _results.push("hsl(" + (Math.floor(360 * i / ncolors)) + ", " + s + ", " + l + ")");
        }
        return _results;
      };
    };

    rows = 50;

    cols = 50;

    colorGenerator = Grid.HueWheelGenerator(0.75, 0.4);

    function Grid(canvas, rows, cols, colorGenerator) {
      this.canvas = canvas;
      if (colorGenerator != null) {
        this.colorGenerator = colorGenerator;
      }
      this.colors = this.colorGenerator(2);
      this.newCellValue = -2;
      if (rows != null) {
        this.rows = rows;
      }
      if (cols != null) {
        this.cols = cols;
      }
      this.ants = [];
      this.initial_state = [this.rows, this.cols];
      this.frozen = false;
      this.needsSizeUpdate = false;
      this.reset();
      this.running = null;
      this.runDelay = 64;
      this.runSteps = 1;
      window.addEventListener('resize', this.updateSize.bind(this), false);
    }

    Grid.prototype.getCell = function(x, y) {
      var v;
      v = this.data.get([x, y]);
      while (v < 0) {
        v += this.colors.length;
      }
      return v;
    };

    Grid.prototype.setCell = function(x, y, v) {
      var pos;
      pos = [x, y];
      if (this.data.get(pos) !== v) {
        this.data.set(pos, v);
        return this.drawCell(x, y);
      }
    };

    Grid.prototype.setColorGenerator = function(generator) {
      this.colorGenerator = generator;
      this.colors = this.colorGenerator(this.colors.length);
      return this.render();
    };

    Grid.prototype.removeColor = function(index) {
      var ant, _i, _len, _ref1;
      this.colors = this.colorGenerator(this.colors.length - 1);
      this.newCellValue += 1;
      _ref1 = this.ants;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        ant.turns.splice(index, 1);
        ant.dispatch('turnsChanged');
      }
      return this.reset();
    };

    Grid.prototype.addColor = function(index) {
      var ant, ncolors, _i, _len, _ref1;
      ncolors = this.colors.length + 1;
      this.colors = this.colorGenerator(ncolors);
      this.newCellValue -= 1;
      _ref1 = this.ants;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        while (ant.turns.length < ncolors) {
          ant.turns.push(root.Ants.Ant.TurnLeft);
        }
        ant.dispatch('turnsChanged');
      }
      return this.reset();
    };

    Grid.prototype.setNumColors = function(n) {
      var ant, _i, _len, _ref1;
      if (this.colors.length === n) {
        return;
      }
      this.newCellValue = -n;
      this.colors = this.colorGenerator(n);
      _ref1 = this.ants;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        if (ant.turns.length !== n) {
          if (ant.turns.length > n) {
            ant.turns.splice(n - 1);
          } else {
            while (ant.turns.length < n) {
              ant.turns.push(root.Ants.Ant.TurnLeft);
            }
          }
          ant.dispatch('turnsChanged');
        }
      }
      return this.reset();
    };

    Grid.prototype.runStep = function() {
      return this.step(this.runSteps);
    };

    Grid.prototype.play = function() {
      if (this.running != null) {
        return;
      }
      this.running = setInterval(this.runStep.bind(this), this.runDelay);
      return this.dispatch('play');
    };

    Grid.prototype.stop = function() {
      if (!(this.running != null)) {
        return;
      }
      clearInterval(this.running);
      this.running = null;
      return this.dispatch('stop');
    };

    Grid.prototype.runFaster = function(factor) {
      if (this.runDelay > 1) {
        this.runDelay /= factor;
      } else {
        this.runSteps *= factor;
      }
      if (this.running != null) {
        clearInterval(this.running);
        return this.running = setInterval(this.runStep.bind(this), this.runDelay);
      }
    };

    Grid.prototype.runSlower = function(factor) {
      if (this.runSteps > 1) {
        this.runSteps /= factor;
      } else {
        this.runDelay *= factor;
      }
      if (this.running != null) {
        clearInterval(this.running);
        return this.running = setInterval(this.runStep.bind(this), this.runDelay);
      }
    };

    Grid.prototype.reset = Grid.frozenMethod(function() {
      var ant, _i, _len, _ref1;
      this.rows = this.initial_state[0];
      this.cols = this.initial_state[1];
      this.data = new root.Ants.GridData([this.rows, this.cols], this.newCellValue);
      this.iteration = 0;
      _ref1 = this.ants;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        ant.reset();
      }
      this.updateSize();
      return this.dispatch('reset');
    });

    Grid.prototype.corners = function() {
      return [[0, 0], [0, this.rows - 1], [this.cols - 1, this.rows - 1], [this.cols - 1, 0]];
    };

    Grid.prototype.resize = function(rows, cols) {
      var dc, dr;
      dc = (cols - this.cols) / 2;
      dr = (rows - this.rows) / 2;
      return this.resizeBy(Math.floor(dc), Math.ceil(dc), Math.floor(dr), Math.ceil(dr));
    };

    Grid.prototype.resizeBy = function(leftof, rightof, above, below) {
      var ant, _i, _len, _ref1;
      this.data.resizeBy([above, below, leftof, rightof]);
      this.rows += above + below;
      this.cols += leftof + rightof;
      _ref1 = this.ants;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        ant.row += above;
        ant.col += leftof;
        ant.getInBounds();
      }
      return this.updateSize();
    };

    Grid.prototype.updateSize = function() {
      var ctx;
      if (this.frozen) {
        this.needsSizeUpdate = true;
        return;
      }
      this.scale = Math.min(this.canvas.parentNode.clientWidth / this.cols, this.canvas.parentNode.clientHeight / this.rows);
      this.canvas.width = this.cols * this.scale;
      this.canvas.height = this.rows * this.scale;
      ctx = this.canvas.getContext('2d');
      ctx.scale(this.scale, this.scale);
      if (this.needsSizeUpdate) {
        this.needsSizeUpdate = false;
      }
      return this.render();
    };

    Grid.prototype.randomize = function() {
      var i, j, _i, _ref1, _results;
      _results = [];
      for (i = _i = 0, _ref1 = this.rows; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
        _results.push((function() {
          var _j, _ref2, _results1;
          _results1 = [];
          for (j = _j = 0, _ref2 = this.cols; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; j = 0 <= _ref2 ? ++_j : --_j) {
            _results1.push(this.data.set([i, j], Math.random() * this.colors.length));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Grid.prototype.drawCell = function(row, col) {
      var color, ctx;
      if (this.frozen) {
        return;
      }
      color = this.getCell(row, col);
      color = this.data.get([row, col]);
      if (color < 0) {
        return;
      }
      color = this.colors[color];
      ctx = this.canvas.getContext('2d');
      ctx.fillStyle = color;
      return ctx.fillRect(col, row, 1, 1);
    };

    Grid.prototype.render = function() {
      var ant, ctx, _i, _len, _ref1, _results,
        _this = this;
      ctx = this.canvas.getContext('2d');
      this.data.each(function(pos, val) {
        return _this.drawCell.apply(_this, pos);
      });
      _ref1 = this.ants;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        ant = _ref1[_i];
        _results.push(ant.draw());
      }
      return _results;
    };

    Grid.prototype.addAnt = function(ant) {
      this.ants.push(ant);
      ant.grid = this;
      return ant.reset();
    };

    Grid.prototype.isInBounds = function(row, col) {
      return (0 <= row && row < this.rows) && (0 <= col && col < this.cols);
    };

    Grid.prototype.step = function(n) {
      var ant, i, _i, _j, _len, _ref1;
      for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
        _ref1 = this.ants;
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          ant = _ref1[_j];
          ant.step();
        }
      }
      this.iteration += n;
      return this.dispatch('step');
    };

    Grid.prototype.setIteration = Grid.frozenMethod(function(i) {
      if (i === this.iteration) {
        return;
      }
      if (i < this.iteration) {
        throw Error('unimplemented: rewinding simulation');
      }
      return this.step(i - this.iteration);
    });

    return Grid;

  })(root.EventDispatcher);

}).call(this);
