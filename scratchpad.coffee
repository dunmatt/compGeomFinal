points = []
lines = []
keyAlreadyDown = false
addEdgeMode = false
deleteMode = false
tentativeEdge = null
radius = 5
height = 400
editModeClass = "editMode"
edgeModeClass = "edgeMode"
deleteModeClass = "deleteMode"

svg = d3.select("body").append("svg")
                       .attr("width", 700)
                       .attr("height", height)
                       .attr("class", editModeClass)
slabLines = svg.append("svg:g").selectAll("line")
edges = svg.append("svg:g").selectAll("line")
vertices = svg.append("svg:g").selectAll("circle")

addEdge = (v, e) -> v.edges[v.edges.length] = e

deleteVertex = (v) ->
  lines = (l for l in lines when l not in v.edges)
  points = (p for p in points when p isnt v)

keyup = ->
  keyAlreadyDown = false
  addEdgeMode = false
  deleteMode = false
  svg.classed(edgeModeClass, false)
  svg.classed(deleteModeClass, false)

keydown = ->
  d3.event.preventDefault()
  return if keyAlreadyDown
  keyAlreadyDown = true
  if d3.event.keyCode == 16
    addEdgeMode = true
    svg.classed(edgeModeClass, true)
  else if d3.event.keyCode == 17
    deleteMode = true
    svg.classed(deleteModeClass, true)

dragstarted = (d) ->
  d3.event.sourceEvent.stopPropagation
  s = d3.select(this).classed("dragging", true)
  if addEdgeMode
    tentativeEdge = {origin: s
                     , line: svg.append("line")
                                .attr("x1", s.attr("cx"))
                                .attr("y1", s.attr("cy"))
                                .attr("x2", s.attr("cx"))
                                .attr("y2", s.attr("cy")) }

dragmove = (d) ->
  if tentativeEdge?
    tentativeEdge.line.attr("x2", d3.event.x).attr("y2", d3.event.y)
  else
    d3.select(this).datum().x = d3.event.x
    d3.select(this).datum().y = d3.event.y
    reset()

dragended = (d) ->
  d3.select(this).classed("dragging", false)
  if tentativeEdge?
    m = d3.mouse(this)
    points.forEach((t) -> 
                     x = t.x - m[0]
                     y = t.y - m[1]
                     if Math.sqrt(x*x + y*y) < radius
                       lines[lines.length] = {a: tentativeEdge.origin.datum(), b: t}
                       addEdge(tentativeEdge.origin.datum(), lines[lines.length-1])
                       addEdge(t, lines[lines.length-1]) )
    tentativeEdge.line.remove()
    tentativeEdge = null
  reset()

drag = d3.behavior.drag()
  .on("drag", dragmove)
  .on("dragstart", dragstarted)
  .on("dragend", dragended)

click = ->
  return if d3.event.defaultPrevented
  if deleteMode
    m = d3.mouse(this)
    points.forEach((t) ->
                     x = t.x - m[0]
                     y = t.y - m[1]
                     if Math.sqrt(x*x + y*y) < radius
                       deleteVertex(t))
  else
    points[points.length] = {x: d3.mouse(this)[0], y: d3.mouse(this)[1], edges: []}
  reset()

reset = ->
  drawSlabs()
  drawEdges()
  drawVertices()

drawSlabs = ->
  slabLines = slabLines.data(points)
                       .attr("x1", (v) -> v.x)
                       .attr("x2", (v) -> v.x)
  slabLines.enter().append("line")
                   .attr("x1", (v) -> v.x)
                   .attr("x2", (v) -> v.x)
                   .attr("y1", (v) -> 0)
                   .attr("y2", (v) -> height)
                   .attr("class", "slabWall")
  slabLines.exit().remove()

drawEdges = ->
  edges = edges.data(lines)
               .attr("x1", (l) -> l.a.x)
               .attr("y1", (l) -> l.a.y)
               .attr("x2", (l) -> l.b.x)
               .attr("y2", (l) -> l.b.y)
  edges.enter().append("line")
               .attr("x1", (l) -> l.a.x)
               .attr("y1", (l) -> l.a.y)
               .attr("x2", (l) -> l.b.x)
               .attr("y2", (l) -> l.b.y)
  edges.exit().remove()

drawVertices = ->
  vertices = vertices.data(points)
                     .attr("cx", (v) -> v.x)
                     .attr("cy", (v) -> v.y)
  vertices.enter().append("circle")
                  .attr("cx", (v) -> v.x)
                  .attr("cy", (v) -> v.y)
                  .attr("r", radius)
                  .attr("class", "dot")
                  .call(drag)
  vertices.exit().remove()

svg.on("click", click)
d3.select(window).on("keyup", keyup).on("keydown", keydown).on("mousedown", -> d3.event.preventDefault())
d3.select("body").append("button")
                 .text("Toggle Query Mode")
                 .on("click", -> svg.classed(editModeClass, not svg.classed(editModeClass)))
