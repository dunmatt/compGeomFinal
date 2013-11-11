# parent = new RbtNode(5, 5)
# parent.insert new RbtNode(1, 1)
# parent.insert new RbtNode(10, 10)

# d = [parent, parent.left, parent.right]

points = []
mousedown = ->
  point = d3.mouse(this)
  points[points.length] = {x: point[0], y: point[1]}
  svg.selectAll("circle").data(points).enter().append("circle")
                                                .attr("cx", (n) -> n.x)
                                                .attr("cy", (n) -> n.y)
                                                .attr("r", "5")
                                                .call(d3.behavior.drag())

svg = d3.select("body").append("svg")
                       .attr("width", 700)
                       .attr("height", 400)
                       .on("mousedown", mousedown)

# cluster = d3.layout.cluster().size(400, 700)

# nodes = cluster.nodes(parent)
# links = cluster.links(nodes)

# node = svg.selectAll(".node").data(nodes).enter().append("circle")
#                                                  .attr("class", "node")
#                                                  .attr("cx", (n) -> n.key*10)
#                                                  .attr("cy", (n) -> n.key*10)
#                                                  .attr("r", "5")

# circle = svg.selectAll("circle").data(points)
# enter = circle.enter().append("circle").attr("cy", (n) -> n.y).attr("r", "5")

# circle = svg.selectAll("circle").data(d).enter().append("circle").attr("cy", 90).attr("cx", (n)->10*n.key).attr("r", 10);