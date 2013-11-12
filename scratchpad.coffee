points = []
lines = []
keyAlreadyDown = false
addEdgeMode = false
tentativeEdge = null
radius = 5

svg = d3.select("body").append("svg")
                       .attr("width", 700)
                       .attr("height", 400)
edges = svg.append("svg:g").selectAll("line")
vertices = svg.append("svg:g").selectAll("circle")

keyup = ->
  keyAlreadyDown = false
  addEdgeMode = false

keydown = ->
  d3.event.preventDefault()
  return if keyAlreadyDown
  keyAlreadyDown = true
  if d3.event.keyCode == 16
    addEdgeMode = true

dragstarted = (d) ->
  d3.event.sourceEvent.stopPropagation
  s = d3.select(this).classed("dragging", true)
  if addEdgeMode
    tentativeEdge = {origin: s
                     , line: svg.append("line")
                                .attr("x1", s.attr("cx"))
                                .attr("y1", s.attr("cy")) }

dragmove = (d) ->
  if tentativeEdge?
    tentativeEdge.line.attr("x2", d3.event.x).attr("y2", d3.event.y)
  else
    d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y)
    reset()

dragended = (d) ->
  d3.select(this).classed("dragging", false)
  if tentativeEdge?
    m = d3.mouse(this)
    points.forEach((t) -> 
                     x = t.x - m[0]
                     y = t.y - m[1]
                     if Math.sqrt(x*x + y*y) < radius
                       lines[lines.length] = {a: tentativeEdge.origin.datum(), b: t})
    tentativeEdge.line.remove()
    tentativeEdge = null
  else
    d3.select(this).datum().x = 1 * d3.select(this).attr("cx")  # *1 here is a typecast to int
    d3.select(this).datum().y = 1 * d3.select(this).attr("cy")
  reset()

drag = d3.behavior.drag()
  .on("drag", dragmove)
  .on("dragstart", dragstarted)
  .on("dragend", dragended)

click = ->
  return if d3.event.defaultPrevented
  points[points.length] = {x: d3.mouse(this)[0], y: d3.mouse(this)[1]}
  reset()

reset = ->
  edges = edges.data(lines)
               .attr("x1", (l) -> l.a.x)
               .attr("y1", (l) -> l.a.y)
               .attr("x2", (l) -> l.b.x)
               .attr("y2", (l) -> l.b.y)
  edges.exit().remove()
  edges.enter().append("line")
               .attr("x1", (l) -> l.a.x)
               .attr("y1", (l) -> l.a.y)
               .attr("x2", (l) -> l.b.x)
               .attr("y2", (l) -> l.b.y)

  vertices = vertices.data(points)
  vertices.exit().remove()
  vertices.enter().append("circle")
                  .attr("cx", (n) -> n.x)
                  .attr("cy", (n) -> n.y)
                  .attr("r", radius)
                  .attr("class", "dot")
                  .style("cursor", "pointer")
                  .call(drag)

d3.select(window).on("keyup", keyup).on("keydown", keydown)

svg.on("click", click)

