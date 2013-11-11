points = []
lines = []
keyAlreadyDown = false
addEdgeMode = false
tentativeEdge = null

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

dragended = (d) ->
  d3.select(this).classed("dragging", false)
  d3.select(this).datum().x = 1 * d3.select(this).attr("cx")  # *1 here is a typecast to int
  d3.select(this).datum().y = 1 * d3.select(this).attr("cy")
  tentativeEdge = null

drag = d3.behavior.drag()
  .on("drag", dragmove)
  .on("dragstart", dragstarted)
  .on("dragend", dragended)

click = ->
  return if d3.event.defaultPrevented
  points[points.length] = {x: d3.mouse(this)[0], y: d3.mouse(this)[1], id: points.length}
  reset()

# mousedown = ->
  # alert "shift" if d3.event.shiftKey

reset = ->
  vertices = vertices.data(points)
  vertices.enter().append("circle")
                                                .attr("cx", (n) -> n.x)
                                                .attr("cy", (n) -> n.y)
                                                .attr("r", "5")
                                                .attr("class", "dot")
                                                .style("cursor", "pointer")
                                                .call(drag)

d3.select(window).on("keyup", keyup).on("keydown", keydown)

svg.on("click", click)
                       # .on("mousedown", mousedown)

# svg.selectAll("circle").data([{x:5, y:100}, {x:20, y:50}]).enter().append("circle")
#                                             .attr("cx", (n) -> n.x)
#                                             .attr("cy", (n) -> n.y)
#                                             .attr("r", "5")
#                                             .attr("class", "dot")
#                                             .call(drag)
