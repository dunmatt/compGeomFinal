a = new RbtNode(5, 5)
b = new RbtNode(10, 10)
c = new RbtNode(1, 1)
d = new RbtNode(2, 3)
e = new RbtNode(3, 3)
f = new RbtNode(4, 3)
g = new RbtNode(3.5, 3)
h = new RbtNode(3.25, 3)
i = new RbtNode(4.25, 3)
j = new RbtNode(4.75, 3)

a.insert(b)
a.insert(c)
a.insert(d)
a.insert(e)
a.insert(f)
a.insert(g)
a.insert(h)
a.insert(i)
a.insert(j)

# alert(a)
# alert(b)
# alert(c)
# alert(d)
# alert(e)
 
getEve = (n) ->
  if n.parent
    getEve(n.parent)
  else
    n

# getEve(a).delete({key: 1})
# getEve(a).delete({key: 2})
# getEve(a).delete({key: 3})
# getEve(a).delete({key: 3.5})
# getEve(a).delete({key: 4})
# getEve(a).delete(a)



# alert(getEve(a))

height = 400
width = 700

svg = d3.select("body").append("svg")
                       .attr("width", width)
                       .attr("height", height)

tree = d3.layout.tree().size([height, width])
diagonal = d3.svg.diagonal().projection((d) -> [d.y, d.x])

# nodes = tree.nodes(g)
nodes = tree.nodes(getEve(a))
links = tree.links(nodes)

svg.selectAll(".rbtLink").data(links).enter().append("path")
                                             .attr("class", "rbtLink")
                                             .attr("d", diagonal)

svg.selectAll(".node").data(nodes).enter().append("circle")
                                          .attr("class", "node")
                                          .attr("r", 10)
                                          .attr("cy", (d) -> d.x)
                                          .attr("cx", (d) -> d.key)