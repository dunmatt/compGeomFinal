// Generated by CoffeeScript 1.4.0
(function() {
  var addEdgeMode, click, drag, dragended, dragmove, dragstarted, edges, keyAlreadyDown, keydown, keyup, lines, points, radius, reset, svg, tentativeEdge, vertices;

  points = [];

  lines = [];

  keyAlreadyDown = false;

  addEdgeMode = false;

  tentativeEdge = null;

  radius = 5;

  svg = d3.select("body").append("svg").attr("width", 700).attr("height", 400);

  edges = svg.append("svg:g").selectAll("line");

  vertices = svg.append("svg:g").selectAll("circle");

  keyup = function() {
    keyAlreadyDown = false;
    return addEdgeMode = false;
  };

  keydown = function() {
    d3.event.preventDefault();
    if (keyAlreadyDown) {
      return;
    }
    keyAlreadyDown = true;
    if (d3.event.keyCode === 16) {
      return addEdgeMode = true;
    }
  };

  dragstarted = function(d) {
    var s;
    d3.event.sourceEvent.stopPropagation;
    s = d3.select(this).classed("dragging", true);
    if (addEdgeMode) {
      return tentativeEdge = {
        origin: s,
        line: svg.append("line").attr("x1", s.attr("cx")).attr("y1", s.attr("cy"))
      };
    }
  };

  dragmove = function(d) {
    if (tentativeEdge != null) {
      return tentativeEdge.line.attr("x2", d3.event.x).attr("y2", d3.event.y);
    } else {
      d3.select(this).attr("cx", d3.event.x).attr("cy", d3.event.y);
      return reset();
    }
  };

  dragended = function(d) {
    var m;
    d3.select(this).classed("dragging", false);
    if (tentativeEdge != null) {
      m = d3.mouse(this);
      points.forEach(function(t) {
        var x, y;
        x = t.x - m[0];
        y = t.y - m[1];
        if (Math.sqrt(x * x + y * y) < radius) {
          return lines[lines.length] = {
            a: tentativeEdge.origin.datum(),
            b: t
          };
        }
      });
      tentativeEdge.line.remove();
      tentativeEdge = null;
    } else {
      d3.select(this).datum().x = 1 * d3.select(this).attr("cx");
      d3.select(this).datum().y = 1 * d3.select(this).attr("cy");
    }
    return reset();
  };

  drag = d3.behavior.drag().on("drag", dragmove).on("dragstart", dragstarted).on("dragend", dragended);

  click = function() {
    if (d3.event.defaultPrevented) {
      return;
    }
    points[points.length] = {
      x: d3.mouse(this)[0],
      y: d3.mouse(this)[1]
    };
    return reset();
  };

  reset = function() {
    edges = edges.data(lines).attr("x1", function(l) {
      return l.a.x;
    }).attr("y1", function(l) {
      return l.a.y;
    }).attr("x2", function(l) {
      return l.b.x;
    }).attr("y2", function(l) {
      return l.b.y;
    });
    edges.exit().remove();
    edges.enter().append("line").attr("x1", function(l) {
      return l.a.x;
    }).attr("y1", function(l) {
      return l.a.y;
    }).attr("x2", function(l) {
      return l.b.x;
    }).attr("y2", function(l) {
      return l.b.y;
    });
    vertices = vertices.data(points);
    vertices.exit().remove();
    return vertices.enter().append("circle").attr("cx", function(n) {
      return n.x;
    }).attr("cy", function(n) {
      return n.y;
    }).attr("r", radius).attr("class", "dot").style("cursor", "pointer").call(drag);
  };

  d3.select(window).on("keyup", keyup).on("keydown", keydown);

  svg.on("click", click);

}).call(this);
