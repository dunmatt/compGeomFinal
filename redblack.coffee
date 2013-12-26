
class window.RedBlackTree
  constructor: ->
    @lastModification = -99999999
    @roots = []

  insert: (time, item) ->
    if time >= @lastModification
      root = @getRoot(time)
      if root
        @_trackNewRoot(time, root.insert(new LineSegmentRbtNode(item), true))
      else
        @_trackNewRoot(time, new LineSegmentRbtNode(item))
    # alert(@getRoot(time))

  delete: (time, item) ->
    if not @getRoot(time)
      alert("no root at " + time)
    if time >= @lastModification
      @_trackNewRoot(time, @getRoot(time).delete(item))
    # alert(@getRoot(time))

  height: (time) -> @getRoot(time).height()

  getRoot: (time) ->
    prev = @roots.filter((a) -> a.time <= time)
    if prev.length then prev.reduce((a, b) -> if a.time > b.time then a else b).root else null

  _trackNewRoot: (time, n) ->
    @lastModification = time
    @roots[@roots.length] = {time: time, root: n}

class window.LineSegmentRbtNode
  constructor: (@line, @left, @right, @red = true, @leftShort = false, @rightShort = false) ->
    @short = false

  height: -> 1 + Math.max(@left?.height() or 0, @right?.height() or 0)

  insert: (newNode, isRoot = false) ->
    comp = @line.compareLine(newNode.line)
    switch
      when comp < 0 and @left then new LineSegmentRbtNode(@line, @left.insert(newNode), @right, @red)._cleanUpAfterInsert(isRoot)
      when comp < 0 then new LineSegmentRbtNode(@line, newNode, @right, @red)._cleanUpAfterInsert(isRoot)
      when comp > 0 and @right then new LineSegmentRbtNode(@line, @left, @right.insert(newNode), @red)._cleanUpAfterInsert(isRoot)
      when comp > 0 then new LineSegmentRbtNode(@line, @left, newNode, @red)._cleanUpAfterInsert(isRoot)
      # TODO: do something useful when duplicate lines are detected

  delete: (item, parent = null) ->
    comp = @line.compareLine(item)
    switch
      when comp < 0 and @left  then new LineSegmentRbtNode(@line, @left.delete(item, this), @right, @red, @leftShort, @rightShort)._cleanUpAfterDelete()
      when comp > 0 and @right then new LineSegmentRbtNode(@line, @left, @right.delete(item, this), @red, @leftShort, @rightShort)._cleanUpAfterDelete()
      when comp is 0 and @left then new LineSegmentRbtNode(@left._getRightmostLine(), @left._deleteRightmostDecendant(this), @right, @red, @leftShort, @rightShort)._cleanUpAfterDelete()
      when comp is 0 and @right then @right.short = not @red; @right._cleanUpAfterDelete()
      when comp is 0 then parent?.rightShort = not @red; @right
      else alert("HUGE PROBLEM, delete failed to traverse the tree")

  _getRightmostLine: -> if @right then @right._getRightmostLine() else @line

  _deleteRightmostDecendant: (parent, isFirst = true) ->
    if @right
      new LineSegmentRbtNode(@line, @left, @right._deleteRightmostDecendant(this, false), @red, @leftShort, @rightShort)._cleanUpAfterDelete()
    else if @left
      @left.short = not @red
      @left._cleanUpAfterDelete()
    else if isFirst
      parent.leftShort = not @red
      @left
    else
      parent.rightShort = not @red
      @right


  _cleanUpAfterInsert: (isRoot) ->
    # condition 4a in "Planar point location using persistent search trees"
    if not @red and @left?.red and @right?.red and (@left?.left?.red or @left?.right?.red or @right?.left?.red or @right?.right?.red)
      @red = true
      @left.red = false
      @right.red = false
    # condition 4b
    if isRoot and @red and (@left?.red or @right?.red)
      @red = false
      this
    # condition 4c
    else if not @red and not @right?.red and @left?.red and @left?.left?.red
      new LineSegmentRbtNode(@left.line, @left.left, new LineSegmentRbtNode(@line, @left.right, @right), false)
    # condition 4c
    else if not @red and not @left?.red and @right?.red and @right?.right?.red
      new LineSegmentRbtNode(@right.line, new LineSegmentRbtNode(@line, @left, @right.left), @right.right, false)
    # condition 4d
    else if not @red and not @right?.red and @left?.red and @left?.right?.red
      new LineSegmentRbtNode(@left.right.line, new LineSegmentRbtNode(@left.line, @left.left, @left.right.left), new LineSegmentRbtNode(@line, @left.right.right, @right), false)
    # condition 4d
    else if not @red and not @left?.red and @right?.red and @right?.left?.red
      new LineSegmentRbtNode(@right.left.line, new LineSegmentRbtNode(@line, @left, @right.left.left), new LineSegmentRbtNode(@right.line, @right.left.right, @right.right), false)
    else
      this

  _cleanUpAfterDelete: ->
    if @red and @short
      @red = false
      @short = false
      this
    else
      # condition 5a
      if not @red and (@left?.short or @leftShort) and @right and not @right.red and not @right.left?.red and not @right.right?.red
        @leftShort = false
        @short = true
        @right.red = true
        @left?.short = false
      # condition 5a
      if not @red and (@right?.short or @rightShort) and @left and not @left.red and not @left.right?.red and not @left.left?.red
        @rightShort = false
        @short = true
        @left.red = true
        @right?.short = false
      # condition 5b
      if not @red and (@left?.short or @leftShort) and @right?.red
        @leftShort = false
        new LineSegmentRbtNode(@right.line, new LineSegmentRbtNode(@line, @left, @right.left)._cleanUpAfterDelete(), @right.right, false)._cleanUpAfterDelete()
      # condition 5b
      else if not @red and (@right?.short or @rightShort) and @left?.red
        @rightShort = false
        new LineSegmentRbtNode(@left.line, @left.left, new LineSegmentRbtNode(@line, @left.right, @right)._cleanUpAfterDelete(), false)._cleanUpAfterDelete()
      # condition 5c
      else if @red and (@left?.short or @leftShort) and @right and not @right.red and not @right.left?.red and not @right.right?.red
        @leftShort = false
        @red = false
        @right.red = true
        @left?.short = false
        this
      # condition 5c
      else if @red and (@right?.short or @rightShort) and @left and not @left.red and not @left.right?.red and not @left.left?.red
        @rightShort = false
        @red = false
        @left.red = true
        @right?.short = false
        this
      # condition 5d
      else if (@left?.short or @leftShort) and @right?.right?.red and not @right.red
        @leftShort = false
        @left?.short = false
        @right.right.red = false
        new LineSegmentRbtNode(@right.line, new LineSegmentRbtNode(@line, @left, @right.left), @right.right, @red)
      # condition 5d
      else if (@right?.short or @rightShort) and @left?.left?.red and not @left.red
        @rightShort = false
        @right?.short = false
        @left.left.red = false
        new LineSegmentRbtNode(@left.line, @left.left, new LineSegmentRbtNode(@line, @left.right, @right), @red)
      # condition 5e
      else if (@left?.short or @leftShort) and @right?.left?.red and not @right.red
        @leftShort = false
        @left?.short = false
        @right.left.red = false
        new LineSegmentRbtNode(@right.left.line, new LineSegmentRbtNode(@line, @left, @right.left.left), new LineSegmentRbtNode(@right.line, @right.left.right, @right.right), @red)
      # condition 5e
      else if (@right?.short or @rightShort) and @left?.right?.red and not @left.red
        @rightShort = false
        @right?.short = false
        @left.right.red = false
        new LineSegmentRbtNode(@left.right.line, new LineSegmentRbtNode(@left.line, @left.left, @left.right.left), new LineSegmentRbtNode(@line, @left.right.right, @right), @red)
      else
        this

  toString: -> @line + (if @red then " red " else " black ") +  (if @left then " L:" + @left else "") + "|" + (if @right then " R:" + @right else "")
