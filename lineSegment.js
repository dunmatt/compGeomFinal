// Generated by CoffeeScript 1.4.0
(function() {

  window.LineSegment = (function() {

    function LineSegment(a, b) {
      var _ref;
      this.a = a;
      this.b = b;
      if (this.a.x > this.b.x) {
        _ref = [this.b, this.a], this.a = _ref[0], this.b = _ref[1];
      }
      this.slope = (this.b.y - this.a.y) / (this.b.x - this.a.x);
      this.yIntercept = this.a.y - this.a.x * this.slope;
      this.midPoint = {
        x: (a.x + b.x) / 2.0,
        y: (a.y + b.y) / 2.0
      };
    }

    LineSegment.prototype.comparePoint = function(pt) {
      var onLine;
      onLine = this.pointAt(pt.x);
      switch (false) {
        case pt.y !== onLine:
          return 0;
        case !(pt.y > onLine):
          return -1;
        case !(pt.y < onLine):
          return 1;
      }
    };

    LineSegment.prototype.pointAt = function(x) {
      return x * this.slope + this.yIntercept;
    };

    LineSegment.prototype.toString = function() {
      return "(" + this.a.x + ", " + this.a.y + ") -> (" + this.b.x + ", " + this.b.y + ")";
    };

    return LineSegment;

  })();

}).call(this);
