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
# alert(a)
a.insert(h)
a.insert(i)
a.insert(j)

alert(a)
# alert(b)
# alert(c)
# alert(d)
# alert(e)
 
# 5 red  L:3.5 R:10 [
#   3.5 black  P:5 L:3 R:4.25 [
#     3 red  P:3.5 L:2 R:3.25 [
#       2 red  P:3 L:1 [
#         1 black  P:2 [] ]
#       ,3.25 black  P:3 [] ]
#     ,4.25 black  P:3.5 L:4 R:4.75 [
#       4 red  P:4.25 []
#       ,4.75 red  P:4.25 [] ]
#    ]
#  ,10 black  P:5 []
# ]

# 5 red  L:1 R:10 [
#   1 red  P:5 R:3 [
#     3 red  P:1 L:2 R:4 [
#       2 black  P:3 []
#       ,4 red  P:3 L:3.5 [
#         3.5 black  P:4 []
#       ]
#     ]
#   ]
#   ,10 black  P:5 []
# ]

height = 400
width = 700

svg = d3.select("body").append("svg")
                       .attr("width", width)
                       .attr("height", height)

tree = d3.layout.tree().size([height, width])
diagonal = d3.svg.diagonal().projection((d) -> [d.y, d.x])

nodes = tree.nodes(g)
# nodes = tree.nodes(a)
links = tree.links(nodes)

svg.selectAll(".rbtLink").data(links).enter().append("path")
                                             .attr("class", "rbtLink")
                                             .attr("d", diagonal)

svg.selectAll(".node").data(nodes).enter().append("circle")
                                          .attr("class", "node")
                                          .attr("r", 10)
                                          .attr("cx", (d) -> d.key*50)