// Generated by CoffeeScript 1.4.0
(function() {

  window.RbtNode = (function() {

    function RbtNode(key, value) {
      this.key = key;
      this.value = value;
      this.parent = null;
      this.black = false;
      this.children = [];
      this.left = null;
      this.right = null;
    }

    RbtNode.prototype.access = function(k) {
      var _ref, _ref1;
      switch (false) {
        case k !== this.key:
          return this.value;
        case !(k < this.key):
          return (_ref = this.left) != null ? _ref.access(k) : void 0;
        case !(k > this.key):
          return (_ref1 = this.right) != null ? _ref1.access(k) : void 0;
      }
    };

    RbtNode.prototype.insert = function(i) {
      switch (false) {
        case !(i.key < this.key):
          this.left = i;
          break;
        case !(i.key > this.key):
          this.right = i;
      }
      return this.children = [this.left, this.right];
    };

    RbtNode.prototype["delete"] = function(i) {};

    return RbtNode;

  })();

}).call(this);
