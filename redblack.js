// Generated by CoffeeScript 1.4.0
(function() {

  window.RedBlackTree = (function() {

    function RedBlackTree() {
      this.lastModification = -99999999;
      this.roots = [];
    }

    RedBlackTree.prototype.insert = function(t, i) {
      var root;
      if (t >= this.lastModification) {
        root = this.getRoot(t);
        if (root) {
          return this._trackNewRoot(t, root.insert(new LineSegmentRbtNode(i), true));
        } else {
          return this._trackNewRoot(t, new LineSegmentRbtNode(i));
        }
      }
    };

    RedBlackTree.prototype["delete"] = function(t, i) {
      if (t > this.lastModification) {
        return this._trackNewRoot(t, this.getRoot(t)["delete"](i));
      }
    };

    RedBlackTree.prototype.height = function(t) {
      return this.getRoot(t).height();
    };

    RedBlackTree.prototype.getRoot = function(t) {
      var prev;
      prev = this.roots.filter(function(a) {
        return a.time <= t;
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

    RedBlackTree.prototype._trackNewRoot = function(t, n) {
      this.lastModification = t;
      return this.roots[this.roots.length] = {
        time: t,
        root: n
      };
    };

    return RedBlackTree;

  })();

  window.LineSegmentRbtNode = (function() {

    function LineSegmentRbtNode(line, left, right, red) {
      this.line = line;
      this.left = left;
      this.right = right;
      this.red = red != null ? red : true;
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
      comp = this.line.comparePoint(newNode.line.midPoint);
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

    LineSegmentRbtNode.prototype["delete"] = function(item) {
      var comp;
      comp = this.line.comparePoint(item.midPoint);
      switch (false) {
        case !(comp < 0 && this.left):
          return new LineSegmentRbtNode(this.line, this.left["delete"](item), this.right, this.red);
        case !(comp > 0 && this.right):
          return new LineSegmentRbtNode(this.line, this.left, this.right["delete"](item), this.red);
        case !(comp === 0 && this.left):
          return new LineSegmentRbtNode(this.left._getRightmostLine(), this.left._deleteRightmostDecendant(), this.right, this.red);
        case comp !== 0:
          return this.right;
      }
    };

    LineSegmentRbtNode.prototype._getRightmostLine = function() {
      if (this.right) {
        return this.right._getRightmostLine();
      } else {
        return this.line;
      }
    };

    LineSegmentRbtNode.prototype._deleteRightmostDecendant = function() {
      if (this.right) {
        return new LineSegmentRbtNode(this.line, this.left, this.right._deleteRightmostDecendant(), this.red);
      } else {
        return this.left;
      }
    };

    LineSegmentRbtNode.prototype._cleanUpAfterInsert = function(isRoot) {
      var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (!this.red && ((_ref = this.left) != null ? _ref.red : void 0) && ((_ref1 = this.right) != null ? _ref1.red : void 0) && (((_ref2 = this.left) != null ? (_ref3 = _ref2.left) != null ? _ref3.red : void 0 : void 0) || ((_ref4 = this.left) != null ? (_ref5 = _ref4.right) != null ? _ref5.red : void 0 : void 0) || ((_ref6 = this.right) != null ? (_ref7 = _ref6.left) != null ? _ref7.red : void 0 : void 0) || ((_ref8 = this.right) != null ? (_ref9 = _ref8.right) != null ? _ref9.red : void 0 : void 0))) {
        this.red = true;
        this.left.red = false;
        this.right.red = false;
      }
      if (isRoot && this.red && (((_ref10 = this.left) != null ? _ref10.red : void 0) && !this.right || ((_ref11 = this.right) != null ? _ref11.red : void 0) && !this.left)) {
        this.red = false;
        return this;
      } else if (!this.red && this.right && !this.right.red && ((_ref12 = this.left) != null ? _ref12.red : void 0) && ((_ref13 = this.left) != null ? (_ref14 = _ref13.left) != null ? _ref14.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.left.line, this.left.left, new LineSegmentRbtNode(this.line, this.left.right, this.right), false);
      } else if (!this.red && this.left && !this.left.red && ((_ref15 = this.right) != null ? _ref15.red : void 0) && ((_ref16 = this.right) != null ? (_ref17 = _ref16.right) != null ? _ref17.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.right.line, new LineSegmentRbtNode(this.line, this.left, this.right.left), this.right.right, false);
      } else if (!this.red && this.right && !this.right.red && ((_ref18 = this.left) != null ? _ref18.red : void 0) && ((_ref19 = this.left) != null ? (_ref20 = _ref19.right) != null ? _ref20.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.left.right.line, new LineSegmentRbtNode(this.left.line, this.left.left, this.left.right.left), new LineSegmentRbtNode(this.line, this.left.right.right, this.right), false);
      } else if (!this.red && this.left && !this.left.red && ((_ref21 = this.right) != null ? _ref21.red : void 0) && ((_ref22 = this.right) != null ? (_ref23 = _ref22.left) != null ? _ref23.red : void 0 : void 0)) {
        return new LineSegmentRbtNode(this.right.left.line, new LineSegmentRbtNode(this.right.line, this.right.left.right, this.right.right), new LineSegmentRbtNode(this.line, this.left, this.right.left.left), false);
      } else {
        return this;
      }
    };

    LineSegmentRbtNode.prototype._cleanUpAfterDelete = function() {};

    LineSegmentRbtNode.prototype.toString = function() {
      return this.line + (this.red ? " red " : " black ") + (this.left ? " L:" + this.left : "") + (this.right ? " R:" + this.right : "");
    };

    return LineSegmentRbtNode;

  })();

  window.RbtNode = (function() {

    function RbtNode(key, value) {
      this.key = key;
      this.value = value;
      this.red = true;
      this.children = [];
      this.left = null;
      this.right = null;
      this.newChild = null;
      this.newChildLeft = false;
      this.newChildTime = -1;
    }

    RbtNode.prototype.insert = function(t, i) {
      switch (false) {
        case !(i.key < this.key && t > this.newChildTime && this.newChildLeft):
          this.newChild.insert(t, i);
          break;
        case !(i.key < this.key && this.left):
          this.left.insert(t, i);
          break;
        case !(i.key < this.key):
          this.left = i;
          break;
        case !(i.key > this.key && t > this.newChildTime && !this.newChildLeft):
          this.newChild.insert(t, i);
          break;
        case !(i.key > this.key && this.right):
          this.right.insert(t, i);
          break;
        case !(i.key > this.key):
          this.right = i;
      }
      i._cleanUpAfterInsert();
      return this._updateChildren();
    };

    RbtNode.prototype["delete"] = function(t, i) {
      switch (false) {
        case i.key !== this.key:
          this._removeParentOfOne(this._swapToBottom());
          break;
        case !(i.key < this.key && t > this.newChildTime && this.newChildLeft):
          this.newChild["delete"](t, i);
          break;
        case !(i.key < this.key && this.left):
          this.left["delete"](i);
          break;
        case !(i.key > this.key && t > this.newChildTime && !this.newChildLeft):
          this.newChild["delete"](t, i);
          break;
        case !(i.key > this.key && this.right):
          this.right["delete"](i);
      }
      return this._updateChildren();
    };

    RbtNode.prototype.getHeight = function(t) {
      var l, r, _ref, _ref1;
      l = t > this.newChildTime && this.newChild && this.newChildLeft && this.newChild.getHeight(t) || ((_ref = this.left) != null ? _ref.getHeight(t) : void 0) || 0;
      r = t > this.newChildTime && this.newChild && !this.newChildLeft && this.newChild.getHeight(t) || ((_ref1 = this.right) != null ? _ref1.getHeight(t) : void 0) || 0;
      return 1 + Math.max(l, r);
    };

    RbtNode.prototype._swapToBottom = function() {
      var other, _ref, _ref1;
      other = this._findPrevious();
      if (other) {
        _ref = [other.key, this.key], this.key = _ref[0], other.key = _ref[1];
        _ref1 = [other.value, this.value], this.value = _ref1[0], other.value = _ref1[1];
        return other;
      } else {
        return this;
      }
    };

    RbtNode.prototype._removeParentOfOne = function(victim) {
      var child, leftShort;
      child = victim.left || victim.right;
      leftShort = false;
      if (victim._isLeftChild()) {
        victim.parent.left = child;
        leftShort = true;
      } else if (victim._isRightChild()) {
        victim.parent.right = child;
      }
      if (child) {
        child.parent = victim.parent;
      }
      if (!victim.red && this.parent) {
        this.parent._cleanUpAfterDelete(leftShort);
      }
      victim.parent = null;
      victim.right = null;
      return victim.left = null;
    };

    RbtNode.prototype._findPrevious = function() {
      var _ref;
      return (_ref = this.left) != null ? _ref._findRightMost() : void 0;
    };

    RbtNode.prototype._findRightMost = function() {
      if (this.right != null) {
        return this.right._findRightMost();
      } else {
        return this;
      }
    };

    RbtNode.prototype._updateChildren = function() {
      this.children = [];
      switch (false) {
        case !(this.left && this.right):
          return this.children = [this.left, this.right];
        case !this.left:
          return this.children = [this.left];
        case !this.right:
          return this.children = [this.right];
      }
    };

    RbtNode.prototype._cleanUpAfterInsert = function() {
      var og, _ref, _ref1, _ref2, _ref3;
      if (this.red && ((_ref = this.parent) != null ? _ref.red : void 0) && ((_ref1 = this._uncle()) != null ? _ref1.red : void 0)) {
        this.parent.red = false;
        this._uncle().red = false;
        this.parent.parent.red = true;
        this.parent.parent._cleanUpAfterInsert();
      }
      if (this.red && ((_ref2 = this.parent) != null ? _ref2.red : void 0)) {
        if (!((_ref3 = this.parent) != null ? _ref3.parent : void 0)) {
          return this.parent.red = false;
        } else {
          og = this.parent.parent;
          og.red = true;
          if (this.parent._isLeftChild()) {
            if (this._isRightChild()) {
              this._rotateLeft(this.parent);
            }
            og.left.red = false;
            return this._rotateRight(og);
          } else {
            if (this._isLeftChild()) {
              this._rotateRight(this.parent);
            }
            og.right.red = false;
            return this._rotateLeft(og);
          }
        }
      }
    };

    RbtNode.prototype._cleanUpAfterDelete = function(leftShort) {
      if (leftShort) {
        return this._cleanUpAfterDeleteLeft();
      } else {
        return this._cleanUpAfterDeleteRight();
      }
    };

    RbtNode.prototype._cleanUpAfterDeleteLeft = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      if ((_ref = this.left) != null ? _ref.red : void 0) {
        return this.left.red = false;
      } else {
        if (this.right && this.right.left && this.right.right && !(((_ref1 = this.left) != null ? _ref1.red : void 0) || this.red || this.right.red || this.right.left.red || this.right.right.red)) {
          this.right.red = true;
          this.parent._cleanUpAfterDelete(this._isLeftChild());
        }
        if (((_ref2 = this.right) != null ? _ref2.red : void 0) && !((_ref3 = this.left) != null ? _ref3.red : void 0) && !this.red) {
          this.red = true;
          this.right.red = false;
          this._rotateLeft(this);
        }
        if (this.red && this.right && this.right.left && this.right.right && !(this.right.red || this.right.left.red || this.right.right.red)) {
          this.red = false;
          return this.right.red = true;
        } else if (this.right && !this.right.red && this.right.right && !(this.right.right.red || this.right.left)) {
          this.right.red = this.red;
          this.red = false;
          return this._rotateLeft(this);
        } else if (this.right && this.right.right && ((_ref4 = this.right.left) != null ? _ref4.red : void 0) && !this.right.right.red) {
          this.right.left.red = this.red;
          this.red = false;
          this._rotateRight(this.right);
          return this._rotateLeft(this);
        }
      }
    };

    RbtNode.prototype._cleanUpAfterDeleteRight = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      if ((_ref = this.right) != null ? _ref.red : void 0) {
        return this.right.red = false;
      } else {
        if (this.left && this.left.right && this.left.left && !(((_ref1 = this.right) != null ? _ref1.red : void 0) || this.red || this.left.red || this.left.right.red || this.left.left.red)) {
          this.left.red = true;
          this.parent._cleanUpAfterDelete(this._isLeftChild());
        }
        if (((_ref2 = this.left) != null ? _ref2.red : void 0) && !((_ref3 = this.right) != null ? _ref3.red : void 0) && !this.red) {
          this.red = true;
          this.left.red = false;
          this._rotateRight(this);
        }
        if (this.red && this.left && this.left.left && this.left.right && !(this.left.red || this.left.left.red || this.left.right.red)) {
          this.red = false;
          return this.left.red = true;
        } else if (this.left && !this.left.red && this.left.left && !(this.left.left.red || this.left.right)) {
          this.left.red = this.red;
          this.red = false;
          return this._rotateRight(this);
        } else if (this.left && this.left.left && ((_ref4 = this.left.right) != null ? _ref4.red : void 0) && !this.left.left.red) {
          this.left.right.red = this.red;
          this.red = false;
          this._rotateLeft(this.left);
          return this._rotateRight(this);
        }
      }
    };

    RbtNode.prototype._rotateLeft = function(root) {
      var B, x, y, _ref;
      if (root != null ? root.right : void 0) {
        x = root;
        y = x.right;
        B = y.left;
        x.right = B;
        y.left = x;
        if (root._isLeftChild()) {
          root.parent.left = y;
        } else if (root._isRightChild()) {
          root.parent.right = y;
        }
        y.parent = x.parent;
        x.parent = y;
        if (B) {
          B.parent = x;
        }
        x._updateChildren();
        y._updateChildren();
        return (_ref = y.parent) != null ? _ref._updateChildren() : void 0;
      }
    };

    RbtNode.prototype._rotateRight = function(root) {
      var B, x, y, _ref;
      if (root != null ? root.left : void 0) {
        y = root;
        x = y.left;
        B = x.right;
        x.right = y;
        y.left = B;
        if (root._isLeftChild()) {
          root.parent.left = x;
        } else if (root._isRightChild()) {
          root.parent.right = x;
        }
        x.parent = y.parent;
        y.parent = x;
        if (B) {
          B.parent = y;
        }
        x._updateChildren();
        y._updateChildren();
        return (_ref = x.parent) != null ? _ref._updateChildren() : void 0;
      }
    };

    RbtNode.prototype._uncle = function() {
      var _ref;
      return (_ref = this.parent) != null ? _ref._brother() : void 0;
    };

    RbtNode.prototype._brother = function() {
      var _ref, _ref1;
      if (this._isLeftChild()) {
        return (_ref = this.parent) != null ? _ref.right : void 0;
      } else {
        return (_ref1 = this.parent) != null ? _ref1.left : void 0;
      }
    };

    RbtNode.prototype._isLeftChild = function() {
      var _ref;
      return this === ((_ref = this.parent) != null ? _ref.left : void 0);
    };

    RbtNode.prototype._isRightChild = function() {
      var _ref;
      return this === ((_ref = this.parent) != null ? _ref.right : void 0);
    };

    RbtNode.prototype.toString = function() {
      return this.key + (this.red ? " red " : " black ") + (this.parent ? " P:" + this.parent.key : "") + (this.left ? " L:" + this.left.key : "") + (this.right ? " R:" + this.right.key : "") + " \[\n" + this.children + " \]\n";
    };

    return RbtNode;

  })();

}).call(this);
