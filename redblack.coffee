
class window.RedBlackTree
  constructor: ->
    @root = null

  insert: (k, v) ->
    if @root
      @root.insert(new RbtNode(k, v))
      @root = @root.getRoot()
    else
      @root = new RbtNode(k, v)

  height: -> @root.getHeight()


class window.RbtNode
  constructor: (@key, @value) ->
    @parent = null
    @red = true
    @children = []
    @left  = null
    @right = null

  access: (k) ->
    switch
      when k == @key then this
      when k < @key then @left?.access(k)
      when k > @key then @right?.access(k)

  insert: (i) ->
    switch
      when i.key < @key and @left then @left.insert(i)
      when i.key < @key then @left = i; i.parent = this
      when i.key > @key and @right then @right.insert(i)
      when i.key > @key then @right = i; i.parent = this
    i._cleanUpAfterInsert()
    @_updateChildren()

  delete: (i) ->
    switch
      when i.key is @key then @_removeParentOfOne(@_swapToBottom())
      when i.key < @key and @left then @left.delete(i)
      when i.key > @key and @right then @right.delete(i)
    @_updateChildren()

  getRoot: -> if @parent then @parent.getRoot() else this

  getHeight: ->
    l = @left?.getHeight() or 0
    r = @right?.getHeight() or 0
    1 + Math.max(l, r)

  # setDepth: (d) ->
  #   @depth = d
  #   d = @left?.setDepth(d+1)
  #   d = @right?.setDepth(d+1)
  #   d + 1
  _swapToBottom: ->
    other = @_findPrevious()
    if other
      [@key, other.key] = [other.key, @key]
      [@value, other.value] = [other.value, @value]
      other
    else
      this

  _removeParentOfOne: (victim) ->
    child = victim.left or victim.right
    leftShort = false
    if victim._isLeftChild()
      victim.parent.left = child
      leftShort = true
    else if victim._isRightChild()
      victim.parent.right = child
    if child
      child.parent = victim.parent
    if not victim.red and @parent
      @parent._cleanUpAfterDelete(leftShort)  # TODO: if this is the root something funky needs to happen
    victim.parent = null
    victim.right = null
    victim.left = null

  _findPrevious: -> @left?._findRightMost()

  _findRightMost: ->
    if @right?
      @right._findRightMost()
    else
      this

  _updateChildren: ->
    @children = []
    switch
      when @left and @right then @children = [@left, @right]
      when @left then @children = [@left]
      when @right then @children = [@right]

  _cleanUpAfterInsert: ->
    if @red and @parent?.red and @_uncle()?.red  # condition 4a in "Planar point location using persistent search trees"
      @parent.red = false
      @_uncle().red = false
      @parent.parent.red = true
      @parent.parent._cleanUpAfterInsert()
    if @red and @parent?.red
      if not @parent?.parent  # condition 4b
        @parent.red = false
      else
        og = @parent.parent
        og.red = true
        if @parent._isLeftChild()  # condition 4cd
          if @_isRightChild()  # condition 4d
            @_rotateLeft(@parent)
          og.left.red = false  # NOTE: this is here because og.left may change in a rotate left
          @_rotateRight(og)
        else  # condition 4cd
          if @_isLeftChild()  # condition 4d
            @_rotateRight(@parent)
          og.right.red = false  # NOTE: this is here because og.right may change in a rotate right
          @_rotateLeft(og)

  _cleanUpAfterDelete: (leftShort) ->  #TODO: write me
    if leftShort
      @_cleanUpAfterDeleteLeft()
    else
      @_cleanUpAfterDeleteRight()

  _cleanUpAfterDeleteLeft: ->
    if @left?.red
      @left.red = false
    else
      # condition 5a in "Planar point location using persistent search trees"
      if @right and @right.left and @right.right and not (@left?.red or @red or @right.red or @right.left.red or @right.right.red)
        @right.red = true
        @parent._cleanUpAfterDelete(@_isLeftChild())
      if @right?.red and not @left?.red and not @red  #condition 5b
        @red = true
        @right.red = false
        @_rotateLeft(this)
      if @red and @right and @right.left and @right.right and not (@right.red or @right.left.red or @right.right.red)  #condition 5c
        @red = false
        @right.red = true
      else if @right and not @right.red and @right.right and not (@right.right.red or @right.left)  #condition 5d
        @right.red = @red
        @red = false
        @_rotateLeft(this)
      else if @right and @right.right and @right.left?.red and not @right.right.red
        @right.left.red = @red
        @red = false
        @_rotateRight(@right)
        @_rotateLeft(this)

  _cleanUpAfterDeleteRight: -> #TODO: write me
    if @right?.red
      @right.red = false
    else
      # condition 5a in "Planar point location using persistent search trees"
      if @left and @left.right and @left.left and not (@right?.red or @red or @left.red or @left.right.red or @left.left.red)
        @left.red = true
        @parent._cleanUpAfterDelete(@_isLeftChild())
      if @left?.red and not @right?.red and not @red  #condition 5b
        @red = true
        @left.red = false
        @_rotateRight(this)
      if @red and @left and @left.left and @left.right and not (@left.red or @left.left.red or @left.right.red)  #condition 5c
        @red = false
        @left.red = true
      else if @left and not @left.red and @left.left and not (@left.left.red or @left.right)  #condition 5d
        @left.red = @red
        @red = false
        @_rotateRight(this)
      else if @left and @left.left and @left.right?.red and not @left.left.red
        @left.right.red = @red
        @red = false
        @_rotateLeft(@left)
        @_rotateRight(this)

  _rotateLeft: (root) ->
    if root?.right
      x = root    # cribbing the variable names here from the paper
      y = x.right
      B = y.left
      x.right = B
      y.left = x
      if root._isLeftChild()
        root.parent.left = y
      else if root._isRightChild()
        root.parent.right = y
      y.parent = x.parent
      x.parent = y
      if B
        B.parent = x
      x._updateChildren()
      y._updateChildren()
      y.parent?._updateChildren()

  _rotateRight: (root) ->
    if root?.left
      y = root
      x = y.left
      B = x.right
      x.right = y
      y.left = B
      if root._isLeftChild()
        root.parent.left = x
      else if root._isRightChild()
        root.parent.right = x
      x.parent = y.parent
      y.parent = x
      if B
        B.parent = y
      x._updateChildren()
      y._updateChildren()
      x.parent?._updateChildren()

  _uncle: -> @parent?._brother()  # TODO: is this still needed?

  _brother: ->
    if @_isLeftChild()
      @parent?.right
    else
      @parent?.left

  _isLeftChild: -> this is @parent?.left
  _isRightChild: -> this is @parent?.right


  toString: -> @key + (if @red then " red " else " black ") + (if @parent then " P:" + @parent.key else "") +  (if @left then " L:" + @left.key else "") + (if @right then " R:" + @right.key else "") + " \[\n" + @children + " \]\n"
