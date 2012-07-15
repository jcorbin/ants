(root = exports ? this).Ants ?= {}

class root.Ants.Grid extends root.EventDispatcher
  @frozenMethod: (f) -> ->
    old = @frozen
    @frozen = true
    r = f.apply this, arguments
    @frozen = old
    if @needsSizeUpdate
        @updateSize() # calls render
    else
        @render() # or we do
    return r

  @HueWheelGenerator: (s, l) ->
    s = (s * 100).toFixed(1) + '%'
    l = (l * 100).toFixed(1) + '%'
    (ncolors) ->
      "hsl(#{Math.floor(360*i/ncolors)}, #{s}, #{l})" for i in [0..ncolors-1]

  rows = 50
  cols = 50
  colorGenerator = @HueWheelGenerator 0.75, 0.4

  constructor: (@canvas, rows, cols, colorGenerator) ->
    @colorGenerator = colorGenerator if colorGenerator?
    @colors = @colorGenerator(2)
    @newCellValue = -2
    @rows = rows if rows?
    @cols = cols if cols?
    @ants = []
    @initial_state = [@rows, @cols]
    @frozen = false
    @needsSizeUpdate = false
    @reset()
    @running = null
    @runDelay = 64
    @runSteps = 1
    window.addEventListener 'resize', @updateSize.bind(this), false

  getCell: (x, y) ->
    v = @data[x][y]
    v += @colors.length while v < 0
    return v

  setCell: (x, y, v) ->
    if @data[x][y] != v
      @data[x][y] = v
      @drawCell x, y

  setColorGenerator: (generator) ->
    @colorGenerator = generator
    @colors = @colorGenerator @colors.length
    @render()

  removeColor: (index) ->
    @colors = @colorGenerator @colors.length-1
    @newCellValue += 1
    for ant in @ants
      ant.turns.splice index, 1
      ant.dispatch 'turnsChanged'
    @reset()

  addColor: (index) ->
    ncolors = @colors.length+1
    @colors = @colorGenerator ncolors
    @newCellValue -= 1
    for ant in @ants
      while ant.turns.length < ncolors
        ant.turns.push root.Ants.Ant.TurnLeft
      ant.dispatch 'turnsChanged'
    @reset()

  setNumColors: (n) ->
    return if @colors.length == n
    @newCellValue = -n
    @colors = @colorGenerator n
    for ant in @ants
      if ant.turns.length != n
        if ant.turns.length > n
          ant.turns.splice n-1
        else
          while ant.turns.length < n
            ant.turns.push root.Ants.Ant.TurnLeft
        ant.dispatch 'turnsChanged'
    @reset()

  runStep: ->
    @step @runSteps

  play: ->
    return if @running?
    @running = setInterval @runStep.bind(this), @runDelay
    @dispatch 'play'

  stop: ->
    return if not @running?
    clearInterval @running
    @running = null
    @dispatch 'stop'

  runFaster: (factor) ->
    if @runDelay > 1
      @runDelay /= factor
    else
      @runSteps *= factor
    if @running?
      clearInterval @running
      @running = setInterval @runStep.bind(this), @runDelay

  runSlower: (factor) ->
    if @runSteps > 1
      @runSteps /= factor
    else
      @runDelay *= factor
    if @running?
      clearInterval @running
      @running = setInterval @runStep.bind(this), @runDelay

  reset: @frozenMethod ->
    @rows = @initial_state[0]
    @cols = @initial_state[1]
    @data = (@newCellValue for j in [1..@cols] for i in [1..@rows])
    @iteration = 0
    ant.reset() for ant in @ants
    @updateSize()
    @dispatch 'reset'

  corners: -> [
      [0,       0],
      [0,       @rows-1],
      [@cols-1, @rows-1],
      [@cols-1, 0]
  ]

  resize: (rows, cols) ->
    dc = (cols - @cols)/2
    dr = (rows - @rows)/2
    @resizeBy(
      Math.floor(dc), Math.ceil(dc),
      Math.floor(dr), Math.ceil(dr)
    )

  resizeBy: (leftof, rightof, above, below) ->
    if leftof > 0
      row.unshift(@newCellValue) for j in [1..leftof] for row in @data

    else if leftof < 0
      row.shift() for j in [1..leftof] for row in @data
    @cols += leftof

    if rightof > 0
      row.push(@newCellValue) for j in [1..rightof] for row in @data
    else if rightof < 0
      row.pop() for j in [1..rightof] for row in @data
    @cols += rightof

    if above > 0
      @data.unshift (@newCellValue for j in [1..@cols]) for i in [1..above]
    else if above < 0
      @data.shift() for i in [above..-1]
    @rows += above

    if below > 0
      @data.push (@newCellValue for j in [1..@cols]) for i in [1..below]
    else if below < 0
      @data.pop() for i in [below..-1]
    @rows += below

    for ant in @ants
      ant.row += above
      ant.col += leftof
      ant.getInBounds()

    @updateSize()

  updateSize: ->
    if @frozen
      @needsSizeUpdate = true
      return

    @scale = Math.min(
      @canvas.parentNode.clientWidth/@cols,
      @canvas.parentNode.clientHeight/@rows)

    @canvas.width = @cols * @scale
    @canvas.height = @rows * @scale
    ctx = @canvas.getContext '2d'
    ctx.scale(@scale, @scale)

    @needsSizeUpdate = false if @needsSizeUpdate

    @render()

  randomize: ->
    @data =
      for i in [0..@rows]
        for j in [0..@cols]
          Math.random() * @colors.length

  drawCell: (row, col) ->
    return if @frozen
    ctx = @canvas.getContext '2d'
    ctx.fillStyle = @colors[@getCell row, col]
    ctx.fillRect col, row, 1, 1

  render: ->
    ctx = @canvas.getContext '2d'

    # TODO d es it pay to aggregate draws by fill color?
    for row, i in @data
      for cell, j in row
        @drawCell(i, j) if cell >= 0

    ant.draw() for ant in @ants

  addAnt: (ant) ->
    @ants.push ant
    ant.grid = this
    ant.reset()

  isInBounds: (row, col) ->
    return 0 <= row < @rows and 0 <= col < @cols

  step: (n) ->
    ant.step() for ant in @ants for i in [1..n]
    @iteration += n
    @dispatch 'step'

  setIteration: @frozenMethod (i) ->
    return if i == @iteration
    throw Error 'unimplemented: rewinding simulation' if i < @iteration
    @step i - @iteration
