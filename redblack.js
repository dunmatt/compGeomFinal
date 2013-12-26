// Generated by CoffeeScript 1.4.0
(function() {

  window.RedBlackTree = (function() {

    function RedBlackTree() {
      this.lastModification = -99999999;
      this.roots = [];
    }

    RedBlackTree.prototype.insert = function(time, item) {
      var root;
      if (time >= this.lastModification) {
        root = this.getRoot(time);
        if (root) {
          return this._trackNewRoot(time, root.insert(new LineSegmentRbtNode(item), true));
        } else {
          return this._trackNewRoot(time, new LineSegmentRbtNode(item));
        }
      }
    };

    RedBlackTree.prototype["delete"] = function(time, item) {
      if (!this.getRoot(time)) {
        alert("no root at " + time);
      }
      if (time >= this.lastModification) {
        return this._trackNewRoot(time, this.getRoot(time)["delete"](item));
      }
    };

    RedBlackTree.prototype.height = function(time) {
      return this.getRoot(time).height();
    };

    RedBlackTree.prototype.getRoot = function(time) {
      var prev;
      prev = this.roots.filter(function(a) {
        return a.time <= time;
      });
      if (prev.length) {
        return prev.reduce(function(a, b) {
          if (a.time > b.time) {
            return a;
          } else {
            return b;
          }
        }).root;
      } else {
        return null;
      }
    };

    RedBlackTree.prototype._trackNewRoot = function(time, n) {
      this.lastModification = time;
      return this.roots[this.roots.length] = {
        time: time,
        root: n
      };
    };

    return RedBlackTree;

  })();

  window.LineSegmentRbtNode = (function() {

    function LineSegmentRbtNode(line, left, right, red, leftShort, rightShort) {
      this.line = line;
      this.left = left;
      this.right = right;
      this.red = red != null ? red : true;
      this.leftShort = leftShort != null ? leftShort : false;
      this.rightShort = rightShort != null ? rightShort : false;
      this.short = false;
    }

    LineSegmentRbtNode.prototype.height = function() {
      var _ref, _ref1;
      return 1 + Math.max(((_ref = this.left) != null ? _ref.height() : void 0) || 0, ((_ref1 = this.right) != null ? _ref1.height() : void 0) || 0);
    };

    LineSegmentRbtNode.prototype.insert = function(newNode, isRoot) {
      var comp;
      if (isRoot == null) {
        isRoot = false;
      }
      comp = this.line.compareLine(newNode.line);
      switch (false) {
        case !(comp < 0 && this.left):
          return new LineSegmentRbtNode(this.line, this.left.insert(newNode), this.right, this.red)._cleanUpAfterInsert(isRoot);
        case !(comp < 0):
          return new LineSegmentRbtNode(this.line, newNode, this.right, this.red)._cleanUpAfterInsert(isRoot);
        case !(comp > 0 && this.right):
          return new LineSegmentRbtNode(this.line, this.left, this.right.insert(newNode), this.red)._cleanUpAfterInsert(isRoot);
        case !(comp > 0):
          return new LineSegmentRbtNode(this.line, this.left, newNode, this.red)._cleanUpAfterInsert(isRoot);
      }
    };

    LineSegmentRbtNode.prototype["delete"] = function(item, parent) {
      var comp;
      if (parent == null) {
        parent = null;
      }
      comp = this.line.compareLine(item);
      switch (false) {
        case !(comp < 0 && this.left):
          return new LineSegmentRbtNode(this.line, this.left["delete"](item, this), this.right, this.red, this.leftShort, this.rightShort)._cleanUpAfterDelete();
        case !(comp > 0 && this.right):
          return new LineSegmentRbtNode(this.line, this.left, this.right["delete"](item, this), this.red, this.leftShort, this.rightShort)._cleanUpAfterDelete();
        case !(comp === 0 && this.left):
          return new LineSegmentRbtNode(this.left._getRightmostLine(), this.left._deleteRightmostDecendant(this), this.right, this.red, this.leftShort, this.rightShort)._cleanUpAfterDelete();
        case !(comp === 0 && this.right):
          this.right.short = !this.red;
          return this.right._cleanUpAfterDelete();
        case comp !== 0:
          if (parent != null) {
            parent.rightShort = !this.red;
          }
          return this.right;
        default:
          return alert("HUGE PROBLEM, delete failed to traverse the tree");
      }
    };

    LineSegmentRbtNode.prototype._getRightmostLine = function() {
      if (this.right) {
        return this.right._getRightmostLine();
      } else {
        return this.line;
      }
    };

    LineSegmentRbtNode.prototype._deleteRightmostDecendant = function(parent, isFirst) {
      if (isFirst == null) {
        isFirst = true;
      }
      if (this.right) {
        return new LineSegmentRbtNode(this.line, this.left, this.right._deleteRightmostDecendant(this, false), this.red, this.leftShort, this.rightShort)._cleanUpAfterDelete();
      } else if (this.left) {
        this.left.short = !this.red;
        return this.left._cleanUpAfterDelete();
      } else if (isFirst) {
        parent.leftShort = !this.red;
        return this.left;
      } else {
        parent.rightShort = !this.red;
        return this.right;
      }
    };

    LineSegmentRbtNode.prototype._cleanUpAfterInsert = function(isRoot) {
      var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (!this.red && ((_ref = this.left) != null ? _ref.red : void 0) && ((_ref1 = this.right) != null ? _ref1.red : void 0) && (((_ref2 = this.left) != null ? (_ref3 = _ref2.left) != null ? _ref3.red : void 0 : void 0) || ((_ref4 = this.left) != null ? (_ref5 = _ref4.right) != null ? _ref5.red : void 0 : void 0) || ((_ref6 = this.right) != null ? (_ref7 = _ref6.left) != null ? _ref7.red : void 0 : void 0) || ((_ref8 = this.right) != null ? (_ref9 = _ref8.right) != null ? _ref9.red : void 0 : void 0))) {
        this.red = true;
        this.left.red = false;
        this.right.red = false;
      }
      if (isRoot && this.red && (((_ref10 = this.left) != null ? _ref10.red : void 0) || ((_ref11 = this.right) != null ? _ref11.red : void 0))) {
        this.red = false;
        return this;
      } else if (!this.red && !((_ref12 = this.right) != null ? _ref12.red : void 0) && ((_ref13 = this.left) != null ? _ref13.red : void 0) && ((_ref14 = this.left) != null ? (_ref15 = _ref14.left) != null ? _ref15.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.left.line, this.left.left, new LineSegmentRbtNode(this.line, this.left.right, this.right), false);
      } else if (!this.red && !((_ref16 = this.left) != null ? _ref16.red : void 0) && ((_ref17 = this.right) != null ? _ref17.red : void 0) && ((_ref18 = this.right) != null ? (_ref19 = _ref18.right) != null ? _ref19.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.right.line, new LineSegmentRbtNode(this.line, this.left, this.right.left), this.right.right, false);
      } else if (!this.red && !((_ref20 = this.right) != null ? _ref20.red : void 0) && ((_ref21 = this.left) != null ? _ref21.red : void 0) && ((_ref22 = this.left) != null ? (_ref23 = _ref22.right) != null ? _ref23.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.left.right.line, new LineSegmentRbtNode(this.left.line, this.left.left, this.left.right.left), new LineSegmentRbtNode(this.line, this.left.right.right, this.right), false);
      } else if (!this.red && !((_ref24 = this.left) != null ? _ref24.red : void 0) && ((_ref25 = this.right) != null ? _ref25.red : void 0) && ((_ref26 = this.right) != null ? (_ref27 = _ref26.left) != null ? _ref27.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.right.left.line, new LineSegmentRbtNode(this.line, this.left, this.right.left.left), new LineSegmentRbtNode(this.right.line, this.right.left.right, this.right.right), false);
      } else {
        return this;
      }
    };

    LineSegmentRbtNode.prototype._cleanUpAfterDelete = function() {
      var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref3, _ref30, _ref31, _ref32, _ref33, _ref34, _ref35, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (this.red && this.short) {
        this.red = false;
        this.short = false;
        return this;
      } else {
        if (!this.red && (((_ref = this.left) != null ? _ref.short : void 0) || this.leftShort) && this.right && !this.right.red && !((_ref1 = this.right.left) != null ? _ref1.red : void 0) && !((_ref2 = this.right.right) != null ? _ref2.red : void 0)) {
          this.leftShort = false;
          this.short = true;
          this.right.red = true;
          if ((_ref3 = this.left) != null) {
            _ref3.short = false;
          }
        }
        if (!this.red && (((_ref4 = this.right) != null ? _ref4.short : void 0) || this.rightShort) && this.left && !this.left.red && !((_ref5 = this.left.right) != null ? _ref5.red : void 0) && !((_ref6 = this.left.left) != null ? _ref6.red : void 0)) {
          this.rightShort = false;
          this.short = true;
          this.left.red = true;
          if ((_ref7 = this.right) != null) {
            _ref7.short = false;
          }
        }
        if (!this.red && (((_ref8 = this.left) != null ? _ref8.short : void 0) || this.leftShort) && ((_ref9 = this.right) != null ? _ref9.red : void 0)) {
          this.leftShort = false;
          return new LineSegmentRbtNode(this.right.line, new LineSegmentRbtNode(this.line, this.left, this.right.left)._cleanUpAfterDelete(), this.right.right, false)._cleanUpAfterDelete();
        } else if (!this.red && (((_ref10 = this.right) != null ? _ref10.short : void 0) || this.rightShort) && ((_ref11 = this.left) != null ? _ref11.red : void 0)) {
          this.rightShort = false;
          return new LineSegmentRbtNode(this.left.line, this.left.left, new LineSegmentRbtNode(this.line, this.left.right, this.right)._cleanUpAfterDelete(), false)._cleanUpAfterDelete();
        } else if (this.red && (((_ref12 = this.left) != null ? _ref12.short : void 0) || this.leftShort) && this.right && !this.right.red && !((_ref13 = this.right.left) != null ? _ref13.red : void 0) && !((_ref14 = this.right.right) != null ? _ref14.red : void 0)) {
          this.leftShort = false;
          this.red = false;
          this.right.red = true;
          if ((_ref15 = this.left) != null) {
            _ref15.short = false;
          }
          return this;
        } else if (this.red && (((_ref16 = this.right) != null ? _ref16.short : void 0) || this.rightShort) && this.left && !this.left.red && !((_ref17 = this.left.right) != null ? _ref17.red : void 0) && !((_ref18 = this.left.left) != null ? _ref18.red : void 0)) {
          this.rightShort = false;
          this.red = false;
          this.left.red = true;
          if ((_ref19 = this.right) != null) {
            _ref19.short = false;
          }
          return this;
        } else if ((((_ref20 = this.left) != null ? _ref20.short : void 0) || this.leftShort) && ((_ref21 = this.right) != null ? (_ref22 = _ref21.right) != null ? _ref22.red : void 0 : void 0) && !this.right.red) {
          this.leftShort = false;
          if ((_ref23 = this.left) != null) {
            _ref23.short = false;
          }
          this.right.right.red = false;
          return new LineSegmentRbtNode(this.right.line, new LineSegmentRbtNode(this.line, this.left, this.right.left), this.right.right, this.red);
        } else if ((((_ref24 = this.right) != null ? _ref24.short : void 0) || this.rightShort) && ((_ref25 = this.left) != null ? (_ref26 = _ref25.left) != null ? _ref26.red : void 0 : void 0) && !this.left.red) {
          this.rightShort = false;
          if ((_ref27 = this.right) != null) {
            _ref27.short = false;
          }
          this.left.left.red = false;
          return new LineSegmentRbtNode(this.left.line, this.left.left, new LineSegmentRbtNode(this.line, this.left.right, this.right), this.red);
        } else if ((((_ref28 = this.left) != null ? _ref28.short : void 0) || this.leftShort) && ((_ref29 = this.right) != null ? (_ref30 = _ref29.left) != null ? _ref30.red : void 0 : void 0) && !this.right.red) {
          this.leftShort = false;
          if ((_ref31 = this.left) != null) {
            _ref31.short = false;
          }
          this.right.left.red = false;
          return new LineSegmentRbtNode(this.right.left.line, new LineSegmentRbtNode(this.line, this.left, this.right.left.left), new LineSegmentRbtNode(this.right.line, this.right.left.right, this.right.right), this.red);
        } else if ((((_ref32 = this.right) != null ? _ref32.short : void 0) || this.rightShort) && ((_ref33 = this.left) != null ? (_ref34 = _ref33.right) != null ? _ref34.red : void 0 : void 0) && !this.left.red) {
          this.rightShort = false;
          if ((_ref35 = this.right) != null) {
            _ref35.short = false;
          }
          this.left.right.red = false;
          return new LineSegmentRbtNode(this.left.right.line, new LineSegmentRbtNode(this.left.line, this.left.left, this.left.right.left), new LineSegmentRbtNode(this.line, this.left.right.right, this.right), this.red);
        } else {
          return this;
        }
      }
    };

    LineSegmentRbtNode.prototype.toString = function() {
      return this.line + (this.red ? " red " : " black ") + (this.left ? " L:" + this.left : "") + "|" + (this.right ? " R:" + this.right : "");
    };

    return LineSegmentRbtNode;

  })();

}).call(this);
