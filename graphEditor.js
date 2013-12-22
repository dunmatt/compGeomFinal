// Generated by CoffeeScript 1.4.0
(function() {
  var addEdge, addEdgeMode, click, deleteMode, deleteModeClass, deleteVertex, drag, dragended, dragmove, dragstarted, drawChildren, drawEdges, drawSlabs, drawTree, drawVertices, edgeModeClass, edges, editMode, editModeClass, height, keyAlreadyDown, keydown, keyup, lastTreeEnd, lines, mousemove, points, radius, reset, rightmostPointLeftOfMouse, slabLines, svg, tentativeEdge, toggleEditMode, tree, treeGroup, vertices,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  points = [];

  lines = [];

  tree = null;

  keyAlreadyDown = false;

  editMode = true;

  addEdgeMode = false;

  deleteMode = false;

  tentativeEdge = null;

  lastTreeEnd = null;

  radius = 5;

  height = 400;

  editModeClass = "editMode";

  edgeModeClass = "edgeMode";

  deleteModeClass = "deleteMode";

  svg = d3.select("body").append("svg").attr("width", 700).attr("height", height).attr("class", editModeClass);

  slabLines = svg.append("svg:g").selectAll("line");

  treeGroup = svg.append("svg:g");

  edges = svg.append("svg:g").selectAll("line");

  vertices = svg.append("svg:g").selectAll("circle");

  addEdge = function(v, e) {
    return v.edges[v.edges.length] = e;
  };

  deleteVertex = function(v) {
    var l, p;
    lines = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        l = lines[_i];
        if (__indexOf.call(v.edges, l) < 0) {
          _results.push(l);
        }
      }
      return _results;
    })();
    return points = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        p = points[_i];
        if (p !== v) {
          _results.push(p);
        }
      }
      return _results;
    })();
  };

  rightmostPointLeftOfMouse = function() {
    var best;
    best = {
      x: 0,
      y: height / 2
    };
    points.forEach(function(p) {
      if (p.x < d3.event.x && p.x > best.x) {
        return best = p;
      }
    });
    return best;
  };

  keyup = function() {
    if (editMode) {
      keyAlreadyDown = false;
      addEdgeMode = false;
      deleteMode = false;
      svg.classed(edgeModeClass, false);
      return svg.classed(deleteModeClass, false);
    }
  };

  keydown = function() {
    var r, _i, _len, _ref;
    if (d3.event.keyCode === 65) {
      _ref = tree.roots;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        alert("" + r.time + ": " + r.root);
      }
    }
    if (editMode) {
      d3.event.preventDefault();
      if (keyAlreadyDown) {
        return;
      }
      keyAlreadyDown = true;
      switch (d3.event.keyCode) {
        case 16:
          addEdgeMode = true;
          return svg.classed(edgeModeClass, true);
        case 17:
          deleteMode = true;
          return svg.classed(deleteModeClass, true);
      }
    }
  };

  mousemove = function() {
    if (!editMode) {
      return reset();
    }
  };

  dragstarted = function(d) {
    var s;
    if (editMode) {
      d3.event.sourceEvent.stopPropagation;
      s = d3.select(this).classed("dragging", true);
      if (addEdgeMode) {
        return tentativeEdge = {
          origin: s,
          line: svg.append("line").attr("x1", s.attr("cx")).attr("y1", s.attr("cy")).attr("x2", s.attr("cx")).attr("y2", s.attr("cy"))
        };
      }
    }
  };

  dragmove = function(d) {
    if (editMode) {
      if (tentativeEdge != null) {
        return tentativeEdge.line.attr("x2", d3.event.x).attr("y2", d3.event.y);
      } else {
        d3.select(this).datum().x = d3.event.x;
        d3.select(this).datum().y = d3.event.y;
        return reset();
      }
    }
  };

  dragended = function(d) {
    var m;
    if (editMode) {
      d3.select(this).classed("dragging", false);
      if (tentativeEdge != null) {
        m = d3.mouse(this);
        points.forEach(function(t) {
          var x, y;
          x = t.x - m[0];
          y = t.y - m[1];
          if (Math.sqrt(x * x + y * y) < radius) {
            lines[lines.length] = {
              a: tentativeEdge.origin.datum(),
              b: t
            };
            addEdge(tentativeEdge.origin.datum(), lines[lines.length - 1]);
            return addEdge(t, lines[lines.length - 1]);
          }
        });
        tentativeEdge.line.remove();
        tentativeEdge = null;
      }
      return reset();
    }
  };

  drag = d3.behavior.drag().on("drag", dragmove).on("dragstart", dragstarted).on("dragend", dragended);

  click = function() {
    var m;
    if (editMode) {
      if (d3.event.defaultPrevented) {
        return;
      }
      if (deleteMode) {
        m = d3.mouse(this);
        points.forEach(function(t) {
          var x, y;
          x = t.x - m[0];
          y = t.y - m[1];
          if (Math.sqrt(x * x + y * y) < radius) {
            return deleteVertex(t);
          }
        });
      } else {
        points[points.length] = {
          x: d3.mouse(this)[0],
          y: d3.mouse(this)[1],
          edges: []
        };
      }
      return reset();
    }
  };

  reset = function() {
    if (!editMode) {
      drawTree();
    }
    drawSlabs();
    drawEdges();
    return drawVertices();
  };

  drawTree = function() {
    var cy, gx, hx, root, ry, step;
    d3.selectAll(".rbtLink").remove();
    root = tree.getRoot(d3.event.x);
    if (root) {
      step = d3.event.x / (root.height());
      ry = height / 2;
      gx = step / 4;
      hx = step * 3 / 4;
      cy = root.line.pointAt(step);
      treeGroup.append("path").attr("d", "M0 " + ry + "C" + hx + " " + ry + " " + gx + " " + cy + " " + step + " " + cy).attr("class", "rbtLink");
      return drawChildren(root, step);
    }
  };

  drawChildren = function(origin, step, depth) {
    var cx, cy, gx, hx, rx, ry;
    if (depth == null) {
      depth = 1;
    }
    rx = step * depth;
    ry = origin.line.pointAt(rx);
    cx = rx + step;
    gx = rx + (step / 4);
    hx = rx + (step * 3 / 4);
    if (origin.left) {
      cy = origin.left.line.pointAt(cx);
      treeGroup.append("path").attr("d", "M" + rx + " " + ry + "C" + hx + " " + ry + " " + gx + " " + cy + " " + cx + " " + cy).attr("class", "rbtLink");
      drawChildren(origin.left, step, depth + 1);
    }
    if (origin.right) {
      cy = origin.right.line.pointAt(cx);
      treeGroup.append("path").attr("d", "M" + rx + " " + ry + "C" + hx + " " + ry + " " + gx + " " + cy + " " + cx + " " + cy).attr("class", "rbtLink");
      return drawChildren(origin.right, step, depth + 1);
    }
  };

  drawSlabs = function() {
    slabLines = slabLines.data(points).attr("x1", function(v) {
      return v.x;
    }).attr("x2", function(v) {
      return v.x;
    });
    slabLines.enter().append("line").attr("x1", function(v) {
      return v.x;
    }).attr("x2", function(v) {
      return v.x;
    }).attr("y1", function(v) {
      return 0;
    }).attr("y2", function(v) {
      return height;
    }).attr("class", "slabWall");
    return slabLines.exit().remove();
  };

  drawEdges = function() {
    edges = edges.data(lines).attr("x1", function(l) {
      return l.a.x;
    }).attr("y1", function(l) {
      return l.a.y;
    }).attr("x2", function(l) {
      return l.b.x;
    }).attr("y2", function(l) {
      return l.b.y;
    });
    edges.enter().append("line").attr("x1", function(l) {
      return l.a.x;
    }).attr("y1", function(l) {
      return l.a.y;
    }).attr("x2", function(l) {
      return l.b.x;
    }).attr("y2", function(l) {
      return l.b.y;
    });
    return edges.exit().remove();
  };

  drawVertices = function() {
    vertices = vertices.data(points).attr("cx", function(v) {
      return v.x;
    }).attr("cy", function(v) {
      return v.y;
    });
    vertices.enter().append("circle").attr("cx", function(v) {
      return v.x;
    }).attr("cy", function(v) {
      return v.y;
    }).attr("r", radius).attr("class", "dot").call(drag);
    return vertices.exit().remove();
  };

  toggleEditMode = function() {
    var events, seg, segments;
    editMode = !svg.classed(editModeClass);
    svg.classed(editModeClass, editMode);
    tree = new RedBlackTree();
    d3.selectAll(".rbtLink").remove();
    if (!editMode) {
      segments = lines.map(function(l) {
        return new LineSegment(l.a, l.b);
      });
      events = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = segments.length; _i < _len; _i++) {
          seg = segments[_i];
          _results.push([seg.a.x, true, seg]);
        }
        return _results;
      })()).concat((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = segments.length; _i < _len; _i++) {
          seg = segments[_i];
          _results.push([seg.b.x, false, seg]);
        }
        return _results;
      })());
      events.sort(function(a, b) {
        if (a[0] < b[0]) {
          return -1;
        } else {
          return 1;
        }
      });
      return events.forEach(function(e) {
        if (e[1]) {
          return tree.insert(e[0], e[2]);
        } else {
          return tree["delete"](e[0], e[2]);
        }
      });
    }
  };

  svg.on("click", click).on("mousemove", mousemove);

  d3.select(window).on("keyup", keyup).on("keydown", keydown).on("mousedown", function() {
    return d3.event.preventDefault();
  });

  d3.select("body").append("button").text("Toggle Query Mode").on("click", toggleEditMode);

}).call(this);
