root = exports ? this

getOffset = (el) ->
  x = y = 0
  while el?
    x += el.offsetLeft
    y += el.offsetTop
    el = el.offsetParent
  [x, y]

viewBox = (win) -> [
    win.pageXOffset, win.pageYOffset,
    win.innerWidth  + win.pageXOffset,
    win.innerHeight + win.pageYOffset
  ]

elementBox = (el) ->
  o = getOffset el
  [ o[0], o[1],
    o[0] + el.offsetWidth,
    o[1] + el.offsetHeight
  ]

moveTo = (el, x, y) ->
  el.style.left = x + 'px'
  el.style.top  = y + 'px'

moveToClamped = (el, x, y, box) ->
  x = Math.max box[0], x
  y = Math.max box[1], y
  x = Math.min box[2] - el.offsetWidth,  x
  y = Math.min box[3] - el.offsetHeight, y
  el.style.left = x + 'px'
  el.style.top  = y + 'px'

class root.Expander extends root.EventDispatcher
  constructor: (anchor, element) ->
    @anchor = anchor if anchor?
    if element?
      @element = element
      @element.style.position = 'absolute'
      @element.style.display = ''
      @element.style.visibility = 'hidden'
      @element.style.zIndex = 100
      doc = @element.ownerDocument
      if @element.parentNode != doc.body
        doc.body.appendChild @element.parentNode.removeChild @element

  refresh: ->
    anch = elementBox @anchor
    view = viewBox @element.ownerDocument.defaultView
    if @element.offsetHeight <= view[3] - anch[3]
      moveToClamped @element, anch[0], anch[3], view
    else if @element.offsetHeight <= anch[1] - view[1]
      moveToClamped @element, anch[0], anch[1] - @element.offsetHeight, view
    else if @element.offsetWidth <= view[2] - anch[2]
      moveToClamped @element, anch[2], anch[1], view
    else if @element.offsetWidth <= anch[0] - view[0]
      moveToClamped @element, anch[0] - @element.offsetWidth, anch[1], view
    else
      moveToClamped @element, anch[0], anch[3], view

  onViewClick: (e) ->
    el = e.target
    while el?
      return if el == @element or el == @anchor
      el = el.parentNode
    @collapse()

  expand: () ->
    @refresh()
    @element.style.visibility = 'visible'
    view = @element.ownerDocument.defaultView
    if not @_onviewresize?
      @_onviewresize = @refresh.bind this
      view.addEventListener 'resize', @_onviewresize, false
    if not @_onviewclick?
      @_onviewclick = @onViewClick.bind this
      view.addEventListener 'click', @_onviewclick, false

  collapse: () ->
    @element.style.visibility = 'hidden'
    view = @element.ownerDocument.defaultView
    if @_onviewresize?
      view.removeEventListener 'resize', @_onviewresize, false
      delete @_onviewresize
    if @_onviewclick?
      view.removeEventListener 'click', @_onviewclick, false
      delete @_onviewclick
