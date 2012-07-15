class EventDispatcher
  callbacks: {}

  addListener: (name, callback) ->
    @callbacks[name] ?= []
    @callbacks[name].push(callback)

  dispatch: (name, data) ->
    return if not @callbacks[name]?
    if data?
      data = {}
    else if typeof data != "object" or data instanceof Array
      data = {data: data}
    data.target = this
    data.name = name
    callback(data) for callback in @callbacks[name]
