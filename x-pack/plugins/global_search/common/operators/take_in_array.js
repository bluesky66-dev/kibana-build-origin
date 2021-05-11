"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeInArray = takeInArray;

var _rxjs = require("rxjs");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Emits only the first `count` items from the arrays emitted by the source Observable. The limit
 * is global to all emitted values, and not per emission.
 *
 * @example
 * ```ts
 * const source = of([1, 2], [3, 4], [5, 6]);
 * const takeThreeInArray = source.pipe(takeInArray(3));
 * takeThreeInArray.subscribe(x => console.log(x));
 *
 * // Logs:
 * // [1,2]
 * // [3]
 * ```
 *
 * @param count The total maximum number of value to keep from the emitted arrays
 */


function takeInArray(count) {
  return function takeLastOperatorFunction(source) {
    if (count === 0) {
      return _rxjs.EMPTY;
    } else {
      return source.lift(new TakeInArray(count));
    }
  };
}

class TakeInArray {
  constructor(total) {
    this.total = total;

    if (this.total < 0) {
      throw new Error('Cannot take a negative number of items');
    }
  }

  call(subscriber, source) {
    return source.subscribe(new TakeInArraySubscriber(subscriber, this.total));
  }

}

class TakeInArraySubscriber extends _rxjs.Subscriber {
  constructor(destination, total) {
    super(destination);
    this.total = total;

    _defineProperty(this, "current", 0);
  }

  _next(value) {
    const remaining = this.total - this.current;

    if (remaining > value.length) {
      this.destination.next(value);
      this.current += value.length;
    } else {
      this.destination.next(value.slice(0, remaining));
      this.destination.complete();
      this.unsubscribe();
    }
  }

}