points = []
lines = []
tree = null
keyAlreadyDown = false
editMode = true
addEdgeMode = false
deleteMode = false
tentativeEdge = null
lastTreeEnd = null
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
treeGroup = svg.append("svg:g")
edges = svg.append("svg:g").selectAll("line")
vertices = svg.append("svg:g").selectAll("circle")

addEdge = (v, e) -> v.edges[v.edges.length] = e

deleteVertex = (v) ->
  lines = (l for l in lines when l not in v.edges)
  points = (p for p in points when p isnt v)

rightmostPointLeftOfMouse = ->
  best = {x: 0, y: height/2}
  points.forEach((p) -> best = p if p.x < d3.event.x and p.x > best.x)
  best

keyup = ->
  if editMode
    keyAlreadyDown = false
    addEdgeMode = false
    deleteMode = false
    svg.classed(edgeModeClass, false)
    svg.classed(deleteModeClass, false)

keydown = ->
  if d3.event.keyCode == 65 # a
    for r in tree.roots
      alert("#{r.time}: #{r.root}")
  if editMode
    d3.event.preventDefault()
    return if keyAlreadyDown
    keyAlreadyDown = true
    switch d3.event.keyCode
      when 16  # shift
        addEdgeMode = true
        svg.classed(edgeModeClass, true)
      when 17  # ctrl
        deleteMode = true
        svg.classed(deleteModeClass, true)

mousemove = ->
  if not editMode
    reset()

dragstarted = (d) ->
  if editMode
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
  if editMode
    if tentativeEdge?
      tentativeEdge.line.attr("x2", d3.event.x).attr("y2", d3.event.y)
    else
      d3.select(this).datum().x = d3.event.x
      d3.select(this).datum().y = d3.event.y
      reset()

dragended = (d) ->
  if editMode
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
  if editMode
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
  if not editMode
    drawTree()
  drawSlabs()
  drawEdges()
  drawVertices()

drawTree = ->
  d3.selectAll(".rbtLink").remove()
  root = tree.getRoot(d3.event.x)
  if root
    step = d3.event.x / (root.height())
    ry = height / 2
    gx = step / 4
    hx = step * 3 / 4
    cy = root.line.pointAt(step)
    treeGroup.append("path").attr("d", "M0 #{ry}C#{hx} #{ry} #{gx} #{cy} #{step} #{cy}").attr("class", "rbtLink")
    drawChildren(root, step)

drawChildren = (origin, step, depth = 1) ->
  rx = step * depth
  ry = origin.line.pointAt(rx)
  cx = rx + step
  gx = rx + (step / 4)
  hx = rx + (step * 3 / 4)
  if origin.left
    cy = origin.left.line.pointAt(cx)
    treeGroup.append("path").attr("d", "M#{rx} #{ry}C#{hx} #{ry} #{gx} #{cy} #{cx} #{cy}").attr("class", "rbtLink")
    drawChildren(origin.left, step, depth + 1)
  if origin.right
    cy = origin.right.line.pointAt(cx)
    treeGroup.append("path").attr("d", "M#{rx} #{ry}C#{hx} #{ry} #{gx} #{cy} #{cx} #{cy}").attr("class", "rbtLink")
    drawChildren(origin.right, step, depth + 1)

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

toggleEditMode = ->
  editMode = not svg.classed(editModeClass)
  svg.classed(editModeClass, editMode)
  tree = new RedBlackTree()
  d3.selectAll(".rbtLink").remove()
  if not editMode
    segments = lines.map((l) -> new LineSegment(l.a, l.b))
    # make a list of all the creations and all the deletions, with timestamps
    events = ([seg.a.x, true, seg] for seg in segments).concat(([seg.b.x, false, seg] for seg in segments))
    # sort chonologically
    events.sort((a, b) -> if a[0] < b[0] then -1 else 1)
    # populate (and depopulate) the rbt
    events.forEach((e) -> if e[1] then tree.insert(e[0], e[2]) else tree.delete(e[0], e[2]))
    # alert(tree.roots.length)

svg.on("click", click).on("mousemove", mousemove)
d3.select(window).on("keyup", keyup)
                 .on("keydown", keydown)
                 .on("mousedown", -> d3.event.preventDefault())
d3.select("body").append("button")
                 .text("Toggle Query Mode")
                 .on("click", toggleEditMode)
