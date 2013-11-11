class window.RbtNode
  constructor: (@key, @value) ->
    @parent = null
    @black = false
    @children = []
    @left  = null
    @right = null

  access: (k) ->
    switch
      when k == @key then @value
      when k < @key then @left?.access(k)
      when k > @key then @right?.access(k)

  insert: (i) ->
    switch  # HACK: for debugging only!  TODO: replace this with code that may work
      when i.key < @key then @left = i
      when i.key > @key then @right = i
    @children = [@left, @right]

  delete: (i) ->
