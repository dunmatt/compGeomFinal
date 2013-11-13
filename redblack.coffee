class window.RbtNode
  constructor: (@key, @value) ->
    @parent = null
    @red = true
    @children = []
    @left  = null
    @right = null

  access: (k) ->
    switch
      when k == @key then @value
      when k < @key then @left?.access(k)
      when k > @key then @right?.access(k)

  insert: (i) ->
    switch
      when i.key < @key and @left then @left.insert i
      when i.key < @key then @left = i
      when i.key > @key and @right then @right.insert i
      when i.key > @key then @right = i
    @children = [@left, @right]

  delete: (i) ->
