class window.LineSegment
  constructor: (@a, @b) ->
    if @a.x > @b.x
      [@a, @b] = [@b, @a]  # all edges go left to right so that they are created before they are deleted
    @slope = (@b.y - @a.y) / (@b.x - @a.x)
    @yIntercept = @a.y - (@a.x * @slope)
    @xe = @a.x + .0001
    @plusEpsilon = @pointAt(@xe)

  comparePoint: (pt) ->
    onLine = @yCoordAt(pt.x)
    switch
      when @a.x > pt.x or @b.x < pt.x then 0
      when Math.abs(pt.y - onLine) < .0001 then 0
      when pt.y > onLine then -1  # counterintuitive negative here beause the y axis is flipped
      when pt.y < onLine then 1

  compareLine: (line) -> @comparePoint(line.a) or @comparePoint(line.b) or @comparePoint(line.pointAt(@a.x)) or @comparePoint(line.pointAt(@b.x))

  yCoordAt: (x) -> x * @slope + @yIntercept

  pointAt: (x) -> {x: x, y: @yCoordAt(x)}

  toString: -> "(#{@a.x}, #{@a.y}) -> (#{@b.x}, #{@b.y})"
