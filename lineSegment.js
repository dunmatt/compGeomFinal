// Generated by CoffeeScript 1.4.0
(function() {

  window.LineSegment = (function() {

    function LineSegment(a, b) {
      var _ref;
      this.a = a;
      this.b = b;
      if (this.a.x === this.b.x) {
        this.a.x -= .0001;
      }
      if (this.a.x > this.b.x) {
        _ref = [this.b, this.a], this.a = _ref[0], this.b = _ref[1];
      }
      this.slope = (this.b.y - this.a.y) / (this.b.x - this.a.x);
      this.yIntercept = this.a.y - (this.a.x * this.slope);
    }

    LineSegment.prototype.comparePoint = function(pt) {
      var onLine;
      onLine = this.yCoordAt(pt.x);
      switch (false) {
        case !(this.a.x > pt.x || this.b.x < pt.x):
          return 0;
        case !(Math.abs(pt.y - onLine) < .0001):
          return 0;
        case !(pt.y > onLine):
          return -1;
        case !(pt.y < onLine):
          return 1;
      }
    };

    LineSegment.prototype.compareLine = function(line) {
      return this.comparePoint(line.a) || this.comparePoint(line.b) || this.comparePoint(line.pointAt(this.a.x)) || this.comparePoint(line.pointAt(this.b.x));
    };

    LineSegment.prototype.yCoordAt = function(x) {
      return x * this.slope + this.yIntercept;
    };

    LineSegment.prototype.pointAt = function(x) {
      return {
        x: x,
        y: this.yCoordAt(x)
      };
    };

    LineSegment.prototype.toString = function() {
      return "(" + this.a.x + ", " + this.a.y + ") -> (" + this.b.x + ", " + this.b.y + ")";
    };

    return LineSegment;

  })();

}).call(this);
