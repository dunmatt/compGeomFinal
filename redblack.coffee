
class window.RedBlackTree
  constructor: ->
    @lastModification = -99999999
    @roots = []

  insert: (time, item) ->
    # alert("inserting")
    if time >= @lastModification
      root = @getRoot(time)
      if root
        @_trackNewRoot(time, root.insert(new LineSegmentRbtNode(item), true))
      else
        # alert("wait wat")
        @_trackNewRoot(time, new LineSegmentRbtNode(item))
    alert(@getRoot(time))

  delete: (time, item) ->
    if not @getRoot(time)
      alert("no root at " + time)
    if time >= @lastModification
      @_trackNewRoot(time, @getRoot(time).delete(item))
    alert(@getRoot(time))

  height: (time) -> @getRoot(time).height()

  getRoot: (time) ->
    prev = @roots.filter((a) -> a.time <= time)
    if prev.length then prev.reduce((a, b) -> if a.time > b.time then a else b).root else null

  _trackNewRoot: (time, n) ->
    @lastModification = time
    @roots[@roots.length] = {time: time, root: n}

class window.LineSegmentRbtNode
  constructor: (@line, @left, @right, @red = true) ->
    # @short = false

  height: -> 1 + Math.max(@left?.height() or 0, @right?.height() or 0)

  insert: (newNode, isRoot = false) ->
    comp = @line.comparePoint(newNode.line.plusEpsilon)
    # alert("#{comp} = #{@line} \\ (#{newNode.line.plusEpsilon.x}, #{newNode.line.plusEpsilon.y})")
    # alert(newNode.line.a.x + " " + comp)
    switch
      when comp < 0 and @left then new LineSegmentRbtNode(@line, @left.insert(newNode), @right, @red)._cleanUpAfterInsert(isRoot)
      when comp < 0 then new LineSegmentRbtNode(@line, newNode, @right, @red)._cleanUpAfterInsert(isRoot)
      when comp > 0 and @right then new LineSegmentRbtNode(@line, @left, @right.insert(newNode), @red)._cleanUpAfterInsert(isRoot)
      when comp > 0 then new LineSegmentRbtNode(@line, @left, newNode, @red)._cleanUpAfterInsert(isRoot)
      # TODO: do something useful when duplicate lines are detected

  delete: (item) ->
    comp = @line.comparePoint(item.plusEpsilon)
    # alert("deleting " + item.a.x)
    switch
      when comp < 0 and @left  then new LineSegmentRbtNode(@line, @left.delete(item), @right, @red)
      when comp > 0 and @right then new LineSegmentRbtNode(@line, @left, @right.delete(item), @red)
      when comp is 0 and @left then new LineSegmentRbtNode(@left._getRightmostLine(), @left._deleteRightmostDecendant(), @right, @red)
      when comp is 0 then @right
      # TODO: maintain the invariants

  _getRightmostLine: -> if @right then @right._getRightmostLine() else @line

  _deleteRightmostDecendant: ->
    if @right
      new LineSegmentRbtNode(@line, @left, @right._deleteRightmostDecendant(), @red)
      # TODO: maintain the invariants
    else
      @left

  _cleanUpAfterInsert: (isRoot) ->
    if not @red and @left?.red and @right?.red and (@left?.left?.red or @left?.right?.red or @right?.left?.red or @right?.right?.red)
      # condition 4a in "Planar point location using persistent search trees"
      @red = true
      @left.red = false
      @right.red = false
    if isRoot and @red and (@left?.red or @right?.red)
      # condition 4b
      @red = false
      this
    else if not @red and not @right?.red and @left?.red and @left?.left?.red
      # condition 4c
      new LineSegmentRbtNode(@left.line, @left.left, new LineSegmentRbtNode(@line, @left.right, @right), false)
    else if not @red and not @left?.red and @right?.red and @right?.right?.red
      # condition 4c
      new LineSegmentRbtNode(@right.line, new LineSegmentRbtNode(@line, @left, @right.left), @right.right, false)
    else if not @red and not @right?.red and @left?.red and @left?.right?.red
      # condition 4d
      new LineSegmentRbtNode(@left.right.line, new LineSegmentRbtNode(@left.line, @left.left, @left.right.left), new LineSegmentRbtNode(@line, @left.right.right, @right), false)
    else if not @red and not @left?.red and @right?.red and @right?.left?.red
      # condition 4d
      new LineSegmentRbtNode(@right.left.line, new LineSegmentRbtNode(@right.line, @right.left.right, @right.right), new LineSegmentRbtNode(@line, @left, @right.left.left), false)
    else
      this

  _cleanUpAfterDelete: ->

  toString: -> @line + (if @red then " red " else " black ") +  (if @left then " L:" + @left else "") + (if @right then " R:" + @right else "")
