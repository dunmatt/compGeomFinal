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
      when i.key < @key and @left then @left = @left.insert i
      when i.key < @key then @left = i; i._cleanUpAfterInsert
      when i.key > @key and @right then @right = @right.insert i
      when i.key > @key then @right = i; i._cleanUpAfterInsert
    @children = [@left, @right]

  delete: (i) ->
    switch
      when i.key is @key then
      when i.key < @key and left then @left.delete i
      when i.key > @key and right then @right.delete i
    @children = [@left, @right]

  _cleanUpAfterInsert: ->
    if @red and @parent?.red and @_uncle?.red  # condition 4a in "Planar point location using persistent search trees"
        @parent.red = false
        @_uncle.red = false
        @parent.parent.red = true
        @parent.parent._cleanUpAfterInsert
    if @red and @parent?.red
      if not @parent?.parent  # condition 4b
        @parent.red = false
      else
        og = @parent.parent
        if @parent._leftChild  # condition 4cd
          if @_rightChild  # condition 4d
            @_rotateLeft @parent
          og.red = true
          og.left.red = false
          @_rotateRight og
        else  # condition 4cd
          if @_leftChild  # condition 4d
            @_rotateRight @parent
          og.red = true
          og.right.red = false
          @_rotateLeft og

  _rotateLeft: (root) ->
    if root?.right
      x = root    # cribbing the variable names here from the paper
      y = x.right
      B = y.left
      x.right = B
      y.left = x
      if root._leftChild
        root.parent.left = y
      else if root._rightChild
        root.parent.right = y

  _rotateRight: (root) ->
    if root?.left
      y = root
      x = y.left
      B = x.right
      x.right = y
      y.left = B
      if root._leftChild
        root.parent.left = x
      else if root._rightChild
        root.parent.right = x

  _uncle: -> @parent?.brother  # TODO: is this still needed?

  _brother: ->
    if @_leftChild
      @parent?.right
    else
      @parent?.left

  _leftChild: -> this is @parent?.left
  _rightChild: -> this is @parent?.right
