class window.LineSegment
  constructor: (@a, @b) ->
    if @a.x > @b.x
      [@a, @b] = [@b, @a]  # all edges go left to right so that they are created before they are deleted
    @slope = (@b.y - @a.y) / (@b.x - @a.x)
    @yIntercept = @a.y - @a.x * @slope
    @midPoint = {x: (a.x + b.x) / 2.0, y: (a.y + b.y) / 2.0}

  comparePoint: (pt) ->
    onLine = @pointAt(pt.x)
    switch
      when pt.y == onLine then 0
      when pt.y > onLine then -1
      when pt.y < onLine then 1

  pointAt: (x) -> x * @slope + @yIntercept

  toString: -> "(#{@a.x}, #{@a.y}) -> (#{@b.x}, #{@b.y})"
