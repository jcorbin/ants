do ->
  grid = document.getElementById 'grid'
  reset = document.getElementById 'reset'
  slower = document.getElementById 'slower'
  faster = document.getElementById 'faster'
  iteration = document.getElementById 'iteration'
  runctl = document.getElementById 'run_ctl'
  rules = document.getElementById 'rules'

  updateGeometry = ->
    ctl = document.getElementById "controls"
    cont = document.getElementById "container"
    ctl.style.left = Math.floor(ctl.parentNode.clientWidth/2 - ctl.offsetWidth/2) + "px"

  window.addEventListener "resize", updateGeometry, false
  updateGeometry()

  grid = new Ants.Grid(
    grid, # canvas
    10, # rows
    10, # cols
    Ants.Grid.HueWheelGenerator(0.5, 0.3))

  grid.addAnt new Ants.Ant(
      Math.floor(grid.rows/2), # row
      Math.floor(grid.cols/2), # col
      0,                      # heading (radians)
      "#fff",                 # color
      "RL"                    # turns
  )

  reset.addEventListener 'click', grid.reset.bind(grid), false

  slower.addEventListener 'click', (-> grid.runSlower(2)), false

  faster.addEventListener 'click', (-> grid.runFaster(2)), false

  updateIteration = ->
    iteration.value = grid.iteration.toString()
    iteration.size = iteration.value.length

  iteration.addEventListener 'keypress', (->
      this.size = Math.max(1, this.value.length)
  ), false

  iteration.addEventListener 'change', (->
    i = parseInt(iteration.value)
    if isNaN i or i < grid.iteration
      updateIteration()
    else
      grid.setIteration i
  ), false

  grid.addListener "reset", updateIteration
  grid.addListener "step", updateIteration
  updateIteration()

  grid.addListener "play", ->
    iteration.readOnly = true
    runctl.innerText = 'Pause'

  grid.addListener "stop", ->
    iteration.readOnly = false
    runctl.innerText = 'Play'

  window.addEventListener "error", grid.stop.bind(grid), false

  runctl.addEventListener 'click', (->
    if grid.running == null
      grid.play()
    else
      grid.stop()
  ), false

  editor = new Ants.RulesEditor grid, grid.ants[0], rules

  grid: grid
  ruleseditor: editor
