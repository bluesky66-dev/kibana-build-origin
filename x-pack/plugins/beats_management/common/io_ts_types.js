"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateFromString = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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

class DateFromStringType extends t.Type {
  constructor() {
    super('DateFromString', u => u instanceof Date, (u, c) => {
      const validation = t.string.validate(u, c);

      if (!(0, _Either.isRight)(validation)) {
        return validation;
      } else {
        const s = validation.right;
        const d = new Date(s);
        return isNaN(d.getTime()) ? t.failure(s, c) : t.success(d);
      }
    }, a => a.toISOString());

    _defineProperty(this, "_tag", 'DateFromISOStringType');
  }

} // eslint-disable-next-line


const DateFromString = new DateFromStringType();
exports.DateFromString = DateFromString;