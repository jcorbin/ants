(root = exports ? this).Ants ?= {}

closestPoint = (ref, points) ->
  cur = null
  q = 0
  for point in points
    pq =
      Math.pow(ref[0] - point[0], 2) +
      Math.pow(ref[1] - point[1], 2)
    if cur == null or pq < q
      cur = point
      q = pq
  return cur

Right = 1
Left = 0

HalfPI = Math.PI/2
TwoPI = 2*Math.PI

class root.Ants.Ant extends root.EventDispatcher
  @DefaultTurns: "RL"

  @TurnLeft: Left
  @TurnRight: Right

  @Turn2Name: (turn) ->
    switch turn
      when Right then 'Right'
      when Left then 'Left'
      else throw Error "Invalid turn #{turn}"

  @Name2Turn: (name) ->
    switch name.toLowerCase()
      when 'right' then Right
      when 'left' then Left
      else throw Error "Invalid turn name #{turn}"

  row: null
  col: null
  heading: 0
  color: '#f00'
  initial_state: null

  constructor: (row, col, heading, color, turns) ->
    @row = row if row?
    @col = col if col?
    @heading = heading if heading?
    @color = color if color?
    @setTurnString(if turns? then turns else Ant.DefaultTurns)
    if @row? and @col?
      @_saveInitialState()

  getTurnString: ->
    (Ant.Turn2Name(turn)[0].toUpperCase() for turn in @turns).join('')

  setTurnString: (s) ->
    s = s.toLowerCase()
    return if @turns and s == @getTurnString().toLowerCase()
    @turns = for c, i in s
      switch c
        when 'r' then Right
        when 'l' then Left
        else throw Error 'Invalid turn direction'
    @dispatch 'turnsChanged'
    if @grid?
      if @grid.length == @turns.length
        @grid.reset()
      else
        @grid.setNumColors @turns.length

  _saveInitialState: ->
    @initial_state = [@row, @col, @heading]

  reset: ->
    if @initial_state
      @grid.drawCell(@row, @col)
      [@row, @col, @heading] = @initial_state
    @getInBounds()
    @draw()

  draw: ->
    return if @grid.frozen
    # TODO: oriented shape
    ctx = @grid.canvas.getContext '2d'
    ctx.fillStyle = @color
    ctx.fillRect @col+0.25, @row+0.25, 0.5, 0.5

  step: ->
    # Update current cell
    c = @grid.getCell @row, @col
    @grid.setCell @row, @col, (c + 1) % @grid.colors.length

    # Turn
    @heading = (switch @turns[c]
      when Right then @heading + HalfPI
      when Left  then @heading - HalfPI
    ) % TwoPI

    # Move
    @col += Math.round Math.cos(@heading)
    @row += Math.round Math.sin(@heading)

    # Bound check, resize grid if we went outside the rid
    if not @grid.isInBounds @row, @col
      leftof = rightof = above = below = 0
      if @row < 0
        above = 0 - @row
      else if @row >= @grid.rows
        below = @grid.rows - @row + 1
      if @col < 0
        leftof = 0 - @col
      else if @col >= @grid.cols
        rightof = @grid.cols - @col + 1
      @grid.resizeBy leftof, rightof, above, below

    @draw()

  getInBounds: ->
    if not (@row? and @col?)
      # initial placement when added to grid
      t = @grid.ants.length+1
      @row = Math.floor (t * Math.sin(t) + 50)/100 * @grid.rows
      @col = Math.floor (t * Math.cos(t) + 50)/100 * @grid.cols
      @_saveInitialState()
    else if not @grid.isInBounds @row, @col
      # grid resized leaving this ant out of bounds
      throw Error 'unimplemented'
