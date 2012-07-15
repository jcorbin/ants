(root = exports ? this).Ants ?= {}

class root.Ants.RulesEditor extends root.Expander
  constructor: (@grid, @ant, @input) ->
    @input.addEventListener 'keypress', =>
      @size = Math.max(1, @value.length)
    , false
    @input.addEventListener 'change', =>
        try
          @ant.setTurnString @input.value
        catch err
          @input.value = @ant.getTurnString()
        @refresh()
    , false
    ant.addListener 'turnsChanged', =>
      @input.value = @ant.getTurnString()
      @input.size = @input.value.length
    @input.value = @ant.getTurnString()
    @input.size = @input.value.length

    doc = input.ownerDocument
    @table = doc.createElement 'table'
    @table.className = 'rules'
    @table.style.display = 'none'
    @table.style.position = 'absolute'

    row = @table.createTHead().insertRow(-1)
    row
      .appendChild(doc.createElement('th'))
      .appendChild(doc.createTextNode('On color'))
    row
      .appendChild(doc.createElement('th'))
      .appendChild(doc.createTextNode('turn.'))
    row
      .appendChild(doc.createElement('th'))
      .appendChild(doc.createTextNode(' '))

    row = @table.createTFoot().insertRow(-1)
    cell = row.insertCell(-1)
    cell.appendChild(doc.createTextNode(' '))
    cell.colSpan = 2
    el = row.insertCell(-1)
      .appendChild(doc.createElement('button'))
    el.appendChild(doc.createTextNode('+'))
    el.addEventListener('click', @onAddRuleClicked.bind(this), false)

    @table.appendChild(doc.createElement('tbody'))

    doc.body.appendChild(@table)

    super @input, @table

    @input.addEventListener 'focus', @expand.bind(this), false

  addRuleRow: (color, rule) ->
    body = @table.tBodies[0]
    doc = body.ownerDocument
    row = body.insertRow(-1)

    cell = row.insertCell(-1)
    cell.className = 'swatch'
    cell.appendChild(doc.createTextNode(' '))
    cell.style.backgroundColor = color

    cell = row.insertCell(-1)
    select = cell.appendChild(doc.createElement('select'))
    option = select.appendChild(doc.createElement('option'))
    option.appendChild(doc.createTextNode('Left'))
    option = select.appendChild(doc.createElement('option'))
    option.appendChild(doc.createTextNode('Right'))
    select.value = rule
    select.addEventListener 'change', @update.bind(this), false

    cell = row.insertCell(-1)
    button = cell.appendChild(doc.createElement('button'))
    button.className = 'rule_del'
    button.appendChild(doc.createTextNode('-'))
    button.addEventListener 'click', @onDelRuleClicked.bind(this), false

  update: ->
    @grid.stop()
    body = @table.tBodies[0]
    @ant.turns = for row, i in body.rows
      Ants.Ant.Name2Turn row.getElementsByTagName('select')[0].value
    @ant.dispatch 'turnsChanged'
    @grid.reset()

  refresh: ->
    super
    body = @table.tBodies[0]
    body.removeChild body.firstChild while body.childNodes.length
    for turn, i in @ant.turns
      @addRuleRow(@grid.colors[i], Ants.Ant.Turn2Name(turn))
    disabled = @grid.colors.length <= 2
    b.disabled = disabled for b in @table.getElementsByClassName 'rule_del'
    return

  onDelRuleClicked: (e) ->
    return if @grid.colors.length <= 2
    row = e.target
    row = row.parentNode while row.tagName.toLowerCase() != 'tr'
    for r, i in row.parentNode.rows
      if r is row
        @grid.stop()
        @grid.removeColor i
        @refresh()
        e.stopPropagation()
    return

  onAddRuleClicked:  ->
    @grid.stop()
    @grid.addColor()
    @refresh()
