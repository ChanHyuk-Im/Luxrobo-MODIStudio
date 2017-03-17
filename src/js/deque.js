define([], function() {
  function Deque() {
    var arr = [];

    this.getLength = function() {
      return arr.length;
    };

    this.popfront = function() {
      if(arr.length === 0)  return undefined;
      return arr.shift();
    };

    this.popback = function() {
      if(arr.length === 0)  return undefined;
      return arr.pop();
    };

    this.pushfront = function(item) {
      arr.unshift(item);
    };

    this.pushback = function(item) {
      arr.push(item);
    };

    this.empty = function() {
      arr = [];
    };
  }

  return {
    Deque: Deque
  };
});