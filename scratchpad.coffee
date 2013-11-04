parent = new RbtNode(5, 5)
parent.insert new RbtNode(1, 1)
parent.insert new RbtNode(10, 10)

d = [parent, parent.left, parent.right]

svg = d3.select("body").append("svg").attr("width", 700).attr("height", 400)

cluster = d3.layout.cluster().size(400, 700)

nodes = cluster.nodes(parent)
links = cluster.links(nodes)

node = svg.selectAll(".node").data(nodes).enter().append("g").attr("class", "node")

# circle = svg.selectAll("circle").data(d).enter().append("circle").attr("cy", 90).attr("cx", (n)->10*n.key).attr("r", 10);